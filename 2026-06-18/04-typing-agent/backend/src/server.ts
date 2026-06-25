import app from './app';
import { appConfig } from './config';
import { connectDB } from './db/connection';
import { ensureAllQueuesExist } from './connectors/sqs.connector';
import { logError, logger } from './logger';
import './passport/github.strategy';

async function start(): Promise<void> {
  await connectDB();
  await ensureAllQueuesExist();

  app.listen(appConfig.port, () => {
    logger.info(`Server running on port ${appConfig.port}`);
  });
}

start().catch((error) => {
  logError('Failed to start server', error);
  process.exit(1);
});
