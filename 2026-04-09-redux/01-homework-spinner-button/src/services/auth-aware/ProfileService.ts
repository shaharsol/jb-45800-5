import type Post from "../../models/Post";
import type PostDraft from "../../models/PostDraft";
import AuthAwareService from "./AuthAware";

export default class ProfileService extends AuthAwareService {
    async getProfile(): Promise<Post[]> {
        const { data } = await this.axiosInstance.get<Post[]>(`${import.meta.env.VITE_REST_SERVER_URL}/profile`)
        return data
    }

    async getSinglePost(postId: string): Promise<Post> {

        const { data } = await this.axiosInstance.get<Post>(`${import.meta.env.VITE_REST_SERVER_URL}/profile/${postId}`)
        return data
    }

    async deletePost(id: string): Promise<void> {
        await this.axiosInstance.delete(`${import.meta.env.VITE_REST_SERVER_URL}/profile/${id}`)
    }

    async createPost(draft: PostDraft): Promise<Post> {
        const { data } = await this.axiosInstance.post<Post>(`${import.meta.env.VITE_REST_SERVER_URL}/profile`, draft)
        return data
    }

    async updatePost(postId: string, draft: PostDraft): Promise<Post> {
        const { data } = await this.axiosInstance.patch<Post>(`${import.meta.env.VITE_REST_SERVER_URL}/profile/${postId}`, draft)
        return data
    }
}