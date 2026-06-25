import { runFrontendDevAgent } from '../agents/frontendDev';
import { appConfig } from '../config';
import { logger } from '../logger';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';
import { requireFeatureBranch, resolveGithubAccessToken } from './developerWorker.utils';

async function processFrontendDevJob(message: AgentJobMessage): Promise<void> {
  const githubAccessToken = await resolveGithubAccessToken(message.userId);
  const branchName = requireFeatureBranch(message);

  const result = await runFrontendDevAgent(githubAccessToken, {
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    branchName,
  });

  logger.info(
    `[FrontendDev] Committed ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}` +
      (result.pullRequestUrl ? ` — PR: ${result.pullRequestUrl}` : '')
  );
}

export function createFrontendDevWorker() {
  return createAgentWorker({
    workerName: 'FrontendDev',
    queueName: appConfig.sqs.queues.frontendDev,
    processJob: processFrontendDevJob,
  });
}
