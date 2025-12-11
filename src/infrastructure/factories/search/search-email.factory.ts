import { FindByEmailService } from "@/infrastructure/services/mind/findByEmail/findByEmail.ts";
import { SearchEmailUsecase } from "@/application/use-cases/search/search-email.usecase.ts";
import { SearchEmailController } from "@/infrastructure/http/controllers/search/search-email.controller.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";

const findByEmailService = new FindByEmailService();
const searchHistoryRepository = new PrismaSearchHistoryRepository();
const authRepository = new AuthPrismaRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();

const checkTokenAvailability = new CheckTokenAvailabilityUsecase(authRepository);
const deductTokens = new DeductTokensUsecase(authRepository, tokenTransactionRepository);

const searchEmailUsecase = new SearchEmailUsecase(
	findByEmailService,
	searchHistoryRepository,
	checkTokenAvailability,
	deductTokens
);
const searchEmailController = new SearchEmailController(searchEmailUsecase);

export { searchEmailController };
