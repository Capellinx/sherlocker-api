import { MindHttpClient, type MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class FindByCpfService extends MindHttpClient {
   async execute(cpf: string): Promise<MindApiResponse<any>> {
      return this.get<any>(`/api/cpf_completo/${cpf}`);
   }
}