import { FindByCnpjService } from "@/infrastructure/services/mind/findByCnpj/findByCnpj.ts";
import type { MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";
import type { SearchCnpjResponseDTO } from "@/application/dtos/search/search-cnpj-response.dto.ts";
import { mapMindCnpjResponseToDTO } from "@/application/dtos/search/mappers/cnpj-mapper.ts";
import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";
import { TOKEN_COST_PER_SEARCH } from "@/application/dtos/tokens/token-costs.dto.ts";

export class SearchCnpjUsecase {
   constructor(
      private readonly findByCnpjService: FindByCnpjService,
      private readonly searchHistoryRepository: ISearchHistoryRepository,
      private readonly checkTokenAvailabilityUsecase: CheckTokenAvailabilityUsecase,
      private readonly deductTokensUsecase: DeductTokensUsecase
   ) {}

   async execute(cnpj: string, authId: string): Promise<MindApiResponse<SearchCnpjResponseDTO>> {
      await this.checkTokenAvailabilityUsecase.execute(authId, TOKEN_COST_PER_SEARCH);
      
      const cleanCnpj = cnpj.replace(/\D/g, '');
      
      if (cleanCnpj.length !== 14) {
         return {
            success: false,
            data: null,
            message: 'CNPJ must contain 14 digits'
         };
      }

      const response = await this.findByCnpjService.execute(cleanCnpj);

      if (response.success && response.data) {
         const remainingTokens = await this.deductTokensUsecase.execute(authId, TOKEN_COST_PER_SEARCH, 'CNPJ');
         
         const searchHistory = SearchHistoryEntity.create({
            authId,
            searchType: 'CNPJ',
            searchInput: cleanCnpj,
         });
         
         await this.searchHistoryRepository.create(searchHistory);

         const organizedData = mapMindCnpjResponseToDTO(response.data);

         return {
            success: true,
            remainingTokens,
            data: organizedData,
         };
      }

      return response;
   }
}