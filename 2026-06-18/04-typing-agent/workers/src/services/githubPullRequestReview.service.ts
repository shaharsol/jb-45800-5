import { githubApiFetch } from './githubApi';

export type PullRequestReviewEvent = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';

export interface SubmitPullRequestReviewInput {
  commitSha: string;
  body: string;
  event: PullRequestReviewEvent;
}

export async function submitPullRequestReview(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  input: SubmitPullRequestReviewInput
): Promise<void> {
  await githubApiFetch(
    `/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`,
    accessToken,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commit_id: input.commitSha,
        body: input.body,
        event: input.event,
      }),
    }
  );
}

export async function mergePullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  commitTitle?: string
): Promise<void> {
  await githubApiFetch(`/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, accessToken, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merge_method: 'squash',
      ...(commitTitle ? { commit_title: commitTitle } : {}),
    }),
  });
}

export async function addPullRequestComment(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
): Promise<void> {
  await githubApiFetch(`/repos/${owner}/${repo}/issues/${pullNumber}/comments`, accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}
