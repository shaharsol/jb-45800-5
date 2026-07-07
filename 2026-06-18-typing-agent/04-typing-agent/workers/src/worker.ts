import { ensureQueueExists } from './connectors/sqs.connector';
import { appConfig } from './config';
import { logError } from './logger';
import { createBackendDevWorker } from './workers/backendDev.worker';
import { createCodeReviewerWorker } from './workers/codeReviewer.worker';
import { createDevOpsWorker } from './workers/devOps.worker';
import { createFrontendDevWorker } from './workers/frontendDev.worker';
import { createTechLeadWorker } from './workers/techLead.worker';

type WorkerType = 'techLead' | 'backendDev' | 'frontendDev' | 'devOps' | 'codeReviewer';

const WORKER_FACTORIES: Record<WorkerType, () => { start: () => void }> = {
  techLead: createTechLeadWorker,
  backendDev: createBackendDevWorker,
  frontendDev: createFrontendDevWorker,
  devOps: createDevOpsWorker,
  codeReviewer: createCodeReviewerWorker,
};

async function start(): Promise<void> {
  const workerType = (process.env.WORKER_TYPE || 'techLead') as WorkerType;
  const createWorker = WORKER_FACTORIES[workerType];

  if (!createWorker) {
    throw new Error(`Unknown WORKER_TYPE: ${workerType}`);
  }

  await ensureQueueExists(appConfig.sqs.queues[workerType]);
  createWorker().start();
}

start().catch((error) => {
  logError('Failed to start worker', error);
  process.exit(1);
});
