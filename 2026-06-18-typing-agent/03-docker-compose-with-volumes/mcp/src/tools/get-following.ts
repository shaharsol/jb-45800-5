import type { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { getFollowing } from '../backend/backend-client.js'
import { handleBackendTool } from './handle-backend-tool.js'

export function registerGetFollowingTool(server: McpServer) {
    server.registerTool(
        'getFollowing',
        {
            description: 'Returns the list of users the authenticated user follows',
            inputSchema: z.object({}),
        },
        async () => handleBackendTool(() => getFollowing())
    )
}
