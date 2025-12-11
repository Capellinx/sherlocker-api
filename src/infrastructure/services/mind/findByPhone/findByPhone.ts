import { MindHttpClient, type MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class FindByPhoneService extends MindHttpClient {
   async execute(phone: string): Promise<MindApiResponse<any>> {
      return this.get<any>(`/api/telefonia/${phone}`);
   }
}