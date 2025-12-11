import { FindByCnpjService } from "@/infrastructure/services/mind/findByCnpj/findByCnpj.ts";
import { SearchCnpjUsecase } from "@/application/use-cases/search/search-cnpj.usecase.ts";
import { SearchCnpjController } from "@/infrastructure/http/controllers/search/search-cnpj.controller.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";

const findByCnpjService = new FindByCnpjService();
const searchHistoryRepository = new PrismaSearchHistoryRepository();
const authRepository = new AuthPrismaRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();

const checkTokenAvailability = new CheckTokenAvailabilityUsecase(authRepository);
const deductTokens = new DeductTokensUsecase(authRepository, tokenTransactionRepository);

const searchCnpjUsecase = new SearchCnpjUsecase(
	findByCnpjService,
	searchHistoryRepository,
	checkTokenAvailability,
	deductTokens
);
const searchCnpjController = new SearchCnpjController(searchCnpjUsecase);

export { searchCnpjController };
