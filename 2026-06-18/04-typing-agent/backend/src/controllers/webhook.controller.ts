import { Request, Response } from 'express';
import { logError, logger } from '../logger';
import { enqueueAgentJob } from '../queues/enqueueAgentJob';
import { resolveTypingAgentRoute } from '../queues/typingAgent.routing';
import { findBranchName } from '../services/issueBranch.service';
import { findUserIdByRepo } from '../services/repoRegistration.service';
import {
  parseParentIssueNumberFromBody,
  parseTargetBranchFromIssueBody,
} from '../utils/issueBody';

async function resolveTargetBranch(
  route: ReturnType<typeof resolveTypingAgentRoute>,
  repoOwner: string,
  repoName: string,
  issueBody: string
): Promise<string | null> {
  if (route === 'techLead' || !route) {
    return null;
  }

  const fromBody = parseTargetBranchFromIssueBody(issueBody);
  if (fromBody) {
    return fromBody;
  }

  const parentNum = parseParentIssueNumberFromBody(issueBody);
  if (!parentNum) {
    return null;
  }

  return findBranchName(repoOwner, repoName, parentNum);
}

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

export async function handleGithubWebhook(req: Request, res: Response): Promise<void> {
  const event = req.headers['x-github-event'];
  const payload = JSON.parse((req.body as Buffer).toString()) as IssueWebhookPayload;

  if (event === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }

  if (event === 'issues' && payload.action === 'opened' && payload.issue && payload.repository) {
    const { issue, repository } = payload;
    const route = resolveTypingAgentRoute(issue.title);

    if (!route) {
      logger.info('Ignoring irrelevant issue', { title: issue.title });
      res.status(200).send('OK');
      return;
    }

    logger.info(`[webhook] TypingAgent issue (${route})`, { title: issue.title });
    logger.info('[webhook] Issue body', { body: issue.body ?? '' });

    const userId = await findUserIdByRepo(repository.owner.login, repository.name);
    if (!userId) {
      logger.error('No registered user found for repository', {
        repoOwner: repository.owner.login,
        repoName: repository.name,
      });
      res.status(200).send('OK');
      return;
    }

    try {
      const branchName =
        (await resolveTargetBranch(
          route,
          repository.owner.login,
          repository.name,
          issue.body ?? ''
        )) ?? undefined;

      if (route !== 'techLead' && !branchName) {
        logger.error('[webhook] No target branch for sub-agent issue', {
          route,
          issueNumber: issue.number,
          repoOwner: repository.owner.login,
          repoName: repository.name,
        });
        res.status(200).send('OK');
        return;
      }

      await enqueueAgentJob(route, {
        userId,
        repoOwner: repository.owner.login,
        repoName: repository.name,
        issueNumber: issue.number,
        issueTitle: issue.title,
        issueBody: issue.body ?? '',
        branchName,
      });
    } catch (error) {
      logError(`Failed to enqueue ${route} job`, error);
      res.status(500).json({ message: 'Failed to enqueue job' });
      return;
    }
  }

  res.status(200).send('OK');
}
