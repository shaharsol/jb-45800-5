export interface DeveloperAgentInputBase {
  repoOwner: string;
  repoName: string;
  issueNumber: number;
  issueTitle: string;
  issueBody: string;
  /** Feature branch created by TechLead; base branch for the developer's PR. */
  branchName: string;
}

export interface DeveloperAgentInput extends DeveloperAgentInputBase {
  /** Branch created by the developer agent, derived from the feature branch. */
  workBranchName: string;
}
