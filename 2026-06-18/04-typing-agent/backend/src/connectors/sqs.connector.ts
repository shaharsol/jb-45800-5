import {
  CreateQueueCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
  type Message,
} from '@aws-sdk/client-sqs';
import { appConfig } from '../config';

let client: SQSClient | null = null;
let queueUrl: string | null = null;

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

export async function ensureQueueExists(): Promise<string> {
  if (queueUrl) {
    return queueUrl;
  }

  const sqs = getSqsClient();
  const queueName = appConfig.sqs.queueName;

  try {
    const response = await sqs.send(new GetQueueUrlCommand({ QueueName: queueName }));
    if (response.QueueUrl) {
      queueUrl = response.QueueUrl;
      return queueUrl;
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

    queueUrl = createResponse.QueueUrl;
    console.log(`Created SQS queue: ${queueName}`);
    return queueUrl;
  } catch (error) {
    const err = error as { name?: string };
    if (err.name === 'QueueNameExists' || err.name === 'QueueAlreadyExists') {
      const response = await sqs.send(new GetQueueUrlCommand({ QueueName: queueName }));
      if (!response.QueueUrl) {
        throw new Error(`Queue URL missing for ${queueName}`);
      }
      queueUrl = response.QueueUrl;
      return queueUrl;
    }
    throw error;
  }
}

export async function sendQueueMessage(body: string): Promise<void> {
  const url = await ensureQueueExists();
  const sqs = getSqsClient();

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: url,
      MessageBody: body,
    })
  );
}

export async function receiveQueueMessages(maxMessages = 1): Promise<Message[]> {
  const url = await ensureQueueExists();
  const sqs = getSqsClient();

  const response = await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: url,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: appConfig.sqs.waitTimeSeconds,
      VisibilityTimeout: appConfig.sqs.visibilityTimeoutSeconds,
    })
  );

  return response.Messages ?? [];
}

export async function deleteQueueMessage(receiptHandle: string): Promise<void> {
  const url = await ensureQueueExists();
  const sqs = getSqsClient();

  await sqs.send(
    new DeleteMessageCommand({
      QueueUrl: url,
      ReceiptHandle: receiptHandle,
    })
  );
}
