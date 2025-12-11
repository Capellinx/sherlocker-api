import { FindByCpfService } from "@/infrastructure/services/mind/findByCpf/findByCpf.ts";
import { SearchCpfUsecase } from "@/application/use-cases/search/search-cpf.usecase.ts";
import { SearchCpfController } from "@/infrastructure/http/controllers/search/search-cpf.controller.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";

const findByCpfService = new FindByCpfService();
const searchHistoryRepository = new PrismaSearchHistoryRepository();
const authRepository = new AuthPrismaRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();

const checkTokenAvailability = new CheckTokenAvailabilityUsecase(authRepository);
const deductTokens = new DeductTokensUsecase(authRepository, tokenTransactionRepository);

const searchCpfUsecase = new SearchCpfUsecase(
	findByCpfService,
	searchHistoryRepository,
	checkTokenAvailability,
	deductTokens
);
const searchCpfController = new SearchCpfController(searchCpfUsecase);

export { searchCpfController };
