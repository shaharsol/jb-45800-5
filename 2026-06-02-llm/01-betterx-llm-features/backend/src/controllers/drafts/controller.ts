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
        const { title, body } = request.body

        const systemPrompt = `
You are generating an image for a social media post.
You will get a post title and post body (article draft).
Generate ONE image that is highly relevant to the post.

Constraints:
- No text, captions, or watermarks in the image
- Professional, high quality, modern look
- Avoid sensitive content
`.trim()

        const prompt = `${systemPrompt}

Title:
${title}

Body:
${body}
`

        const imagesResponse = await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024"
        })

        const image = imagesResponse.data?.[0]

        if (!image) {
            return next({
                status: 500,
                message: 'could not extract generated image'
            })
        }

        if (!image.b64_json) {
            return next({
                status: 500,
                message: 'could not extract generated image base64'
            })
        }

        response.json({
            base64: image.b64_json
        })
    } catch (e) {
        next(e)
    }
}

