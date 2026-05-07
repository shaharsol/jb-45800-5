import type { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import config from 'config'
import { createHmac } from "crypto";

function hashPassword(plainTextPassword: string): string {
    const key = config.get<string>('app.encryptionKey')
    return createHmac('sha256', key).update(plainTextPassword).digest('hex')
}


export async function signup(request: Request<{}, {}, {name: String, username: string, password: string}>, response: Response, next: NextFunction) {
    try {
        request.body.password = hashPassword(request.body.password)
        const newUser = await User.create(request.body)
        response.json(newUser)
    } catch(e) {
        next(e)
    }

}