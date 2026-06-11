import { McpServer } from '@modelcontextprotocol/server'
import * as z from 'zod/v4'

export function createMcpServer() {
    const server = new McpServer(
        {
            name: 'betterx-mcp',
            version: '1.0.0',
        },
        {
            instructions: 'Tools for managing BetterX follows. Requires a valid JWT in the Authorization header.',
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

    return server
}
