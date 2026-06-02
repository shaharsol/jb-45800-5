import type { NextFunction, Request, Response } from "express";

export async function improve(
    request: Request<{}, {}, { body: string }>,
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

