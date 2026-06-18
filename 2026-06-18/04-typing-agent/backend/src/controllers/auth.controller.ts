import { Request, Response } from 'express';
import { appConfig } from '../config';
import { IUser } from '../models/User';
import { signToken } from '../services/auth.service';

export function callback(req: Request, res: Response): void {
  const user = req.user as unknown as IUser;
  const token = signToken(user._id.toString());
  res.redirect(`${appConfig.frontend.url}?token=${token}`);
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token');
  res.json({ success: true });
}
