import type { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { getFollowers } from '../backend/backend-client.js'
import { handleBackendTool } from './handle-backend-tool.js'

export function registerGetFollowersTool(server: McpServer) {
    server.registerTool(
        'getFollowers',
        {
            description: 'Returns the list of users who follow the authenticated user',
            inputSchema: z.object({}),
        },
        async () => handleBackendTool(() => getFollowers())
    )
}
