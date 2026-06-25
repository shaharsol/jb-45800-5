import { appConfig } from '../config';

export type AgentConfigKey = 'backendDev' | 'frontendDev' | 'devOps';

const AGENT_NAME_TO_CONFIG_KEY: Record<string, AgentConfigKey> = {
  BackendDev: 'backendDev',
  FrontendDev: 'frontendDev',
  DevOps: 'devOps',
};

export interface AgentGitIdentity {
  name: string;
  email: string;
}

function toAgentSlug(agentName: string): string {
  return agentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getAgentConfigKey(agentName: string): AgentConfigKey | undefined {
  return AGENT_NAME_TO_CONFIG_KEY[agentName];
}

export function getAgentGitIdentity(agentName: string): AgentGitIdentity {
  const configKey = getAgentConfigKey(agentName);
  const agentConfig = configKey ? appConfig.github.agents[configKey] : undefined;

  return {
    name: agentConfig?.name || `TypingAgent-${agentName}`,
    email: agentConfig?.email || `${toAgentSlug(agentName)}@typing-agent.local`,
  };
}

/** Token for git writes that should appear as the agent (commits + PRs). */
export function resolveAgentGithubAccessToken(
  agentName: string,
  userAccessToken: string
): string {
  const configKey = getAgentConfigKey(agentName);
  const agentToken = configKey ? appConfig.github.agents[configKey].accessToken : '';
  return agentToken || userAccessToken;
}

export function hasAgentGithubAccessToken(agentName: string): boolean {
  const configKey = getAgentConfigKey(agentName);
  if (!configKey) {
    return false;
  }
  return Boolean(appConfig.github.agents[configKey].accessToken);
}
