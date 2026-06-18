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
        })
    })
})