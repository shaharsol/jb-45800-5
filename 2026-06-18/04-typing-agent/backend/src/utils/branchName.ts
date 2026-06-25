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

export type DeveloperAgentRole = 'backend-dev' | 'frontend-dev' | 'devops';

export function buildDeveloperBranchName(
  featureBranchName: string,
  agentRole: DeveloperAgentRole,
  issueNumber: number
): string {
  // Use hyphens, not slashes: Git cannot have both refs/heads/foo and refs/heads/foo/bar.
  return `${featureBranchName}-${agentRole}-${issueNumber}`;
}
