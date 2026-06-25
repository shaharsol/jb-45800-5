export const CODE_REVIEWER_PR_TITLE_MARKER = '[TypingAgent-CodeReviewer]';

export function formatCodeReviewerPullRequestTitle(title: string): string {
  if (/\[TypingAgent-CodeReviewer\]/i.test(title)) {
    return title;
  }
  return `${CODE_REVIEWER_PR_TITLE_MARKER} ${title}`;
}

export function isCodeReviewerPullRequestTitle(title: string): boolean {
  return /\[TypingAgent-CodeReviewer\]/i.test(title);
}
