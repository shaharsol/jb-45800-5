import { IssueBranch } from '../models/IssueBranch';

export async function saveIssueBranch(
  repoOwner: string,
  repoName: string,
  parentIssueNumber: number,
  branchName: string
): Promise<void> {
  await IssueBranch.findOneAndUpdate(
    { repoOwner, repoName, parentIssueNumber },
    { repoOwner, repoName, parentIssueNumber, branchName },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

export async function findBranchName(
  repoOwner: string,
  repoName: string,
  parentIssueNumber: number
): Promise<string | null> {
  const record = await IssueBranch.findOne({ repoOwner, repoName, parentIssueNumber });
  return record?.branchName ?? null;
}
