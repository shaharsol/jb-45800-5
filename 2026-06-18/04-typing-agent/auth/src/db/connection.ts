import mongoose from 'mongoose';
import { appConfig } from '../config';
import { logError, logger } from '../logger';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(appConfig.mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logError('MongoDB connection failed', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
}
