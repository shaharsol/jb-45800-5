import { createMcpExpressApp } from '@modelcontextprotocol/express'
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node'
import config from 'config'
import type { Request, Response } from 'express'
import { createMcpServer } from './server.js'
import extractAuth from './middleware/extract-auth.js'

const port = config.get<number>('app.port')
const name = config.get<string>('app.name')

const app = createMcpExpressApp()

app.get('/health', (request, response) => {
    response.json({ status: 'ok' })
})

app.post('/mcp', extractAuth, async (request: Request, response: Response) => {
    const server = createMcpServer()

    try {
        const transport = new NodeStreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        })

        await server.connect(transport)
        await transport.handleRequest(request, response, request.body)

        response.on('close', () => {
            transport.close()
            server.close()
        })
    } catch (e) {
        console.error('error handling mcp request', e)

        if (!response.headersSent) {
            response.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'internal server error',
                },
                id: null,
            })
        }
    }
})

app.get('/mcp', async (request: Request, response: Response) => {
    response.status(405).json({
        jsonrpc: '2.0',
        error: {
            code: -32000,
            message: 'method not allowed',
        },
        id: null,
    })
})

app.listen(port, () => console.log(`app ${name} started on port ${port}....`))
