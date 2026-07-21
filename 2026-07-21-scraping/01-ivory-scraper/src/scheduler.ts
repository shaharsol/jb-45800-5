import { SendMessageCommand } from "@aws-sdk/client-sqs";
import sqsClient, { createQueueIfNotExist } from "./aws/aws"
import { QueueTypes } from "./enums/queue-types";
import { logger } from "./logger/logger";

async function work() {
    try {
        const queueUrl = await createQueueIfNotExist()
        logger.info('made sure the queue exists')

        const response = await sqsClient.send(
            new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify({
                    type: QueueTypes.SCRAPE_ALL
                }),
            })
        );
        logger.info('sent a SCRAPE ALL message')
        logger.info('scheduler sleeping for 1 hour')

        setTimeout(() => {
            work()
        }, 1000 * 60 * 60)

    } catch (e) {
        console.error(e)
    }


}

work()