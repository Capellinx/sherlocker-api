import { MindHttpClient, type MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class FindByEmailService extends MindHttpClient {
   async execute(email: string, page: number): Promise<MindApiResponse<any>> {
      return this.get<any>(`/api/email/${encodeURIComponent(email)}/${page}`);
   }
}