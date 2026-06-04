import axios from 'axios'
import type Post from '../models/Post'

class ProfileService {

    async getProfile(): Promise<Post[]> {
        const { data } = await axios.get<Post[]>(`${import.meta.env.VITE_REST_SERVER_URL}/profile`)
        return data
    }

    async deletePost(id: string): Promise<void> {
        await axios.delete(`${import.meta.env.VITE_REST_SERVER_URL}/profile/${id}`)
    }

}

const profileService = new ProfileService()
export default profileService
