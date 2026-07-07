import { randomUUID } from "crypto"
import { hashPassword } from "./controller"

describe('Auth controller tests',() => {
    describe('hashPassword tests', () => {
        it('should return a sha256 compatible string', () => {
            const password = randomUUID()
            const result = hashPassword(password)
            const sha256Regex = /^[a-f0-9]{64}$/i;

            expect(result).toBeDefined()
            expect(result).toHaveLength(64)
            expect(result).toMatch(sha256Regex)
        })
        it('should return undefined for empty string argument', () => {
            const result = hashPassword('')           
            expect(result).toBeUndefined() 
        })
        it('returns different hashes for different inputs', () => {
            const password1 = randomUUID()
            const password2 = randomUUID()
            const hash1 = hashPassword(password1)
            const hash2 = hashPassword(password2)
            expect(hash1).not.toEqual(hash2)
        })
        it('return the same hash for the same input', () => {
            const password = randomUUID()
            const hash1 = hashPassword(password)
            const hash2 = hashPassword(password)
            expect(hash1).toEqual(hash2)

        })
    })
})