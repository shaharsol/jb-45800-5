import { sendQueueMessage } from '../connectors/sqs.connector';
import { TechLeadQueueMessage } from './techLead.queue.types';

export async function enqueueTechLeadJob(message: TechLeadQueueMessage): Promise<void> {
  await sendQueueMessage(JSON.stringify(message));
  console.log(
    `Enqueued TechLead job for ${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`
  );
}
