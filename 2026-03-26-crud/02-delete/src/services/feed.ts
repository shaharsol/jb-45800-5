import axios from 'axios'
import type Post from '../models/Post'

class FeedService {

    async getFeed(): Promise<Post[]> {
        const { data } = await axios.get<Post[]>(`${import.meta.env.VITE_REST_SERVER_URL}/feed`)
        return data
    }

}

const feedService = new FeedService()
export default feedService
