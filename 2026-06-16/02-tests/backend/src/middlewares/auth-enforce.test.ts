import { Request, Response } from "express"
import authEnforce from "./auth-enforce"
import config from 'config'
import { sign } from "jsonwebtoken"
import { randomUUID } from "crypto"

describe('auth enfrocemnet tests', () => {
    // the function authEnforce that we want to test is actually a middelware
    // and as such, we never invoke it directlt in the code
    // in fact, in practice only express invokes the function
    // in order to test it, we need to mock express
    // we need to invoke as if we were express - without using express 
    // if we use express it is no longer a unit test, rather an integration test
    it('returns 401 if authorization header is missing with a designated error message', () => {
        const request = {
            get: (key: string): string => ''
        } as Request
        const response = {} as Response
        const next = jest.fn((err?: any) => {})
        authEnforce(request, response, next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toEqual({
            status: 401,
            message: 'auth header is missing!'
        })
    })
    it('returns 401 and a designated error message, when Bearer string is missing from auth header', () => {
        const request = {
            get: (key: string): string => 'dfkgdg'
        } as Request
        const response = {} as Response
        const next = jest.fn((err?: any) => {})
        authEnforce(request, response, next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toEqual({
            status: 401,
            message: 'you probably use the wrong auth mechanism'
        })

    })
    it('returns 401 and a designated error message, when jwt is missing from auth header', () => {
        const request = {
            get: (key: string): string => 'Bearerhsdgfhsdgfsdgjhfggs'
        } as Request
        const response = {} as Response
        const next = jest.fn((err?: any) => {})
        authEnforce(request, response, next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toEqual({
            status: 401,
            message: 'i see auth header but can not extract a jwt token'
        })

    })
    it('succeeds when all is valid', () => {
        const userId = randomUUID()
        const jwt = sign({id: userId}, config.get<string>('app.encryptionKey'))
        const request = {
            get: (key: string): string => `Bearer ${jwt}`
        } as Request
        const response = {} as Response
        const next = jest.fn((err?: any) => {})
        expect(request.userId).not.toEqual(userId)
        authEnforce(request, response, next)
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toBeUndefined
        expect(request.userId).toEqual(userId)

    })
})