import { getOpenAIClient } from '../../connectors/openai.connector';
import { appConfig } from '../../config';
import { fetchRepositorySnapshot } from '../../services/repositoryContent.service';
import { RepositorySnapshot } from '../../types/repository.types';
import {
  CODE_GENERATION_RESPONSE_SCHEMA,
  CodeGenerationResult,
  GeneratedCodeFile,
} from './codeGeneration.schema';
import { DeveloperAgentInput } from './developerAgent.types';

const REPOSITORY_FILE_EXCERPT_CHARS = 400;

function excerptContent(content: string): string {
  if (content.length <= REPOSITORY_FILE_EXCERPT_CHARS) {
    return content;
  }
  return `${content.slice(0, REPOSITORY_FILE_EXCERPT_CHARS)}… (${content.length} chars total)`;
}

function logLoadedRepositoryFiles(
  agentName: string,
  branchName: string,
  repository: RepositorySnapshot
): void {
  const truncationNote = repository.truncated
    ? `; ${repository.skippedCount} additional file(s) omitted due to size or limits`
    : '';

  console.log(
    `[${agentName}] Loaded ${repository.files.length} repository file(s) from ${branchName}${truncationNote}:`
  );

  for (const file of repository.files) {
    console.log(`[${agentName}]   - ${file.path}`);
    console.log(excerptContent(file.content));
    console.log(`[${agentName}]   --- end excerpt ${file.path} ---`);
  }
}

function buildUserMessage(input: DeveloperAgentInput, repository: RepositorySnapshot): string {
  const repositoryNote = repository.truncated
    ? `Repository files (${repository.files.length} included; ${repository.skippedCount} additional files omitted due to size or limits):`
    : `Repository files (${repository.files.length}):`;

  return [
    `Repository: ${input.repoOwner}/${input.repoName}`,
    `Issue number: #${input.issueNumber}`,
    `Issue title: ${input.issueTitle}`,
    `Work branch: ${input.workBranchName}`,
    `Target branch for PRs: ${input.branchName}`,
    'Issue body:',
    input.issueBody || '(empty)',
    '',
    repositoryNote,
    JSON.stringify(repository.files),
  ].join('\n');
}

function logGeneratedFiles(
  agentName: string,
  commitMessage: string,
  files: GeneratedCodeFile[]
): void {
  console.log(`[${agentName}] Commit message: ${commitMessage}`);
  console.log(`[${agentName}] Generated ${files.length} file(s):`);
  for (const file of files) {
    console.log(`[${agentName}] --- ${file.path} ---`);
    console.log(file.content);
    console.log(`[${agentName}] --- end ${file.path} ---`);
  }
}

export async function runCodeGenerationAgent(
  agentName: string,
  systemPrompt: string,
  schemaName: string,
  githubAccessToken: string,
  input: DeveloperAgentInput
): Promise<CodeGenerationResult> {
  const repository = await fetchRepositorySnapshot(
    githubAccessToken,
    input.repoOwner,
    input.repoName,
    input.workBranchName
  );

  logLoadedRepositoryFiles(agentName, input.workBranchName, repository);

  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model: appConfig.openai.model,
    instructions: systemPrompt,
    input: buildUserMessage(input, repository),
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        strict: true,
        schema: CODE_GENERATION_RESPONSE_SCHEMA,
      },
    },
  });

  const responseText = response.output_text;
  if (!responseText) {
    throw new Error(`${agentName} agent received an empty response from OpenAI`);
  }

  const parsed = JSON.parse(responseText) as {
    commitMessage: string;
    files: GeneratedCodeFile[];
  };
  logGeneratedFiles(agentName, parsed.commitMessage, parsed.files);

  return {
    commitMessage: parsed.commitMessage,
    files: parsed.files,
    openaiResponseId: response.id,
  };
}
