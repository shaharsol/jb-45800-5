import { runCodeGenerationAgent } from '../shared/runCodeGenerationAgent';
import { CodeGenerationResult } from '../shared/codeGeneration.schema';
import { DeveloperAgentInput } from '../shared/developerAgent.types';
import { BACKEND_DEV_SYSTEM_PROMPT } from './backendDev.prompt';

export async function runBackendDevAgent(
  input: DeveloperAgentInput
): Promise<CodeGenerationResult> {
  return runCodeGenerationAgent(
    'BackendDev',
    BACKEND_DEV_SYSTEM_PROMPT,
    'backend_dev_code_generation',
    input
  );
}
