import type { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { getFeed } from '../backend/backend-client.js'
import { handleBackendTool } from './handle-backend-tool.js'

export function registerGetFeedTool(server: McpServer) {
    server.registerTool(
        'getFeed',
        {
            description: 'Returns the authenticated user feed — posts from users they follow',
            inputSchema: z.object({}),
        },
        async () => handleBackendTool(() => getFeed())
    )
}
