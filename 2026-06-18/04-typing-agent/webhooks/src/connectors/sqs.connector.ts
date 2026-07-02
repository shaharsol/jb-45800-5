import {
  CreateQueueCommand,
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { appConfig } from '../config';
import { logger } from '../logger';

let client: SQSClient | null = null;
const queueUrls = new Map<string, string>();

function getSqsClient(): SQSClient {
  if (!client) {
    const config: ConstructorParameters<typeof SQSClient>[0] = {
      region: appConfig.sqs.region,
    };

    if (appConfig.sqs.endpoint) {
      config.endpoint = appConfig.sqs.endpoint;
    }

    if (appConfig.sqs.accessKeyId && appConfig.sqs.secretAccessKey) {
      config.credentials = {
        accessKeyId: appConfig.sqs.accessKeyId,
        secretAccessKey: appConfig.sqs.secretAccessKey,
      };
    }

    client = new SQSClient(config);
  }

  return client;
}

export async function ensureQueueExists(queueName: string): Promise<string> {
  const cached = queueUrls.get(queueName);
  if (cached) {
    return cached;
  }

  const sqs = getSqsClient();

  try {
    const response = await sqs.send(new GetQueueUrlCommand({ QueueName: queueName }));
    if (response.QueueUrl) {
      queueUrls.set(queueName, response.QueueUrl);
      return response.QueueUrl;
    }
  } catch {
    // Queue does not exist yet.
  }

  try {
    const createResponse = await sqs.send(
      new CreateQueueCommand({
        QueueName: queueName,
        Attributes: {
          VisibilityTimeout: String(appConfig.sqs.visibilityTimeoutSeconds),
        },
      })
    );

    if (!createResponse.QueueUrl) {
      throw new Error(`Failed to create queue ${queueName}`);
    }

    queueUrls.set(queueName, createResponse.QueueUrl);
    logger.info(`Created SQS queue: ${queueName}`);
    return createResponse.QueueUrl;
  } catch (error) {
    const err = error as { name?: string };
    if (err.name === 'QueueNameExists' || err.name === 'QueueAlreadyExists') {
      const response = await sqs.send(new GetQueueUrlCommand({ QueueName: queueName }));
      if (!response.QueueUrl) {
        throw new Error(`Queue URL missing for ${queueName}`);
      }
      queueUrls.set(queueName, response.QueueUrl);
      return response.QueueUrl;
    }
    throw error;
  }
}

export async function ensureAllQueuesExist(): Promise<void> {
  const queueNames = Object.values(appConfig.sqs.queues);
  await Promise.all(queueNames.map((queueName) => ensureQueueExists(queueName)));
}

export async function sendQueueMessage(
  queueName: string,
  body: string
): Promise<string | undefined> {
  const url = await ensureQueueExists(queueName);
  const sqs = getSqsClient();

  const response = await sqs.send(
    new SendMessageCommand({
      QueueUrl: url,
      MessageBody: body,
    })
  );

  return response.MessageId;
}
