import type { NextFunction, Request, Response } from 'express'
import { authContext } from './auth-context.js'

function extractJwt(request: Request): string | null {
    const authHeader = request.get('Authorization')

    if (!authHeader) {
        return null
    }

    if (!authHeader.startsWith('Bearer')) {
        return null
    }

    const [, jwt] = authHeader.split(' ')

    if (!jwt) {
        return null
    }

    return jwt
}

export default function extractAuth(request: Request, response: Response, next: NextFunction) {
    const jwt = extractJwt(request)

    if (!jwt) {
        const authHeader = request.get('Authorization')

        if (!authHeader) {
            return response.status(401).json({ message: 'auth header is missing!' })
        }

        if (!authHeader.startsWith('Bearer')) {
            return response.status(401).json({ message: 'you probably use the wrong auth mechanism' })
        }

        return response.status(401).json({ message: 'i see auth header but can not extract a jwt token' })
    }

    authContext.run({ jwt }, () => next())
}
