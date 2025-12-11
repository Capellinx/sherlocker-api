import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { validateCnpjController } from "@/infrastructure/factories/validate-cnpj/validate-cnpj.factory.ts";

const validateCnpjRouter: ExpressRouter = Router();

validateCnpjRouter.get(
   "/:cnpj",
   (req, res) => validateCnpjController.handle(req, res)
);

export { validateCnpjRouter };
