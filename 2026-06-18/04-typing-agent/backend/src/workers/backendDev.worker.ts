import { runBackendDevAgent } from '../agents/backendDev';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';

async function processBackendDevJob(message: AgentJobMessage): Promise<void> {
  const result = await runBackendDevAgent({
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
  });

  console.log(
    `[BackendDev] Generated ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`
  );
}

export function createBackendDevWorker() {
  return createAgentWorker({
    workerName: 'BackendDev',
    queueName: appConfig.sqs.queues.backendDev,
    processJob: processBackendDevJob,
  });
}
