import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { appConfig } from './config';
import routes from './routes';
import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: appConfig.cors.origin,
    credentials: true,
  })
);
app.use(passport.initialize());

app.use(
  '/api/webhooks/github',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
