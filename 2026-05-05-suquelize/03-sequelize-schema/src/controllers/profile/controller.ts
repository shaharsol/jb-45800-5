import type { NextFunction, Request, Response } from "express";

export function getProfile(request: Request, response: Response, next: NextFunction) {
    response.json({
        id: 1,
        title: 'the beautiful ocean'
    })
}
