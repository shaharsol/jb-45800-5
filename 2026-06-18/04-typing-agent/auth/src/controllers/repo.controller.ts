import { Request, Response } from 'express';
import { findUserIdByRepo } from '../services/repoRegistration.service';

export async function getUserIdByRepo(req: Request, res: Response): Promise<void> {
  const repoOwner = req.params.repoOwner;
  const repoName = req.params.repoName;

  if (Array.isArray(repoOwner) || Array.isArray(repoName)) {
    res.status(400).json({ message: 'Invalid repository path' });
    return;
  }

  const userId = await findUserIdByRepo(repoOwner, repoName);
  if (!userId) {
    res.status(404).json({ message: 'Repository not registered' });
    return;
  }

  res.json({ userId });
}
