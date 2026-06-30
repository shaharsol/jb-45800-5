import { runTechLeadAgent } from '../agents/techLead';
import { appConfig } from '../config';
import { logger } from '../logger';
import { AgentJobMessage } from '../queues/agentJob.types';
import { findByIdWithAccessToken } from '../services/user.service';
import { createAgentWorker } from './createAgentWorker';

async function processTechLeadJob(message: AgentJobMessage): Promise<void> {
  const user = await findByIdWithAccessToken(message.userId);
  if (!user?.githubAccessToken) {
    throw new Error(`GitHub access token not found for user ${message.userId}`);
  }

  const result = await runTechLeadAgent({
    githubAccessToken: user.githubAccessToken,
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    parentIssueNumber: message.issueNumber,
  });

  logger.info(
    `[TechLead] Created branch ${result.branchName} and ${result.createdIssues.length} sub-issue(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`
  );

  for (const issue of result.createdIssues) {
    logger.info(`[TechLead]   - ${issue.agent}: ${issue.title} (${issue.url})`);
  }
}

export function createTechLeadWorker() {
  return createAgentWorker({
    workerName: 'TechLead',
    queueName: appConfig.sqs.queues.techLead,
    processJob: processTechLeadJob,
  });
}
