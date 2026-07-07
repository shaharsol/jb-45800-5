export interface AgentJobMessage {
  userId: string;
  repoOwner: string;
  repoName: string;
  issueNumber: number;
  issueTitle: string;
  issueBody: string;
  /** Feature branch created by TechLead; required for developer agent jobs. */
  branchName?: string;
}
