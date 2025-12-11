import { FindByCpfService } from "@/infrastructure/services/mind/findByCpf/findByCpf.ts";
import type { SearchCpfResponseDTO } from "@/application/dtos/search/search-cpf-response.dto.ts";
import { mapMindResponseToDTO } from "@/application/dtos/search/mappers/cpf-mapper.ts";
import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";
import { TOKEN_COST_PER_SEARCH } from "@/application/dtos/tokens/token-costs.dto.ts";

export class SearchCpfUsecase {
   constructor(
      private readonly findByCpfService: FindByCpfService,
      private readonly searchHistoryRepository: ISearchHistoryRepository,
      private readonly checkTokenAvailabilityUsecase: CheckTokenAvailabilityUsecase,
      private readonly deductTokensUsecase: DeductTokensUsecase
   ) {}

   async execute(cpf: string, authId: string): Promise<SearchCpfResponseDTO> {
      await this.checkTokenAvailabilityUsecase.execute(authId, TOKEN_COST_PER_SEARCH);
      
      if (cpf.length !== 11) {
         return {
            success: false,
            message: 'CPF must contain 11 digits',
            data: {
               dadosPessoais: { cpf },
               contatos: { emails: [], telefones: [] },
               informacoesFinanceiras: {},
               beneficiosSociais: {
                  auxilioBrasil: false,
                  auxilioEmergencial: false,
                  bolsaFamilia: false,
               },
            }
         };
      }

      const mindResponse = await this.findByCpfService.execute(cpf);

      if (!mindResponse.success || !mindResponse.data) {
         return {
            success: false,
            message: mindResponse.message || 'Failed to fetch CPF data',
            data: {
               dadosPessoais: { cpf },
               contatos: { emails: [], telefones: [] },
               informacoesFinanceiras: {},
               beneficiosSociais: {
                  auxilioBrasil: false,
                  auxilioEmergencial: false,
                  bolsaFamilia: false,
               },
            }
         };
      }

      const mappedData = mapMindResponseToDTO(mindResponse.data);

      if (mappedData.success) {
         const remainingTokens = await this.deductTokensUsecase.execute(authId, TOKEN_COST_PER_SEARCH, 'CPF');
         
         const searchHistory = SearchHistoryEntity.create({
            authId,
            searchType: 'CPF',
            searchInput: cpf,
         });
         await this.searchHistoryRepository.create(searchHistory);

         return {
            success: mappedData.success,
            remainingTokens,
            message: mappedData.message,
            data: mappedData.data,
         };
      }

      return mappedData;
   }
}