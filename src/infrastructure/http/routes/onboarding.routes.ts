import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { updateOnboardingController } from "@/infrastructure/factories/onboarding/update-onboarding.factory.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { updateOnboardingSchema } from "@/application/dtos/onboarding/update-onboarding.dto.ts";

const onboardingRouter: ExpressRouter = Router();

onboardingRouter.patch(
   "/",
   ValidateTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: updateOnboardingSchema }),
   (req, res) => updateOnboardingController.handle(req, res)
);

export { onboardingRouter };
