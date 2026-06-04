import type { NextFunction, Request, Response } from "express";

export default function profanityPreventor(request: Request, response: Response, next: NextFunction) {
    next()
}
