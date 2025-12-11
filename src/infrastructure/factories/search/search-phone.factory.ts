import { FindByPhoneService } from "@/infrastructure/services/mind/findByPhone/findByPhone.ts";
import { SearchPhoneUsecase } from "@/application/use-cases/search/search-phone.usecase.ts";
import { SearchPhoneController } from "@/infrastructure/http/controllers/search/search-phone.controller.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { CheckTokenAvailabilityUsecase } from "@/application/use-cases/tokens/check-token-availability.usecase.ts";
import { DeductTokensUsecase } from "@/application/use-cases/tokens/deduct-tokens.usecase.ts";

const findByPhoneService = new FindByPhoneService();
const searchHistoryRepository = new PrismaSearchHistoryRepository();
const authRepository = new AuthPrismaRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();

const checkTokenAvailability = new CheckTokenAvailabilityUsecase(authRepository);
const deductTokens = new DeductTokensUsecase(authRepository, tokenTransactionRepository);

const searchPhoneUsecase = new SearchPhoneUsecase(
	findByPhoneService,
	searchHistoryRepository,
	checkTokenAvailability,
	deductTokens
);
const searchPhoneController = new SearchPhoneController(searchPhoneUsecase);

export { searchPhoneController };
