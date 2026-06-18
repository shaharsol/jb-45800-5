/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    clearMocks: true,
    passWithNoTests: true,
    moduleNameMapper: {
        '^pgvector/sequelize$': '<rootDir>/src/test/mocks/pgvector-sequelize.ts',
        '^pgvector$': '<rootDir>/src/test/mocks/pgvector.ts',
    },
}
