import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { searchCnpjController } from "@/infrastructure/factories/search/search-cnpj.factory.ts";
import { searchCpfController } from "@/infrastructure/factories/search/search-cpf.factory.ts";
import { searchEmailController } from "@/infrastructure/factories/search/search-email.factory.ts";
import { searchNameController } from "@/infrastructure/factories/search/search-name.factory.ts";
import { searchPhoneController } from "@/infrastructure/factories/search/search-phone.factory.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";

const searchRouter: ExpressRouter = Router();

searchRouter.get(
	"/cnpj/:cnpj",
	ValidateTokenMiddleware.execute,
	(req, res) => searchCnpjController.handle(req, res)
);

searchRouter.get(
	"/cpf/:cpf",
	ValidateTokenMiddleware.execute,
	(req, res) => searchCpfController.handle(req, res)
);

searchRouter.get(
	"/email/:email",
	ValidateTokenMiddleware.execute,
	(req, res) => searchEmailController.handle(req, res)
);

searchRouter.get(
	"/name/:name",
	ValidateTokenMiddleware.execute,
	(req, res) => searchNameController.handle(req, res)
);

searchRouter.get(
	"/phone/:phone",
	ValidateTokenMiddleware.execute,
	(req, res) => searchPhoneController.handle(req, res)
);

export { searchRouter };
