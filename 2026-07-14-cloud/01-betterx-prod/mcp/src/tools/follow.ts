import type { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { follow } from '../backend/backend-client.js'
import { handleBackendTool } from './handle-backend-tool.js'

export function registerFollowTool(server: McpServer) {
    server.registerTool(
        'follow',
        {
            description: 'Follow another user by ID',
            inputSchema: z.object({
                followeeId: z.string().uuid().describe('The user ID to follow'),
            }),
        },
        async ({ followeeId }) => handleBackendTool(() => follow(followeeId))
    )
}
