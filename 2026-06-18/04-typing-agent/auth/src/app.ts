import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { appConfig } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();

app.use(requestLogger);
app.use(cookieParser());
app.use(
  cors({
    origin: appConfig.cors.origin,
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;
