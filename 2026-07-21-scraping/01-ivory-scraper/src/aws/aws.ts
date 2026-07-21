import { CreateQueueCommand, SQSClient } from "@aws-sdk/client-sqs";
import config from 'config'

// cloning an object this way, clones the 1st level fields, but the sub docs remain identical
// const s3Config = {...config.get<object>('aws.connection')}

// this is a way to clone deeply
const sqsConfig = JSON.parse(JSON.stringify(config.get('aws.connection')))
const sqsClient = new SQSClient(sqsConfig)

export async function createQueueIfNotExist() {
    try {
        // create the bucket....
        const response = await sqsClient.send(new CreateQueueCommand({
            QueueName: config.get('aws.queue'),
            Attributes: {
                VisibilityTimeout: String(config.get('aws.visibilityTimeoutSeconds')),
            },
        }))
        console.log('created queue', response)
        return response.QueueUrl
    } catch (e) {
        // ignore
        console.log('exception in create queue, probably already exist', e)
    }
}

export default sqsClient