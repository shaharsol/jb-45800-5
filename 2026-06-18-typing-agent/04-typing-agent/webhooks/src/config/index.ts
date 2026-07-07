import config from 'config';

function getConfigString(key: string): string {
  return config.has(key) ? config.get<string>(key) : '';
}

function getDatadogApiKey(): string {
  return getConfigString('datadog.apiKey') || getConfigString('datadog.tokenSecret');
}

export const appConfig = {
  port: config.get<number>('port'),
  authService: {
    url: getConfigString('authService.url') || 'http://localhost:3000',
  },
  github: {
    webhookSecret: config.get<string>('github.webhookSecret'),
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
  sqs: {
    region: config.get<string>('sqs.region'),
    endpoint: config.has('sqs.endpoint') ? config.get<string>('sqs.endpoint') : '',
    queues: {
      techLead: config.get<string>('sqs.queues.techLead'),
      backendDev: config.get<string>('sqs.queues.backendDev'),
      frontendDev: config.get<string>('sqs.queues.frontendDev'),
      devOps: config.get<string>('sqs.queues.devOps'),
      codeReviewer: config.get<string>('sqs.queues.codeReviewer'),
    },
    visibilityTimeoutSeconds: config.get<number>('sqs.visibilityTimeoutSeconds'),
    accessKeyId: config.get<string>('sqs.accessKeyId'),
    secretAccessKey: config.get<string>('sqs.secretAccessKey'),
  },
};
