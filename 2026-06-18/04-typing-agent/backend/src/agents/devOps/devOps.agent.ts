import { runCodeGenerationAgent } from '../shared/runCodeGenerationAgent';
import { CodeGenerationResult } from '../shared/codeGeneration.schema';
import { DeveloperAgentInput } from '../shared/developerAgent.types';
import { DEVOPS_SYSTEM_PROMPT } from './devOps.prompt';

export async function runDevOpsAgent(input: DeveloperAgentInput): Promise<CodeGenerationResult> {
  return runCodeGenerationAgent('DevOps', DEVOPS_SYSTEM_PROMPT, 'devops_code_generation', input);
}
