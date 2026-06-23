import { connectDB } from './db/connection';
import { ensureQueueExists } from './connectors/sqs.connector';
import { appConfig } from './config';
import { createBackendDevWorker } from './workers/backendDev.worker';
import { createDevOpsWorker } from './workers/devOps.worker';
import { createFrontendDevWorker } from './workers/frontendDev.worker';
import { createTechLeadWorker } from './workers/techLead.worker';

type WorkerType = 'techLead' | 'backendDev' | 'frontendDev' | 'devOps';

const WORKER_FACTORIES: Record<WorkerType, () => { start: () => void }> = {
  techLead: createTechLeadWorker,
  backendDev: createBackendDevWorker,
  frontendDev: createFrontendDevWorker,
  devOps: createDevOpsWorker,
};

async function start(): Promise<void> {
  const workerType = (process.env.WORKER_TYPE || 'techLead') as WorkerType;
  const createWorker = WORKER_FACTORIES[workerType];

  if (!createWorker) {
    throw new Error(`Unknown WORKER_TYPE: ${workerType}`);
  }

  await connectDB();
  await ensureQueueExists(appConfig.sqs.queues[workerType]);
  createWorker().start();
}

start().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});
