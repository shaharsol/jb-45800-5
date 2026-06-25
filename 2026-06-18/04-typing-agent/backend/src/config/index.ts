import config from 'config';

function getConfigString(key: string): string {
  return config.has(key) ? config.get<string>(key) : '';
}

function getBetterStackSourceToken(): string {
  return (
    getConfigString('betterStack.collectorSecret') ||
    getConfigString('betterStack.sourceToken') ||
    getConfigString('betterStack.apiKey')
  );
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
  openai: {
    apiKey: config.get<string>('openai.apiKey'),
    model: config.get<string>('openai.model'),
    defaultInstructions: config.get<string>('openai.defaultInstructions'),
  },
  betterStack: {
    sourceToken: getBetterStackSourceToken(),
    endpoint: config.get<string>('betterStack.endpoint'),
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
    },
    visibilityTimeoutSeconds: config.get<number>('sqs.visibilityTimeoutSeconds'),
    waitTimeSeconds: config.get<number>('sqs.waitTimeSeconds'),
    pollIntervalMs: config.get<number>('sqs.pollIntervalMs'),
    accessKeyId: config.get<string>('sqs.accessKeyId'),
    secretAccessKey: config.get<string>('sqs.secretAccessKey'),
  },
};
