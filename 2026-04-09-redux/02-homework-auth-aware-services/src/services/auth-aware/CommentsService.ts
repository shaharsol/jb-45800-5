import type PostComment from "../../models/PostComment";
import type PostCommentDraft from "../../models/PostCommentDraft";
import AuthAwareService from "./AuthAware";

export default class CommentsService extends AuthAwareService {
    async createComment(postId: string, draft: PostCommentDraft): Promise<PostComment> {
        const { data } = await this.axiosInstance.post<PostComment>(`${import.meta.env.VITE_REST_SERVER_URL}/comments/${postId}`, draft) 
        return data
    }
}