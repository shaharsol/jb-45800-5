jest.mock('../io/io', () => ({
    __esModule: true,
    default: { emit: jest.fn(), on: jest.fn() },
}))

jest.mock('../openai/openai', () => ({
    __esModule: true,
    default: {
        embeddings: {
            create: jest.fn().mockResolvedValue({
                data: [{ embedding: new Array(1536).fill(0) }],
            }),
        },
    },
}))

import app, { init } from "../app"
import request from 'supertest'
import sequelize from '../db/sequelize'
import pgvector from '../db/pgvector'
import { randomUUID } from "crypto"
import { sign } from "jsonwebtoken"
import config from 'config'

afterAll(async () => {
    await sequelize.close()
    await pgvector.close()
})

describe('profile router integration tests', () => {
    describe('GET / tests', () => {
        it('returns 401 and designated error message when auth is missing', async () => {
            // run app
            await init()
            // invoke GET / with various data points
            const response = await request(app).get('/profile')
            // run expectations on the response
            expect(response.statusCode).toBe(401)
            expect(response.text).toBe('auth header is missing!')
        })
        it('returns an array of posts when auth header is present', async() => {
            const userId = '1230ae30-dc4f-4752-bd84-092956f5c633'
            const jwt = sign({id: userId}, config.get<string>('app.encryptionKey'))
            await init()
            const response = await request(app).get('/profile').set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body.length).toBe(6)
            expect(response.body[0].title).toBe("Need 2-player board game recommendations")

        })
    })
})