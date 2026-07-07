import { sendQueueMessage } from '../connectors/sqs.connector';
import { appConfig } from '../config';
import { logger } from '../logger';
import { CodeReviewJobMessage } from './codeReviewJob.types';

export async function enqueueCodeReviewJob(message: CodeReviewJobMessage): Promise<void> {
  const queueName = appConfig.sqs.queues.codeReviewer;
  const messageId = await sendQueueMessage(queueName, JSON.stringify(message));

  logger.info(
    `[queue] Added code review message to ${queueName} ` +
      `(messageId=${messageId ?? 'unknown'}) ` +
      `for ${message.repoOwner}/${message.repoName} PR #${message.pullRequestNumber}: ` +
      `"${message.pullRequestTitle}"`
  );
}
