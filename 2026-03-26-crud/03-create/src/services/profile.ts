import axios from 'axios'
import type Post from '../models/Post'
import type PostDraft from '../models/PostDraft'

class ProfileService {

    async getProfile(): Promise<Post[]> {
        const { data } = await axios.get<Post[]>(`${import.meta.env.VITE_REST_SERVER_URL}/profile`)
        return data
    }

    async deletePost(id: string): Promise<void> {
        await axios.delete(`${import.meta.env.VITE_REST_SERVER_URL}/profile/${id}`)
    }

    async createPost(draft: PostDraft): Promise<Post> {
        const { data } = await axios.post<Post>(`${import.meta.env.VITE_REST_SERVER_URL}/profile`, draft)
        return data
    }

}

const profileService = new ProfileService()
export default profileService
