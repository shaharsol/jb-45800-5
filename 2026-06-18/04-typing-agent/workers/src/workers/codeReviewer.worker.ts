import { runCodeReviewerAgent } from '../agents/codeReviewer';
import { appConfig } from '../config';
import { logger } from '../logger';
import { CodeReviewJobMessage } from '../queues/codeReviewJob.types';
import { createAgentWorker } from './createAgentWorker';
import { resolveGithubAccessToken } from './developerWorker.utils';

function jobLabel(message: CodeReviewJobMessage): string {
  return `${message.repoOwner}/${message.repoName} PR #${message.pullRequestNumber}`;
}

async function processCodeReviewJob(message: CodeReviewJobMessage): Promise<void> {
  const githubAccessToken = await resolveGithubAccessToken(message.userId);

  const result = await runCodeReviewerAgent(githubAccessToken, message);

  logger.info(
    `[CodeReviewer] ${result.decision === 'approve' ? 'Approved' : 'Declined'} ` +
      `${jobLabel(message)}` +
      (result.merged ? ' (merged)' : '')
  );
}

export function createCodeReviewerWorker() {
  return createAgentWorker<CodeReviewJobMessage>({
    workerName: 'CodeReviewer',
    queueName: appConfig.sqs.queues.codeReviewer,
    processJob: processCodeReviewJob,
    describeJob: jobLabel,
  });
}
