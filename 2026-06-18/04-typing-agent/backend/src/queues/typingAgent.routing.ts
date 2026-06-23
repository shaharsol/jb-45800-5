import { appConfig } from '../config';

export type TypingAgentRoute = 'techLead' | 'backendDev' | 'frontendDev' | 'devOps';

export function resolveTypingAgentRoute(title: string): TypingAgentRoute | null {
  if (/\[TypingAgent-BackendDev\]/i.test(title)) {
    return 'backendDev';
  }
  if (/\[TypingAgent-FrontendDev\]/i.test(title)) {
    return 'frontendDev';
  }
  if (/\[TypingAgent-DevOps\]/i.test(title)) {
    return 'devOps';
  }
  if (/\[TypingAgent\]/.test(title)) {
    return 'techLead';
  }
  return null;
}

export function getQueueNameForRoute(route: TypingAgentRoute): string {
  return appConfig.sqs.queues[route];
}
