import { runFrontendDevAgent } from '../agents/frontendDev';
import { appConfig } from '../config';
import { AgentJobMessage } from '../queues/agentJob.types';
import { createAgentWorker } from './createAgentWorker';

async function processFrontendDevJob(message: AgentJobMessage): Promise<void> {
  if (!message.branchName) {
    throw new Error('FrontendDev job missing branchName');
  }

  const result = await runFrontendDevAgent({
    repoOwner: message.repoOwner,
    repoName: message.repoName,
    issueNumber: message.issueNumber,
    issueTitle: message.issueTitle,
    issueBody: message.issueBody,
    branchName: message.branchName,
  });

  console.log(
    `[FrontendDev] Generated ${result.files.length} file(s) for ` +
      `${message.repoOwner}/${message.repoName} issue #${message.issueNumber}`
  );
}

export function createFrontendDevWorker() {
  return createAgentWorker({
    workerName: 'FrontendDev',
    queueName: appConfig.sqs.queues.frontendDev,
    processJob: processFrontendDevJob,
  });
}
