import app from './app';
import { appConfig } from './config';
import { connectDB } from './db/connection';
import { logError, logger } from './logger';
import './passport/github.strategy';

async function start(): Promise<void> {
  await connectDB();

  app.listen(appConfig.port, () => {
    logger.info(`Auth service running on port ${appConfig.port}`);
  });
}

start().catch((error) => {
  logError('Failed to start auth service', error);
  process.exit(1);
});
