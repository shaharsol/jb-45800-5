import config from 'config';

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
  },
  frontend: {
    url: config.get<string>('frontend.url'),
  },
  cors: {
    origin: config.get<string>('cors.origin'),
  },
};
