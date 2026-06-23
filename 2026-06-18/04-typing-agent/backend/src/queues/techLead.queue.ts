import { sendQueueMessage } from '../connectors/sqs.connector';
import { appConfig } from '../config';
import { TechLeadQueueMessage } from './techLead.queue.types';

export async function enqueueTechLeadJob(message: TechLeadQueueMessage): Promise<void> {
  const messageId = await sendQueueMessage(JSON.stringify(message));

  console.log(
    `[queue] Added message to ${appConfig.sqs.queueName} ` +
      `(messageId=${messageId ?? 'unknown'}) ` +
      `for ${message.repoOwner}/${message.repoName} issue #${message.issueNumber}: "${message.issueTitle}"`
  );
}
