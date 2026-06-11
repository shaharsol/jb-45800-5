import type { NextFunction, Request, Response } from "express";

export async function freeTextRequest(request: Request<{}, {}, { prompt: string }>, response: Response, next: NextFunction) {
    try {
        const { prompt } = request.body

        response.json({ prompt })
    } catch (e) {
        next(e)
    }
}
