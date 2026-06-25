export function slugifyIssueTitle(title: string): string {
  const slug = title
    .replace(/\[TypingAgent[^\]]*\]/gi, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return slug || 'issue';
}

export function buildFeatureBranchName(issueNumber: number, issueTitle: string): string {
  return `feature-${issueNumber}-${slugifyIssueTitle(issueTitle)}`;
}
