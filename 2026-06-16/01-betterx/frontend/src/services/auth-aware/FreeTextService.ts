import AuthAwareService from "./AuthAware";
import type FreeTextResponse from "../../models/FreeTextResponse";

export default class FreeTextService extends AuthAwareService {
    async sendPrompt(prompt: string, chatId: string): Promise<FreeTextResponse> {
        const { data } = await this.axiosInstance.post<FreeTextResponse>(`/free-text`, { prompt, chatId })
        return data
    }
}
