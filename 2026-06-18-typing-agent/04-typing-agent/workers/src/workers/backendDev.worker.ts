import { runBackendDevAgent } from '../agents/backendDev';
import { appConfig } from '../config';
import { logger } from '../logger';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';
import { requireFeatureBranch, resolveGithubAccessToken } from './developerWorker.utils';

async function processBackendDevJob(message: AgentJobMessage): Promise<void> {
  const githubAccessToken = await resolveGithubAccessToken(message.userId);
  const branchName = requireFeatureBranch(message);

  const result = await runBackendDevAgent(githubAccessToken, {
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    branchName,
  });

  logger.info(
    `[BackendDev] Committed ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}` +
      (result.pullRequestUrl ? ` — PR: ${result.pullRequestUrl}` : '')
  );
}

export function createBackendDevWorker() {
  return createAgentWorker({
    workerName: 'BackendDev',
    queueName: appConfig.sqs.queues.backendDev,
    processJob: processBackendDevJob,
  });
}
