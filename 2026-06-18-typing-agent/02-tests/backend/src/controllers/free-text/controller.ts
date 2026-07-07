import type { NextFunction, Request, Response } from "express";
import config from 'config'
import openai from "../../openai/openai";
import ChatMessage from "../../models/ChatMessage";
import type { EasyInputMessage } from "openai/resources/responses/responses";

const betterxMcpTools = ['getFollowers', 'getFollowing', 'getFeed', 'createPost', 'follow']

function extractJwt(request: Request): string | null {
    const authHeader = request.get('Authorization')

    if (!authHeader?.startsWith('Bearer')) {
        return null
    }

    const [, jwt] = authHeader.split(' ')

    return jwt || null
}

export async function freeTextRequest(request: Request<{}, {}, { prompt: string, chatId: string }>, response: Response, next: NextFunction) {
    try {
        const { prompt, chatId } = request.body
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


        const history = await ChatMessage.findAll({
            where: { chatId },
            order: [['createdAt', 'ASC'], ['role', 'DESC']]
        })

        const input: EasyInputMessage[] = [
            { role: 'system', content: systemPrompt },
            ...history.map((m) => {
                const role: 'user' | 'assistant' = m.role === 'assistant' ? 'assistant' : 'user'
                return { role, content: m.message }
            }),
            { role: 'user', content: prompt },
        ]

        const llmResponse = await openai.responses.create({
            model: 'gpt-4.1-mini',
            input,
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

        await ChatMessage.create({ chatId, role: 'user', message: prompt })
        await ChatMessage.create({ chatId, role: 'assistant', message: answer })

        response.json({
            prompt,
            answer,
        })
    } catch (e) {
        console.error('free text request error', e)
        next(e)
    }
}
