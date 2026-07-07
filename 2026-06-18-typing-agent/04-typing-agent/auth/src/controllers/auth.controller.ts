import { Request, Response } from 'express';
import { appConfig } from '../config';
import { logError } from '../logger';
import { IUser } from '../models/User';
import { signToken } from '../services/auth.service';
import { registerIssueWebhooksForUser } from '../services/github.service';
import { findByIdWithAccessToken } from '../services/user.service';

export async function callback(req: Request, res: Response): Promise<void> {
  const user = req.user as unknown as IUser;
  const userWithToken = await findByIdWithAccessToken(user._id.toString());

  if (userWithToken?.githubAccessToken) {
    registerIssueWebhooksForUser(
      userWithToken.githubAccessToken,
      user._id.toString()
    ).catch((error) => {
      logError('Failed to register issue webhooks', error);
    });
  }

  const token = signToken(user._id.toString());
  res.redirect(`${appConfig.frontend.url}?token=${token}`);
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token');
  res.json({ success: true });
}
