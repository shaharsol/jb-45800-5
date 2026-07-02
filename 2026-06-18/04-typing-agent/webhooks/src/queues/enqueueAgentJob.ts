import { sendQueueMessage } from '../connectors/sqs.connector';
import { logger } from '../logger';
import { AgentJobMessage } from './agentJob.types';
import { getQueueNameForRoute, TypingAgentRoute } from './typingAgent.routing';

export async function enqueueAgentJob(
  route: TypingAgentRoute,
  message: AgentJobMessage
): Promise<void> {
  const queueName = getQueueNameForRoute(route);
  const messageId = await sendQueueMessage(queueName, JSON.stringify(message));

  logger.info(
    `[queue] Added message to ${queueName} ` +
      `(messageId=${messageId ?? 'unknown'}) ` +
      `for ${message.repoOwner}/${message.repoName} issue #${message.issueNumber}: "${message.issueTitle}"`
  );
}
