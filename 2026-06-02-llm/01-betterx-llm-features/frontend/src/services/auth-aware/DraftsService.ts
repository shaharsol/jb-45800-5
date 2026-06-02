import AuthAwareService from "./AuthAware";
import type DraftImproveResponse from "../../models/DraftImproveResponse";

export default class DraftsService extends AuthAwareService {
    async improve(body: string): Promise<DraftImproveResponse> {
        const { data } = await this.axiosInstance.post<DraftImproveResponse>(`/drafts/improve`, { body })
        return data
    }
}

