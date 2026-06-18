import type { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { createPost } from '../backend/backend-client.js'
import { handleBackendTool } from './handle-backend-tool.js'

export function registerCreatePostTool(server: McpServer) {
    server.registerTool(
        'createPost',
        {
            description: 'Create a new text-only post for the authenticated user',
            inputSchema: z.object({
                title: z.string().min(10).max(40).describe('Post title (10-40 characters)'),
                body: z.string().min(20).describe('Post body (at least 20 characters)'),
            }),
        },
        async ({ title, body }) => handleBackendTool(() => createPost({ title, body }))
    )
}
