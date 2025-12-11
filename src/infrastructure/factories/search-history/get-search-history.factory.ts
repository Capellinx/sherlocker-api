import { GetUserSearchHistoryUsecase } from "@/application/use-cases/search-history/get-user-search-history.usecase.ts";
import { PrismaSearchHistoryRepository } from "@/infrastructure/database/repositories/search-history-prisma.repository.ts";
import { GetSearchHistoryController } from "@/infrastructure/http/controllers/search-history/get-search-history.controller.ts";

const searchHistoryRepository = new PrismaSearchHistoryRepository();
const getUserSearchHistoryUsecase = new GetUserSearchHistoryUsecase(searchHistoryRepository);
const getSearchHistoryController = new GetSearchHistoryController(getUserSearchHistoryUsecase);

export { getSearchHistoryController };
