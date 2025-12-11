import { MindHttpClient, type MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class FindByNameService extends MindHttpClient {
   async execute(name: string, page: number): Promise<MindApiResponse<any>> {
      return this.get<any>(`/api/nome_abreviado/${name}/${page}`);
   }
}