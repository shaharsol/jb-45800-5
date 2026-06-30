export function isCodeReviewerPullRequestTitle(title: string): boolean {
  return /\[TypingAgent-CodeReviewer\]/i.test(title);
}
