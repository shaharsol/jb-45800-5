import { deleteQueueMessage, receiveQueueMessages } from '../connectors/sqs.connector';
import { runTechLeadAgent } from '../agents/techLead';
import { appConfig } from '../config';
import { TechLeadQueueMessage } from '../queues/techLead.queue.types';
import { findByIdWithAccessToken } from '../services/user.service';

let running = false;

function parseMessage(body: string): TechLeadQueueMessage {
  return JSON.parse(body) as TechLeadQueueMessage;
}

async function processTechLeadMessage(message: TechLeadQueueMessage): Promise<void> {
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
    `TechLead agent completed for ${message.repoOwner}/${message.repoName} issue #${message.issueNumber}. Created ${result.createdIssues.length} sub-issue(s).`
  );
}

async function pollOnce(): Promise<void> {
  const messages = await receiveQueueMessages(1);

  for (const message of messages) {
    if (!message.Body || !message.ReceiptHandle) {
      continue;
    }

    const payload = parseMessage(message.Body);
    console.log(
      `Processing TechLead job for ${payload.repoOwner}/${payload.repoName} issue #${payload.issueNumber}`
    );

    try {
      await processTechLeadMessage(payload);
      await deleteQueueMessage(message.ReceiptHandle);
      console.log(
        `Deleted TechLead queue message for issue #${payload.issueNumber}`
      );
    } catch (error) {
      console.error(
        `TechLead job failed for ${payload.repoOwner}/${payload.repoName} issue #${payload.issueNumber}:`,
        error
      );
    }
  }
}

async function pollLoop(): Promise<void> {
  while (running) {
    try {
      await pollOnce();
    } catch (error) {
      console.error('TechLead worker poll error:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, appConfig.sqs.pollIntervalMs));
  }
}

export function startTechLeadWorker(): void {
  if (running) {
    return;
  }

  running = true;
  console.log(`TechLead worker started (queue: ${appConfig.sqs.queueName})`);
  void pollLoop();
}

export function stopTechLeadWorker(): void {
  running = false;
}
