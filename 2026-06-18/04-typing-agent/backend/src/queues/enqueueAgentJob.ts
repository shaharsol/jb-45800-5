import { sendQueueMessage } from '../connectors/sqs.connector';
import { AgentJobMessage } from './agentJob.types';
import { getQueueNameForRoute, TypingAgentRoute } from './typingAgent.routing';

export async function enqueueAgentJob(
  route: TypingAgentRoute,
  message: AgentJobMessage
): Promise<void> {
  const queueName = getQueueNameForRoute(route);
  const messageId = await sendQueueMessage(queueName, JSON.stringify(message));

  console.log(
    `[queue] Added message to ${queueName} ` +
      `(messageId=${messageId ?? 'unknown'}) ` +
      `for ${message.repoOwner}/${message.repoName} issue #${message.issueNumber}: "${message.issueTitle}"`
  );
}
