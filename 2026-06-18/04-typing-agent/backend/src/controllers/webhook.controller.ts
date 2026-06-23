import { Request, Response } from 'express';

const TYPING_AGENT_MARKER = '[TypingAgent]';

interface IssueWebhookPayload {
  action: string;
  issue?: {
    title: string;
    body: string | null;
  };
}

export function handleGithubWebhook(req: Request, res: Response): void {
  const event = req.headers['x-github-event'];
  const payload = JSON.parse((req.body as Buffer).toString()) as IssueWebhookPayload;

  if (event === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }

  if (event === 'issues' && payload.action === 'opened' && payload.issue) {
    if (!payload.issue.title.includes(TYPING_AGENT_MARKER)) {
      console.log('Ignoring irrelevant issue:', payload.issue.title);
    } else {
      console.log('New issue title:', payload.issue.title);
      console.log('New issue body:', payload.issue.body ?? '');
    }
  }

  res.status(200).send('OK');
}
