import { runCodeGenerationAgent } from '../shared/runCodeGenerationAgent';
import { CodeGenerationResult } from '../shared/codeGeneration.schema';
import { DeveloperAgentInput } from '../shared/developerAgent.types';
import { FRONTEND_DEV_SYSTEM_PROMPT } from './frontendDev.prompt';

export async function runFrontendDevAgent(
  input: DeveloperAgentInput
): Promise<CodeGenerationResult> {
  return runCodeGenerationAgent(
    'FrontendDev',
    FRONTEND_DEV_SYSTEM_PROMPT,
    'frontend_dev_code_generation',
    input
  );
}
