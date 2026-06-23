export const CODE_FILE_SCHEMA = {
  type: 'object',
  properties: {
    path: { type: 'string', minLength: 1 },
    content: { type: 'string' },
  },
  required: ['path', 'content'],
  additionalProperties: false,
} as const;

export const CODE_GENERATION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    files: {
      type: 'array',
      items: CODE_FILE_SCHEMA,
    },
  },
  required: ['files'],
  additionalProperties: false,
} as const;

export interface GeneratedCodeFile {
  path: string;
  content: string;
}

export interface CodeGenerationResult {
  files: GeneratedCodeFile[];
  openaiResponseId: string;
}
