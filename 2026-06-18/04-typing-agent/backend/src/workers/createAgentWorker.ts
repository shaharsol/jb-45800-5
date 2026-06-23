import {
  deleteQueueMessage,
  receiveQueueMessages,
} from '../connectors/sqs.connector';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';

type JobProcessor = (message: AgentJobMessage) => Promise<void>;

interface AgentWorkerOptions {
  workerName: string;
  queueName: string;
  processJob: JobProcessor;
}

function jobLabel(message: AgentJobMessage): string {
  return `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`;
}

export function createAgentWorker(options: AgentWorkerOptions): {
  start: () => void;
  stop: () => void;
} {
  let running = false;

  function parseMessage(body: string): AgentJobMessage {
    return JSON.parse(body) as AgentJobMessage;
  }

  async function pollOnce(): Promise<void> {
    console.log(`[${options.workerName}] Fetching message from queue ${options.queueName}...`);

    const messages = await receiveQueueMessages(options.queueName, 1);
    if (messages.length === 0) {
      return;
    }

    for (const message of messages) {
      if (!message.Body || !message.ReceiptHandle) {
        continue;
      }

      const payload = parseMessage(message.Body);
      console.log(
        `[${options.workerName}] Received message for ${jobLabel(payload)} ` +
          `(sqsMessageId=${message.MessageId ?? 'unknown'})`
      );

      try {
        console.log(`[${options.workerName}] Sending job to agent for ${jobLabel(payload)}`);
        await options.processJob(payload);
        await deleteQueueMessage(options.queueName, message.ReceiptHandle);
        console.log(
          `[${options.workerName}] Agent succeeded for ${jobLabel(payload)}. Deleted message from queue.`
        );
      } catch (error) {
        console.error(`[${options.workerName}] Agent failed for ${jobLabel(payload)}:`, error);
      }
    }
  }

  async function pollLoop(): Promise<void> {
    while (running) {
      try {
        await pollOnce();
      } catch (error) {
        console.error(`[${options.workerName}] Failed to fetch message from queue:`, error);
      }

      await new Promise((resolve) => setTimeout(resolve, appConfig.sqs.pollIntervalMs));
    }
  }

  return {
    start(): void {
      if (running) {
        return;
      }
      running = true;
      console.log(`[${options.workerName}] Worker started (queue: ${options.queueName})`);
      void pollLoop();
    },
    stop(): void {
      running = false;
    },
  };
}
