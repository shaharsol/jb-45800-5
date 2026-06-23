import OpenAI from 'openai';
import type { Response, ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses';
import { appConfig } from '../config';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!appConfig.openai.apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  if (!client) {
    client = new OpenAI({ apiKey: appConfig.openai.apiKey });
  }

  return client;
}

export interface CreateAgentResponseInput {
  input: ResponseCreateParamsNonStreaming['input'];
  instructions?: string;
  model?: string;
  previousResponseId?: string;
}

export async function createAgentResponse(
  options: CreateAgentResponseInput
): Promise<Response> {
  const openai = getOpenAIClient();

  return openai.responses.create({
    model: options.model ?? appConfig.openai.model,
    instructions: options.instructions ?? appConfig.openai.defaultInstructions,
    input: options.input,
    previous_response_id: options.previousResponseId,
    store: options.previousResponseId !== undefined,
  });
}

export async function createAgentResponseStream(
  options: CreateAgentResponseInput
): Promise<AsyncIterable<OpenAI.Responses.ResponseStreamEvent>> {
  const openai = getOpenAIClient();

  return openai.responses.create({
    model: options.model ?? appConfig.openai.model,
    instructions: options.instructions ?? appConfig.openai.defaultInstructions,
    input: options.input,
    previous_response_id: options.previousResponseId,
    store: options.previousResponseId !== undefined,
    stream: true,
  });
}

export function getResponseText(response: Response): string {
  return response.output_text;
}
