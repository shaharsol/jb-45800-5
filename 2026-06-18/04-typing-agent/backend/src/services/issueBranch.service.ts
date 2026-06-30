import { IssueBranch } from '../models/IssueBranch';

export async function findBranchName(
  repoOwner: string,
  repoName: string,
  parentIssueNumber: number
): Promise<string | null> {
  const record = await IssueBranch.findOne({ repoOwner, repoName, parentIssueNumber });
  return record?.branchName ?? null;
}
