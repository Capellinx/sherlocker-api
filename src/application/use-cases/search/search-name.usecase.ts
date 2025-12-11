import { FindByNameService } from "@/infrastructure/services/mind/findByName/findByName.ts";
import type { MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";

export class SearchNameUsecase {
   constructor(
      private readonly findByNameService: FindByNameService
   ) {}

   async execute(name: string, page: number = 1): Promise<MindApiResponse<any>> {
      if (name.length < 2) {
         return {
            success: false,
            data: null,
            message: 'Name must have at least 2 characters'
         };
      }

      return await this.findByNameService.execute(name, page);
   }
}