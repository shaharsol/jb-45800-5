import type { NextFunction, Request, Response } from "express";
import config from 'config'
import openai from "../../openai/openai";

const betterxMcpTools = ['getFollowers', 'getFollowing', 'getFeed', 'follow']

function extractJwt(request: Request): string | null {
    const authHeader = request.get('Authorization')

    if (!authHeader?.startsWith('Bearer')) {
        return null
    }

    const [, jwt] = authHeader.split(' ')

    return jwt || null
}

export async function freeTextRequest(request: Request<{}, {}, { prompt: string }>, response: Response, next: NextFunction) {
    try {
        const { prompt } = request.body
        const jwt = extractJwt(request)

        if (!jwt) {
            return next({
                status: 401,
                message: 'auth header is missing!'
            })
        }

        const systemPrompt = `
You are a BetterX assistant.
You will receive a user prompt that should be satisfied using the available MCP tools.
Use the MCP tools when needed to answer the user accurately.
`.trim()


console.log(`mcp server runs on ${config.get<string>('mcp.server')}`)

        const llmResponse = await openai.responses.create({
            model: 'gpt-4.1-mini',
            input: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            tools: [
                {
                    type: 'mcp',
                    server_label: 'betterx',
                    server_url: config.get<string>('mcp.server'),
                    allowed_tools: betterxMcpTools,
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    require_approval: 'never',
                },
            ],
        })

        const answer = llmResponse.output_text?.trim()

        if (!answer) {
            return next({
                status: 500,
                message: 'could not extract response from llm'
            })
        }

        response.json({
            prompt,
            answer,
        })
    } catch (e) {
        console.error('free text request error', e)
        next(e)
    }
}
