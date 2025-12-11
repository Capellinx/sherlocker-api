import { Router } from "express";
import { getTokenTransactionsController } from "@/infrastructure/factories/tokens/get-token-transactions.factory.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";

const tokenTransactionsRoutes = Router();

tokenTransactionsRoutes.get(
	"/transactions",
	ValidateTokenMiddleware.execute,
	(req, res) => getTokenTransactionsController.handle(req, res)
);

export { tokenTransactionsRoutes };
