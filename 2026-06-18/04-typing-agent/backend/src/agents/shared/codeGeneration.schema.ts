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
    commitMessage: { type: 'string', minLength: 1 },
    files: {
      type: 'array',
      items: CODE_FILE_SCHEMA,
    },
  },
  required: ['commitMessage', 'files'],
  additionalProperties: false,
} as const;

export interface GeneratedCodeFile {
  path: string;
  content: string;
}

export interface CodeGenerationResult {
  commitMessage: string;
  files: GeneratedCodeFile[];
  openaiResponseId: string;
}

export const CODE_GENERATION_SHARED_RULES = `Repository context:
- The user message includes "Repository files" — a JSON array of { path, content } objects from the work branch.
- Read existing code carefully before proposing changes. Match project conventions, imports, and structure.

Output format (for a later GitHub commit via the Git Data API):
- Return only the JSON object matching the provided schema.
- commitMessage: a concise conventional commit message describing the change.
- files: only the files you create or modify. Each entry must contain the full final file content (path includes directories and extension). Unlisted files are left unchanged when the commit is applied.
- Do not include explanations outside the JSON.`;
