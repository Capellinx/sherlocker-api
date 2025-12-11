import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { validateCpfController } from "@/infrastructure/factories/validate-cpf/validate-cpf.factory.ts";

const validateCpfRouter: ExpressRouter = Router();

validateCpfRouter.get(
   "/:cpf",
   (req, res) => validateCpfController.handle(req, res)
);

export { validateCpfRouter };
