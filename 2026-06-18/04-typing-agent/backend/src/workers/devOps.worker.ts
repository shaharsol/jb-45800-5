import { runDevOpsAgent } from '../agents/devOps';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';
import { requireFeatureBranch, resolveGithubAccessToken } from './developerWorker.utils';

async function processDevOpsJob(message: AgentJobMessage): Promise<void> {
  const githubAccessToken = await resolveGithubAccessToken(message.userId);
  const branchName = requireFeatureBranch(message);

  const result = await runDevOpsAgent(githubAccessToken, {
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    branchName,
  });

  console.log(
    `[DevOps] Committed ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}` +
      (result.pullRequestUrl ? ` — PR: ${result.pullRequestUrl}` : '')
  );
}

export function createDevOpsWorker() {
  return createAgentWorker({
    workerName: 'DevOps',
    queueName: appConfig.sqs.queues.devOps,
    processJob: processDevOpsJob,
  });
}
