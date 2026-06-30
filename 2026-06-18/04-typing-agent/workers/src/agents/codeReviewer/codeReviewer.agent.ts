import { getOpenAIClient } from '../../connectors/openai.connector';
import { appConfig } from '../../config';
import { logger } from '../../logger';
import { CodeReviewJobMessage } from '../../queues/codeReviewJob.types';
import {
  addPullRequestComment,
  mergePullRequest,
} from '../../services/githubPullRequestReview.service';
import { fetchPullRequestSnapshot } from '../../services/pullRequestContent.service';
import { PullRequestSnapshot } from '../../types/pullRequest.types';
import { resolveAgentGithubAccessToken } from '../../utils/agentIdentity';
import {
  CODE_REVIEW_RESPONSE_SCHEMA,
  CODE_REVIEWER_SYSTEM_PROMPT,
  CodeReviewAgentResult,
  CodeReviewDecision,
} from './codeReviewer.prompt';

const PATCH_EXCERPT_CHARS = 400;

function excerptPatch(patch: string | null): string {
  if (!patch) {
    return '(no patch available — likely a binary or large file)';
  }
  if (patch.length <= PATCH_EXCERPT_CHARS) {
    return patch;
  }
  return `${patch.slice(0, PATCH_EXCERPT_CHARS)}… (${patch.length} chars total)`;
}

function logPullRequestFiles(agentName: string, snapshot: PullRequestSnapshot): void {
  const truncationNote = snapshot.truncated
    ? `; ${snapshot.skippedCount} additional file(s) omitted due to limits`
    : '';

  logger.info(
    `[${agentName}] Loaded ${snapshot.files.length} changed file(s) from PR #${snapshot.number}${truncationNote}:`
  );

  for (const file of snapshot.files) {
    logger.info(`[${agentName}]   - ${file.path} (${file.status})`);
    logger.info(excerptPatch(file.patch));
    logger.info(`[${agentName}]   --- end excerpt ${file.path} ---`);
  }
}

function buildUserMessage(snapshot: PullRequestSnapshot): string {
  const truncationNote = snapshot.truncated
    ? `Additional files omitted: ${snapshot.skippedCount}`
    : null;

  const fileSummaries = snapshot.files.map((file) => ({
    path: file.path,
    status: file.status,
    patch: file.patch,
  }));

  return [
    `Pull request #${snapshot.number}: ${snapshot.title}`,
    `URL: ${snapshot.htmlUrl}`,
    `Head branch: ${snapshot.headRef}`,
    `Base branch: ${snapshot.baseRef}`,
    'PR description:',
    snapshot.body || '(empty)',
    truncationNote,
    `Changed files (${snapshot.files.length}):`,
    JSON.stringify(fileSummaries, null, 2),
  ]
    .filter(Boolean)
    .join('\n');
}

export async function runCodeReviewerAgent(
  githubAccessToken: string,
  input: CodeReviewJobMessage
): Promise<CodeReviewAgentResult> {
  const agentName = 'CodeReviewer';
  const agentGithubToken = resolveAgentGithubAccessToken(agentName, githubAccessToken);

  const snapshot = await fetchPullRequestSnapshot(
    agentGithubToken,
    input.repoOwner,
    input.repoName,
    input.pullRequestNumber
  );

  logPullRequestFiles(agentName, snapshot);

  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model: appConfig.openai.model,
    instructions: CODE_REVIEWER_SYSTEM_PROMPT,
    input: buildUserMessage(snapshot),
    text: {
      format: {
        type: 'json_schema',
        name: 'code_reviewer_decision',
        strict: true,
        schema: CODE_REVIEW_RESPONSE_SCHEMA,
      },
    },
  });

  const responseText = response.output_text;
  if (!responseText) {
    throw new Error('CodeReviewer agent received an empty response from OpenAI');
  }

  const parsed = JSON.parse(responseText) as CodeReviewDecision;
  logger.info(`[${agentName}] Decision: ${parsed.decision}`);
  logger.info(`[${agentName}] Review body: ${parsed.reviewBody}`);

  if (parsed.decision === 'approve') {
    await addPullRequestComment(
      agentGithubToken,
      input.repoOwner,
      input.repoName,
      input.pullRequestNumber,
      `**TypingAgent CodeReviewer — approved**\n\n${parsed.reviewBody}`
    );

    await mergePullRequest(
      agentGithubToken,
      input.repoOwner,
      input.repoName,
      input.pullRequestNumber,
      parsed.mergeCommitTitle.trim() || `Merge PR #${input.pullRequestNumber}`
    );

    logger.info(
      `[${agentName}] Merged PR #${input.pullRequestNumber} ` +
        `(${snapshot.headRef} -> ${snapshot.baseRef})`
    );

    return {
      decision: 'approve',
      reviewBody: parsed.reviewBody,
      merged: true,
      openaiResponseId: response.id,
    };
  }

  await addPullRequestComment(
    agentGithubToken,
    input.repoOwner,
    input.repoName,
    input.pullRequestNumber,
    `**TypingAgent CodeReviewer — changes requested**\n\n${parsed.reviewBody}`
  );

  logger.info(
    `[${agentName}] Declined PR #${input.pullRequestNumber} with review comments`
  );

  return {
    decision: 'decline',
    reviewBody: parsed.reviewBody,
    merged: false,
    openaiResponseId: response.id,
  };
}
