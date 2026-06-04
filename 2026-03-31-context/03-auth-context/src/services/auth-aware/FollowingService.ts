import type User from "../../models/User";
import AuthAwareService from "./AuthAware";

export default class FollowingService extends AuthAwareService {
    async getFollowing(): Promise<User[]> {
        const { data } = await this.axiosInstance<User[]>(`${import.meta.env.VITE_REST_SERVER_URL}/follows/following`)
        return data
    }

    async unfollow(userId: string): Promise<void> {
        await this.axiosInstance.post(`${import.meta.env.VITE_REST_SERVER_URL}/follows/unfollow/${userId}`)
    }
}