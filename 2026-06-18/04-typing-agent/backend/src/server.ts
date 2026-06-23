import app from './app';
import { appConfig } from './config';
import { connectDB } from './db/connection';
import { ensureAllQueuesExist } from './connectors/sqs.connector';
import './passport/github.strategy';

async function start(): Promise<void> {
  await connectDB();
  await ensureAllQueuesExist();

  app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
