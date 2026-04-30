import type { NextFunction, Request, Response } from "express";

export default function sayHello(request: Request, response: Response, next: NextFunction) {
    response.send('hello from typescript express')
}