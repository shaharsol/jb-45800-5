import { runDevOpsAgent } from '../agents/devOps';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';

async function processDevOpsJob(message: AgentJobMessage): Promise<void> {
  const result = await runDevOpsAgent({
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
  });

  console.log(
    `[DevOps] Generated ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`
  );
}

export function createDevOpsWorker() {
  return createAgentWorker({
    workerName: 'DevOps',
    queueName: appConfig.sqs.queues.devOps,
    processJob: processDevOpsJob,
  });
}
