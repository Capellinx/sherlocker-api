import { FindByEmailService } from "@/infrastructure/services/mind/findByEmail/findByEmail.ts";
import type { MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";
import type { SearchEmailResponseDTO } from "@/application/dtos/search/search-email-response.dto.ts";
import { mapMindEmailResponseToDTO } from "@/application/dtos/search/mappers/email-mapper.ts";
import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";
import { TOKEN_COST_PER_SEARCH } from "@/application/dtos/tokens/token-costs.dto.ts";

export class SearchEmailUsecase {
   constructor(
      private readonly findByEmailService: FindByEmailService,
      private readonly searchHistoryRepository: ISearchHistoryRepository,
      private readonly checkTokenAvailabilityUsecase: CheckTokenAvailabilityUsecase,
      private readonly deductTokensUsecase: DeductTokensUsecase
   ) {}

   async execute(email: string, authId: string, page: number = 1): Promise<MindApiResponse<SearchEmailResponseDTO>> {
      if (page === 1) {
         await this.checkTokenAvailabilityUsecase.execute(authId, TOKEN_COST_PER_SEARCH);
      }
      
      if (!email || email.trim().length === 0) {
         return {
            success: false,
            data: null,
            message: 'Email is required'
         };
      }

      if (page < 1) {
         return {
            success: false,
            data: null,
            message: 'Page must be greater than 0'
         };
      }

      const response = await this.findByEmailService.execute(email, page);

      if (!response.success || !response.data) {
         return response;
      }

      const organizedData = mapMindEmailResponseToDTO(response.data);

      if (page === 1) {
         const remainingTokens = await this.deductTokensUsecase.execute(authId, TOKEN_COST_PER_SEARCH, 'EMAIL');
         
         const searchHistory = SearchHistoryEntity.create({
            authId,
            searchType: 'EMAIL',
            searchInput: email,
         });
         await this.searchHistoryRepository.create(searchHistory);

         return {
            success: true,
            remainingTokens,
            data: organizedData,
         };
      }

      return {
         success: true,
         data: organizedData,
      };
   }
}