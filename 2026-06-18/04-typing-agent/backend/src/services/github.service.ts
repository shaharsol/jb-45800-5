import { appConfig } from '../config';
import { upsertRepoRegistration } from './repoRegistration.service';
import { githubApiFetch } from './githubApi';

interface GitHubRepo {
  name: string;
  owner: { login: string };
  permissions?: { admin?: boolean };
}

interface GitHubHook {
  id: number;
  config: { url: string };
  events: string[];
}

interface GitHubIssue {
  number: number;
  html_url: string;
  title: string;
}

interface GitHubRepoDetails {
  default_branch: string;
}

interface GitHubGitRef {
  object: { sha: string };
}

async function githubFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  return githubApiFetch<T>(path, accessToken, options);
}

async function listAdminRepos(accessToken: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const batch = await githubFetch<GitHubRepo[]>(
      `/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
      accessToken
    );

    if (batch.length === 0) {
      break;
    }

    repos.push(...batch.filter((repo) => repo.permissions?.admin));
    page += 1;
  }

  return repos;
}

async function ensureIssueWebhook(
  accessToken: string,
  owner: string,
  repo: string
): Promise<void> {
  const hooks = await githubFetch<GitHubHook[]>(`/repos/${owner}/${repo}/hooks`, accessToken);
  const webhookUrl = appConfig.github.webhookUrl;

  const existing = hooks.find(
    (hook) => hook.config.url === webhookUrl && hook.events.includes('issues')
  );
  if (existing) {
    return;
  }

  await githubFetch(`/repos/${owner}/${repo}/hooks`, accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'web',
      active: true,
      events: ['issues'],
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: appConfig.github.webhookSecret,
        insecure_ssl: '0',
      },
    }),
  });

  console.log(`Registered issues webhook on ${owner}/${repo}`);
}

export async function createIssue(
  accessToken: string,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<GitHubIssue> {
  return githubFetch<GitHubIssue>(`/repos/${owner}/${repo}/issues`, accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
}

export async function createBranchFromBase(
  accessToken: string,
  owner: string,
  repo: string,
  branchName: string,
  baseBranchName: string
): Promise<void> {
  const baseRef = await githubFetch<GitHubGitRef>(
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranchName)}`,
    accessToken
  );

  try {
    await githubFetch(`/repos/${owner}/${repo}/git/refs`, accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseRef.object.sha,
      }),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('422') &&
      error.message.includes('Reference already exists')
    ) {
      return;
    }
    throw error;
  }
}

export async function createFeatureBranch(
  accessToken: string,
  owner: string,
  repo: string,
  branchName: string
): Promise<void> {
  const repoDetails = await githubFetch<GitHubRepoDetails>(
    `/repos/${owner}/${repo}`,
    accessToken
  );

  await createBranchFromBase(accessToken, owner, repo, branchName, repoDetails.default_branch);
}

export async function registerIssueWebhooksForUser(
  accessToken: string,
  userId: string
): Promise<void> {
  const repos = await listAdminRepos(accessToken);

  for (const repo of repos) {
    try {
      await ensureIssueWebhook(accessToken, repo.owner.login, repo.name);
      await upsertRepoRegistration(userId, repo.owner.login, repo.name);
    } catch (error) {
      console.error(
        `Failed to register webhook for ${repo.owner.login}/${repo.name}:`,
        error
      );
    }
  }
}
