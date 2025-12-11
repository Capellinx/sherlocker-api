import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { listPlansController } from "@/infrastructure/factories/plans/list-plans.factory.ts";

const plansRouter: ExpressRouter = Router();

plansRouter.get(
   "/",
   (req, res) => listPlansController.handle(req, res)
);

export { plansRouter };
