import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { ListPlansUsecase } from "@/application/use-cases/plans/list-plans.usecase.ts";
import { ListPlansController } from "@/infrastructure/http/controllers/plans/list-plans.controller.ts";

const planRepository = new PrismaPlanRepository();

const listPlansUsecase = new ListPlansUsecase(planRepository);
const listPlansController = new ListPlansController(listPlansUsecase);

export { listPlansController };
