import { Request, Response } from 'express';
import { logError, logger } from '../logger';
import { enqueueAgentJob } from '../queues/enqueueAgentJob';
import { enqueueCodeReviewJob } from '../queues/enqueueCodeReviewJob';
import { resolveTypingAgentRoute } from '../queues/typingAgent.routing';
import { isCodeReviewerPullRequestTitle } from '../utils/typingAgentMarkers';
import { findUserIdByRepo } from '../services/repoRegistration.service';
import { parseTargetBranchFromIssueBody } from '../utils/issueBody';

function resolveTargetBranch(
  route: ReturnType<typeof resolveTypingAgentRoute>,
  issueBody: string
): string | null {
  if (route === 'techLead' || !route) {
    return null;
  }

  return parseTargetBranchFromIssueBody(issueBody);
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

interface PullRequestWebhookPayload {
  action: string;
  repository?: {
    name: string;
    owner: { login: string };
  };
  pull_request?: {
    number: number;
    title: string;
    body: string | null;
    head: { ref: string };
    base: { ref: string };
  };
}

async function handlePullRequestOpened(
  payload: PullRequestWebhookPayload,
  res: Response
): Promise<boolean> {
  if (payload.action !== 'opened' || !payload.pull_request || !payload.repository) {
    return false;
  }

  const { pull_request: pullRequest, repository } = payload;

  if (!isCodeReviewerPullRequestTitle(pullRequest.title)) {
    logger.info('Ignoring pull request without CodeReviewer marker', {
      title: pullRequest.title,
    });
    res.status(200).send('OK');
    return true;
  }

  logger.info('[webhook] TypingAgent code review PR', { title: pullRequest.title });

  const userId = await findUserIdByRepo(repository.owner.login, repository.name);
  if (!userId) {
    logger.error('No registered user found for repository', {
      repoOwner: repository.owner.login,
      repoName: repository.name,
    });
    res.status(200).send('OK');
    return true;
  }

  try {
    await enqueueCodeReviewJob({
      userId,
      repoOwner: repository.owner.login,
      repoName: repository.name,
      pullRequestNumber: pullRequest.number,
      pullRequestTitle: pullRequest.title,
      pullRequestBody: pullRequest.body ?? '',
      headBranch: pullRequest.head.ref,
      baseBranch: pullRequest.base.ref,
    });
  } catch (error) {
    logError('Failed to enqueue code review job', error);
    res.status(500).json({ message: 'Failed to enqueue job' });
    return true;
  }

  res.status(200).send('OK');
  return true;
}

export async function handleGithubWebhook(req: Request, res: Response): Promise<void> {
  const event = req.headers['x-github-event'];
  const rawPayload = JSON.parse((req.body as Buffer).toString());

  if (event === 'ping') {
    res.status(200).json({ message: 'pong' });
    return;
  }

  if (event === 'pull_request') {
    const handled = await handlePullRequestOpened(rawPayload as PullRequestWebhookPayload, res);
    if (handled) {
      return;
    }
  }

  const payload = rawPayload as IssueWebhookPayload;

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
        resolveTargetBranch(route, issue.body ?? '') ?? undefined;

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
