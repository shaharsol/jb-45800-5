import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DatadogWinston from 'datadog-winston';
import { appConfig } from './config';

const LOG_FILE = appConfig.logging.file;

fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaKeys = Object.keys(meta).filter((key) => key !== 'service');
        const metaSuffix =
          metaKeys.length > 0 ? ` ${JSON.stringify(Object.fromEntries(metaKeys.map((k) => [k, meta[k]])))}` : '';
        return `${timestamp} ${level}: ${message}${metaSuffix}`;
      })
    ),
  }),
  new winston.transports.File({
    filename: LOG_FILE,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),
];

if (appConfig.datadog.apiKey) {
  const ddtags = [
    appConfig.datadog.tokenId ? `token_id:${appConfig.datadog.tokenId}` : null,
    `site:${appConfig.datadog.site}`,
  ]
    .filter(Boolean)
    .join(',');

  transports.push(
    new DatadogWinston({
      apiKey: appConfig.datadog.apiKey,
      service: appConfig.logging.serviceName,
      ddsource: appConfig.datadog.source,
      ddtags,
      intakeRegion: appConfig.datadog.intakeRegion || undefined,
    })
  );
}

export const logger = winston.createLogger({
  level: appConfig.logging.level,
  defaultMeta: { service: appConfig.logging.serviceName },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

function serializeError(error: unknown): Record<string, unknown> | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }
  return { name: error.name, message: error.message, stack: error.stack };
}

export function logError(message: string, error?: unknown): void {
  logger.error(message, { error: serializeError(error) ?? error });
}
