import { Request, Response } from 'express';
import { enqueueTechLeadJob } from '../queues/techLead.queue';
import { findUserIdByRepo } from '../services/repoRegistration.service';

const TYPING_AGENT_MARKER = '[TypingAgent]';
const TYPING_AGENT_SUB_MARKER = '[TypingAgent]-';

interface IssueWebhookPayload {
  action: string;
  repository?: {
    name: string;
    owner: { login: string };
  };
  issue?: {
    number: number;
    title: string;
    body: string | null;
  };
}

function isTechLeadParentIssue(title: string): boolean {
  return title.includes(TYPING_AGENT_MARKER) && !title.includes(TYPING_AGENT_SUB_MARKER);
}

export async function handleGithubWebhook(req: Request, res: Response): Promise<void> {
  const event = req.headers['x-github-event'];
  const payload = JSON.parse((req.body as Buffer).toString()) as IssueWebhookPayload;

  if (event === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }

  if (event === 'issues' && payload.action === 'opened' && payload.issue && payload.repository) {
    const { issue, repository } = payload;

    if (!isTechLeadParentIssue(issue.title)) {
      console.log('Ignoring irrelevant issue:', issue.title);
      res.status(200).send('OK');
      return;
    }

    console.log('New issue title:', issue.title);
    console.log('New issue body:', issue.body ?? '');

    const userId = await findUserIdByRepo(repository.owner.login, repository.name);
    if (!userId) {
      console.error(
        `No registered user found for repository ${repository.owner.login}/${repository.name}`
      );
      res.status(200).send('OK');
      return;
    }

    try {
      await enqueueTechLeadJob({
        userId,
        repoOwner: repository.owner.login,
        repoName: repository.name,
        issueNumber: issue.number,
        issueTitle: issue.title,
        issueBody: issue.body ?? '',
      });
    } catch (error) {
      console.error('Failed to enqueue TechLead job:', error);
      res.status(500).json({ message: 'Failed to enqueue job' });
      return;
    }
  }

  res.status(200).send('OK');
}
