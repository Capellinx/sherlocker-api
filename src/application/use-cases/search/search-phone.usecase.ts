import { FindByPhoneService } from "@/infrastructure/services/mind/findByPhone/findByPhone.ts";
import type { MindApiResponse } from "@/infrastructure/services/mind/mind-http-client.ts";
import type { SearchPhoneResponseDTO } from "@/application/dtos/search/search-phone-response.dto.ts";
import { mapMindPhoneResponseToDTO } from "@/application/dtos/search/mappers/phone-mapper.ts";
import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";
import { TOKEN_COST_PER_SEARCH } from "@/application/dtos/tokens/token-costs.dto.ts";

export class SearchPhoneUsecase {
   constructor(
      private readonly findByPhoneService: FindByPhoneService,
      private readonly searchHistoryRepository: ISearchHistoryRepository,
      private readonly checkTokenAvailabilityUsecase: CheckTokenAvailabilityUsecase,
      private readonly deductTokensUsecase: DeductTokensUsecase
   ) {}

   async execute(phone: string, authId: string): Promise<MindApiResponse<SearchPhoneResponseDTO>> {
      await this.checkTokenAvailabilityUsecase.execute(authId, TOKEN_COST_PER_SEARCH);

      if (phone.length < 10 || phone.length > 11) {
         return {
            success: false,
            data: null,
            message: 'Phone must contain between 10 and 11 digits'
         };
      }

      const response = await this.findByPhoneService.execute(phone);

      if (!response.success || !response.data) {
         return response;
      }

      const remainingTokens = await this.deductTokensUsecase.execute(authId, TOKEN_COST_PER_SEARCH, 'PHONE');

      const searchHistory = SearchHistoryEntity.create({
         authId,
         searchType: 'PHONE',
         searchInput: phone,
      });
      await this.searchHistoryRepository.create(searchHistory);

      const organizedData = mapMindPhoneResponseToDTO(response.data);

      return {
         success: true,
         remainingTokens,
         data: organizedData,
      };
   }
}