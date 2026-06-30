import { getOpenAIClient } from '../../connectors/openai.connector';
import { appConfig } from '../../config';
import { createFeatureBranch, createIssue } from '../../services/github.service';
import { saveIssueBranch } from '../../services/issueBranch.service';
import { buildFeatureBranchName } from '../../utils/branchName';
import {
  TECH_LEAD_SYSTEM_PROMPT,
  TECH_LEAD_TASK_PLAN_SCHEMA,
} from './techLead.prompt';
import {
  CreatedSubIssue,
  TECH_LEAD_AGENT_MARKERS,
  TechLeadAgentInput,
  TechLeadAgentResult,
  TechLeadSubAgent,
  TechLeadTaskDraft,
  TechLeadTaskPlan,
} from './techLead.types';

const AGENT_TASK_FIELDS: Array<{
  agent: TechLeadSubAgent;
  field: keyof TechLeadTaskPlan;
}> = [
  { agent: 'BackendDev', field: 'backendDev' },
  { agent: 'FrontendDev', field: 'frontendDev' },
  { agent: 'DevOps', field: 'devOps' },
];

function buildIssueTitle(agent: TechLeadSubAgent, taskTitle: string): string {
  return `${TECH_LEAD_AGENT_MARKERS[agent]} ${taskTitle}`;
}

function buildIssueBody(
  task: TechLeadTaskDraft,
  input: TechLeadAgentInput & { branchName: string }
): string {
  const parentRef = input.parentIssueNumber
    ? `Derived from parent issue #${input.parentIssueNumber}.\n`
    : `Derived from parent issue: ${input.issueTitle}\n`;

  return `${parentRef}Target branch: ${input.branchName}\n\n${task.body}`;
}

function buildUserMessage(input: TechLeadAgentInput): string {
  return [
    `Repository: ${input.repoOwner}/${input.repoName}`,
    input.parentIssueNumber ? `Parent issue number: #${input.parentIssueNumber}` : null,
    `Parent issue title: ${input.issueTitle}`,
    'Parent issue body:',
    input.issueBody || '(empty)',
  ]
    .filter(Boolean)
    .join('\n');
}

function parseTaskPlan(responseText: string): TechLeadTaskPlan {
  return JSON.parse(responseText) as TechLeadTaskPlan;
}

async function planTasks(input: TechLeadAgentInput): Promise<{
  plan: TechLeadTaskPlan;
  openaiResponseId: string;
}> {
  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model: appConfig.openai.model,
    instructions: TECH_LEAD_SYSTEM_PROMPT,
    input: buildUserMessage(input),
    text: {
      format: {
        type: 'json_schema',
        name: 'tech_lead_task_plan',
        strict: true,
        schema: TECH_LEAD_TASK_PLAN_SCHEMA,
      },
    },
  });

  const responseText = response.output_text;
  if (!responseText) {
    throw new Error('TechLead agent received an empty response from OpenAI');
  }

  return {
    plan: parseTaskPlan(responseText),
    openaiResponseId: response.id,
  };
}

async function createSubIssues(
  input: TechLeadAgentInput & { branchName: string },
  plan: TechLeadTaskPlan
): Promise<CreatedSubIssue[]> {
  const createdIssues: CreatedSubIssue[] = [];

  for (const { agent, field } of AGENT_TASK_FIELDS) {
    const task = plan[field];
    if (!task) {
      continue;
    }

    const title = buildIssueTitle(agent, task.title);
    const body = buildIssueBody(task, input);

    const issue = await createIssue(
      input.githubAccessToken,
      input.repoOwner,
      input.repoName,
      title,
      body
    );

    createdIssues.push({
      agent,
      issueNumber: issue.number,
      url: issue.html_url,
      title,
    });
  }

  return createdIssues;
}

export async function runTechLeadAgent(
  input: TechLeadAgentInput
): Promise<TechLeadAgentResult> {
  if (!input.parentIssueNumber) {
    throw new Error('TechLead agent requires parentIssueNumber');
  }

  const branchName = buildFeatureBranchName(input.parentIssueNumber, input.issueTitle);
  await createFeatureBranch(
    input.githubAccessToken,
    input.repoOwner,
    input.repoName,
    branchName
  );
  await saveIssueBranch(
    input.repoOwner,
    input.repoName,
    input.parentIssueNumber,
    branchName
  );

  const inputWithBranch = { ...input, branchName };
  const { plan, openaiResponseId } = await planTasks(inputWithBranch);
  const createdIssues = await createSubIssues(inputWithBranch, plan);

  return {
    plan,
    createdIssues,
    openaiResponseId,
    branchName,
  };
}
