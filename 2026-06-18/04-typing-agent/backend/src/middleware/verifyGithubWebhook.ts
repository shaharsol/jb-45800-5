import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { appConfig } from '../config';

export function verifyGithubWebhook(req: Request, res: Response, next: NextFunction): void {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature || typeof signature !== 'string') {
    res.status(401).json({ message: 'Missing webhook signature' });
    return;
  }

  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody)) {
    res.status(400).json({ message: 'Invalid webhook payload' });
    return;
  }

  const expected =
    'sha256=' +
    crypto.createHmac('sha256', appConfig.github.webhookSecret).update(rawBody).digest('hex');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    res.status(401).json({ message: 'Invalid webhook signature' });
    return;
  }

  next();
}
