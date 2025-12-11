import { Router } from "express";
import { getSearchHistoryController } from "@/infrastructure/factories/search-history/get-search-history.factory.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";

const searchHistoryRoutes = Router();

searchHistoryRoutes.get(
	"/history",
	ValidateTokenMiddleware.execute,
	(req, res) => getSearchHistoryController.handle(req, res)
);

export { searchHistoryRoutes };
