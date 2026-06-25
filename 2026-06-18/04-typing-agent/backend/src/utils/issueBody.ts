export function parseTargetBranchFromIssueBody(body: string): string | null {
  const match = body.match(/^Target branch:\s*(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

export function parseParentIssueNumberFromBody(body: string): number | null {
  const match = body.match(/Derived from parent issue #(\d+)/i);
  if (!match) {
    return null;
  }
  return parseInt(match[1], 10);
}
