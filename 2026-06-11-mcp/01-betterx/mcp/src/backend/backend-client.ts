import axios, { type AxiosInstance } from 'axios'
import config from 'config'
import { getJwt } from '../middleware/auth-context.js'

export function createBackendClient(jwt?: string): AxiosInstance {
    const token = jwt ?? getJwt()

    return axios.create({
        baseURL: config.get<string>('backend.url'),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getFollowing(jwt?: string) {
    const client = createBackendClient(jwt)
    const { data } = await client.get('/follows/following')
    return data
}
