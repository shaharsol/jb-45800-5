import { deleteQueueMessage, receiveQueueMessages } from '../connectors/sqs.connector';
import { runTechLeadAgent } from '../agents/techLead';
import { appConfig } from '../config';
import { TechLeadQueueMessage } from '../queues/techLead.queue.types';
import { findByIdWithAccessToken } from '../services/user.service';

let running = false;

function jobLabel(message: TechLeadQueueMessage): string {
  return `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`;
}

function parseMessage(body: string): TechLeadQueueMessage {
  return JSON.parse(body) as TechLeadQueueMessage;
}

async function processTechLeadMessage(message: TechLeadQueueMessage): Promise<void> {
  console.log(`[worker] Sending job to TechLead agent for ${jobLabel(message)}`);

  const user = await findByIdWithAccessToken(message.userId);
  if (!user?.githubAccessToken) {
    throw new Error(`GitHub access token not found for user ${message.userId}`);
  }

  const result = await runTechLeadAgent({
    githubAccessToken: user.githubAccessToken,
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    parentIssueNumber: message.issueNumber,
  });

  console.log(
    `[worker] TechLead agent succeeded for ${jobLabel(message)}. ` +
      `Created ${result.createdIssues.length} sub-issue(s).`
  );

  for (const issue of result.createdIssues) {
    console.log(`[worker]   - ${issue.agent}: ${issue.title} (${issue.url})`);
  }
}

async function pollOnce(): Promise<void> {
  console.log(`[worker] Fetching message from queue ${appConfig.sqs.queueName}...`);

  const messages = await receiveQueueMessages(1);

  if (messages.length === 0) {
    return;
  }

  for (const message of messages) {
    if (!message.Body || !message.ReceiptHandle) {
      continue;
    }

    const payload = parseMessage(message.Body);
    console.log(
      `[worker] Received message from queue for ${jobLabel(payload)} ` +
        `(sqsMessageId=${message.MessageId ?? 'unknown'})`
    );

    try {
      await processTechLeadMessage(payload);
      await deleteQueueMessage(message.ReceiptHandle);
      console.log(`[worker] Deleted message from queue for ${jobLabel(payload)}`);
    } catch (error) {
      console.error(`[worker] TechLead agent failed for ${jobLabel(payload)}:`, error);
    }
  }
}

async function pollLoop(): Promise<void> {
  while (running) {
    try {
      await pollOnce();
    } catch (error) {
      console.error('[worker] Failed to fetch message from queue:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, appConfig.sqs.pollIntervalMs));
  }
}

export function startTechLeadWorker(): void {
  if (running) {
    return;
  }

  running = true;
  console.log(`[worker] TechLead worker started (queue: ${appConfig.sqs.queueName})`);
  void pollLoop();
}

export function stopTechLeadWorker(): void {
  running = false;
}
