import { runDevOpsAgent } from '../agents/devOps';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';

async function processDevOpsJob(message: AgentJobMessage): Promise<void> {
  if (!message.branchName) {
    throw new Error('DevOps job missing branchName');
  }

  const result = await runDevOpsAgent({
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    branchName: message.branchName,
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
