import {
  deleteQueueMessage,
  receiveQueueMessages,
} from '../connectors/sqs.connector';
import { appConfig } from '../config';
import { logError, logger } from '../logger';
type JobProcessor<T> = (message: T) => Promise<void>;

interface AgentWorkerOptions<T> {
  workerName: string;
  queueName: string;
  processJob: JobProcessor<T>;
  describeJob?: (message: T) => string;
}

export function createAgentWorker<T>(options: AgentWorkerOptions<T>): {
  start: () => void;
  stop: () => void;
} {
  let running = false;

  function parseMessage(body: string): T {
    return JSON.parse(body) as T;
  }

  function jobLabel(message: T): string {
    if (options.describeJob) {
      return options.describeJob(message);
    }

    const record = message as Record<string, unknown>;
    if (typeof record.repoOwner === 'string' && typeof record.repoName === 'string') {
      if (typeof record.pullRequestNumber === 'number') {
        return `${record.repoOwner}/${record.repoName} PR #${record.pullRequestNumber}`;
      }
      if (typeof record.issueNumber === 'number') {
        return `${record.repoOwner}/${record.repoName} issue #${record.issueNumber}`;
      }
    }

    return JSON.stringify(message);
  }

  async function pollOnce(): Promise<void> {
    logger.info(`[${options.workerName}] Fetching message from queue ${options.queueName}...`);

    const messages = await receiveQueueMessages(options.queueName, 1);
    if (messages.length === 0) {
      return;
    }

    for (const message of messages) {
      if (!message.Body || !message.ReceiptHandle) {
        continue;
      }

      const payload = parseMessage(message.Body);
      logger.info(
        `[${options.workerName}] Received message for ${jobLabel(payload)} ` +
          `(sqsMessageId=${message.MessageId ?? 'unknown'})`
      );

      try {
        logger.info(`[${options.workerName}] Sending job to agent for ${jobLabel(payload)}`);
        await options.processJob(payload);
        await deleteQueueMessage(options.queueName, message.ReceiptHandle);
        logger.info(
          `[${options.workerName}] Agent succeeded for ${jobLabel(payload)}. Deleted message from queue.`
        );
      } catch (error) {
        logError(`[${options.workerName}] Agent failed for ${jobLabel(payload)}`, error);
      }
    }
  }

  async function pollLoop(): Promise<void> {
    while (running) {
      try {
        await pollOnce();
      } catch (error) {
        logError(`[${options.workerName}] Failed to fetch message from queue`, error);
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
      logger.info(`[${options.workerName}] Worker started (queue: ${options.queueName})`);
      void pollLoop();
    },
    stop(): void {
      running = false;
    },
  };
}
