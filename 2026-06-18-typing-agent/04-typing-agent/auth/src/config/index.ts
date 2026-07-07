import config from 'config';

function getConfigString(key: string): string {
  return config.has(key) ? config.get<string>(key) : '';
}

function getDatadogApiKey(): string {
  return getConfigString('datadog.apiKey') || getConfigString('datadog.tokenSecret');
}

export const appConfig = {
  port: config.get<number>('port'),
  mongoUri: config.get<string>('mongoUri'),
  jwt: {
    secret: config.get<string>('jwt.secret'),
    expiresIn: config.get<string>('jwt.expiresIn'),
  },
  github: {
    clientId: config.get<string>('github.clientId'),
    clientSecret: config.get<string>('github.clientSecret'),
    callbackUrl: config.get<string>('github.callbackUrl'),
    webhookUrl: config.get<string>('github.webhookUrl'),
    webhookSecret: config.get<string>('github.webhookSecret'),
  },
  frontend: {
    url: config.get<string>('frontend.url'),
  },
  cors: {
    origin: config.get<string>('cors.origin'),
  },
  serviceAuth: {
    secret: getConfigString('serviceAuth.secret'),
  },
  datadog: {
    apiKey: getDatadogApiKey(),
    tokenId: getConfigString('datadog.tokenId'),
    site: getConfigString('datadog.site') || 'datadoghq.com',
    source: getConfigString('datadog.source') || 'nodejs',
    intakeRegion: getConfigString('datadog.intakeRegion'),
  },
  logging: {
    level: config.get<string>('logging.level'),
    file: config.get<string>('logging.file'),
    serviceName: config.get<string>('logging.serviceName'),
  },
};
