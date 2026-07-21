import { DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import sqsClient from "./aws/aws";
import config from 'config'
import { QueueTypes } from "./enums/queue-types";
import { logger } from "./logger/logger";

async function work() {

    logger.info('starting to work...')

    const response = await sqsClient.send(new GetQueueUrlCommand({
        QueueName: config.get('aws.queue')
    }));

    const queueUrl = response.QueueUrl

    logger.info(`got queue url ${queueUrl}`)

    while (true) {
        const message = await sqsClient.send(new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10,
            // VisibilityTimeout: appConfig.sqs.visibilityTimeoutSeconds,
        }))

        if (message.Messages) {
            logger.info(`received ${message.Messages.length} messages`)

            if (message.Messages[0]) {
                const { type } = JSON.parse(message.Messages[0].Body)
                switch (type) {
                    case QueueTypes.SCRAPE_ALL:
                        console.log('scraping all')
                        break;
                    case QueueTypes.SCRAPE_CATEGORY:
                        console.log('scraping category')
                        break;
                    case QueueTypes.SCRAPE_PRODUCT:
                        console.log('scraping product')
                        break;
                    default:
                        break;
                }

                logger.info(`processed message ${message.Messages[0].ReceiptHandle}`)

                await sqsClient.send(
                    new DeleteMessageCommand({
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.Messages[0].ReceiptHandle,
                    })
                );

                logger.info(`deleted message ${message.Messages[0].ReceiptHandle}`)
            }

        } else {
            logger.info('no message in queue...')
        }

    }
}


(async () => {
    work()
})()