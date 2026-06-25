import { getOpenAIClient } from '../../connectors/openai.connector';
import { appConfig } from '../../config';
import {
  CODE_GENERATION_RESPONSE_SCHEMA,
  CodeGenerationResult,
  GeneratedCodeFile,
} from './codeGeneration.schema';
import { DeveloperAgentInput } from './developerAgent.types';

function buildUserMessage(input: DeveloperAgentInput): string {
  return [
    `Repository: ${input.repoOwner}/${input.repoName}`,
    `Issue number: #${input.issueNumber}`,
    `Issue title: ${input.issueTitle}`,
    `Target branch for PRs: ${input.branchName}`,
    'Issue body:',
    input.issueBody || '(empty)',
  ].join('\n');
}

function logGeneratedFiles(agentName: string, files: GeneratedCodeFile[]): void {
  console.log(`[${agentName}] Generated ${files.length} file(s):`);
  for (const file of files) {
    console.log(`[${agentName}] --- ${file.path} ---`);
    console.log(file.content);
    console.log(`[${agentName}] --- end ${file.path} ---`);
  }
}

export async function runCodeGenerationAgent(
  agentName: string,
  systemPrompt: string,
  schemaName: string,
  input: DeveloperAgentInput
): Promise<CodeGenerationResult> {
  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model: appConfig.openai.model,
    instructions: systemPrompt,
    input: buildUserMessage(input),
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        strict: true,
        schema: CODE_GENERATION_RESPONSE_SCHEMA,
      },
    },
  });

  const responseText = response.output_text;
  if (!responseText) {
    throw new Error(`${agentName} agent received an empty response from OpenAI`);
  }

  const parsed = JSON.parse(responseText) as { files: GeneratedCodeFile[] };
  logGeneratedFiles(agentName, parsed.files);

  return {
    files: parsed.files,
    openaiResponseId: response.id,
  };
}
