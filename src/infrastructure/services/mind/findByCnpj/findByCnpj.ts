import { MindHttpClient, type MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class FindByCnpjService extends MindHttpClient {
   async execute(cnpj: string): Promise<MindApiResponse<any>> {
      return this.get<any>(`/api/cnpj/${cnpj}`);
   }
}