import axios from 'axios'

const DEFAULT_MESSAGE = 'An unexpected error occurred'

function messageFromObject(value: object): string | undefined {
    const record = value as Record<string, unknown>

    if (typeof record.message === 'string' && record.message.trim()) {
        return record.message
    }

    if (typeof record.error === 'string' && record.error.trim()) {
        return record.error
    }

    if (Array.isArray(record.errors) && record.errors.length > 0) {
        const first = record.errors[0]
        if (typeof first === 'string' && first.trim()) {
            return first
        }
        if (first && typeof first === 'object') {
            return messageFromObject(first)
        }
    }
}

export function extractErrorMessage(error: unknown): string {
    if (!error) {
        return DEFAULT_MESSAGE
    }

    if (typeof error === 'string' && error.trim()) {
        return error
    }

    if (axios.isAxiosError(error)) {
        const { response, message } = error

        if (response?.data !== undefined && response.data !== null) {
            const { data } = response

            if (typeof data === 'string' && data.trim()) {
                return data
            }

            if (typeof data === 'object') {
                const extracted = messageFromObject(data)
                if (extracted) {
                    return extracted
                }
            }
        }

        if (message) {
            return message
        }
    }

    if (error instanceof Error && error.message) {
        return error.message
    }

    if (typeof error === 'object') {
        const extracted = messageFromObject(error)
        if (extracted) {
            return extracted
        }
    }

    return DEFAULT_MESSAGE
}
