import type { NextFunction, Request, Response } from "express";

export default function logRequest(request: Request, response: Response, next: NextFunction) {
  console.log(`${request.method} ${request.url}`)
  next()
}
