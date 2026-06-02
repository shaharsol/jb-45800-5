import type { NextFunction, Request, Response } from "express";
import openai from "../../openai/openai";

export async function improve(
    request: Request<{}, {}, { body: string }>,
    response: Response,
    next: NextFunction
) {
    try {
        const { body } = request.body

        const systemPrompt = `
You are an expert editor.
You will receive a user's article draft.
Your task is to improve the article and make it perfect:
- Fix grammar, spelling, and punctuation
- Enhance wording and clarity
- Keep the original meaning
- Make the tone sound professional

Return ONLY the improved article text.
`.trim()

        const llmResponse = await openai.responses.create({
            model: "gpt-4.1-mini", // we can have this from config so in prod we can use a better model
            input: [
                { role: "system", content: systemPrompt },
                { role: "user", content: body }
            ]
        })

        const improved = llmResponse.output_text?.trim()

        if (!improved) {
            return next({
                status: 500,
                message: 'could not extract improved draft'
            })
        }

        response.json({
            original: body,
            improved
        })
    } catch (e) {
        next(e)
    }
}

export async function generatePic(
    request: Request<{}, {}, { title: string, body: string }>,
    response: Response,
    next: NextFunction
) {
    try {
        response.status(501).json({
            message: "not implemented"
        })
    } catch (e) {
        next(e)
    }
}

