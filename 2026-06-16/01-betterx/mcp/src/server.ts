import { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'
import { registerFollowTool } from './tools/follow.js'
import { registerGetFeedTool } from './tools/get-feed.js'
import { registerGetFollowersTool } from './tools/get-followers.js'
import { registerGetFollowingTool } from './tools/get-following.js'

export function createMcpServer() {
    const server = new McpServer(
        {
            name: 'betterx-mcp',
            version: '1.0.0',
        },
        {
            instructions: 'Tools for BetterX follows and feed. Requires a valid JWT in the Authorization header.',
        }
    )

    server.registerTool(
        'ping',
        {
            description: 'Health check tool that returns pong',
            inputSchema: z.object({}),
        },
        async () => {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'pong',
                    },
                ],
            }
        }
    )

    registerGetFollowersTool(server)
    registerGetFollowingTool(server)
    registerGetFeedTool(server)
    registerFollowTool(server)

    return server
}
