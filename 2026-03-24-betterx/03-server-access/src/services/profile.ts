import axios from 'axios'
import type Post from '../models/Post'

class ProfileService {

    async getProfile(): Promise<Post[]> {
        const { data } = await axios.get<Post[]>('http://localhost:3003/allow/profile')
        return data
    }

}

const profileService = new ProfileService()
export default profileService
