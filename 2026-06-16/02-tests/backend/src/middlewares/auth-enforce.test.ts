import { Request, Response } from "express"
import authEnforce from "./auth-enforce"

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
})