import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
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

let logtail: Logtail | undefined;
let betterStackFailureLogged = false;

function warnBetterStackMisconfiguration(): void {
  if (betterStackFailureLogged) {
    return;
  }
  betterStackFailureLogged = true;
  process.stderr.write(
    '[logger] Better Stack log shipping failed (Unauthorized). ' +
      'Use a collector secret / source token from Better Stack → Telemetry → Sources, ' +
      'not a global API token. Set BETTERSTACK_COLLECTOR_SECRET (or BETTERSTACK_SOURCE_TOKEN) and, if shown in the source settings, ' +
      'BETTERSTACK_ENDPOINT to your source ingesting host (e.g. https://in.logs.betterstack.com).\n'
  );
}

async function probeBetterStack(sourceToken: string): Promise<void> {
  const probe = new Logtail(sourceToken, {
    endpoint: appConfig.betterStack.endpoint,
    throwExceptions: true,
  });

  try {
    await probe.log('Better Stack transport probe', 'info');
    await probe.flush();
  } catch {
    warnBetterStackMisconfiguration();
  }
}

if (appConfig.betterStack.sourceToken) {
  void probeBetterStack(appConfig.betterStack.sourceToken);

  logtail = new Logtail(appConfig.betterStack.sourceToken, {
    endpoint: appConfig.betterStack.endpoint,
    ignoreExceptions: true,
  });

  transports.push(new LogtailTransport(logtail));
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

async function shutdown(): Promise<void> {
  if (logtail) {
    await logtail.flush();
  }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void shutdown().finally(() => process.exit(0));
  });
}
