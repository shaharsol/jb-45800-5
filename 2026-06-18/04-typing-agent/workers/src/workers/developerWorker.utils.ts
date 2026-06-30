import { AgentJobMessage } from '../queues/agentJob.types';
import { findByIdWithAccessToken } from '../services/user.service';

export async function resolveGithubAccessToken(userId: string): Promise<string> {
  const user = await findByIdWithAccessToken(userId);
  if (!user?.githubAccessToken) {
    throw new Error(`GitHub access token not found for user ${userId}`);
  }
  return user.githubAccessToken;
}

export function requireFeatureBranch(message: AgentJobMessage): string {
  if (!message.branchName) {
    throw new Error(`${message.issueTitle} job missing branchName`);
  }
  return message.branchName;
}
