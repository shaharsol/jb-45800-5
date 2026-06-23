import { connectDB } from './db/connection';
import { ensureQueueExists } from './connectors/sqs.connector';
import { startTechLeadWorker } from './workers/techLead.worker';

async function start(): Promise<void> {
  await connectDB();
  await ensureQueueExists();
  startTechLeadWorker();
}

start().catch((error) => {
  console.error('Failed to start TechLead worker:', error);
  process.exit(1);
});
