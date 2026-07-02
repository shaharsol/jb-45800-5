import { ErrorRequestHandler } from 'express';
import { logError } from '../logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  logError('Request failed', err);
  res.status(status).json({ message });
};
