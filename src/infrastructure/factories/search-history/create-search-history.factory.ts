import { CreateSearchHistoryUsecase } from "@/application/use-cases/search-history/create-search-history.usecase.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";

export function makeCreateSearchHistoryUsecase(): CreateSearchHistoryUsecase {
	const searchHistoryRepository = new PrismaSearchHistoryRepository();
	return new CreateSearchHistoryUsecase(searchHistoryRepository);
}
