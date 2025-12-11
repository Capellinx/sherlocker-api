import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { onboardingCorporateController } from "@/infrastructure/factories/corporate/onboarding-corporate.factory.ts";
import { updateCorporateOnboardingController } from "@/infrastructure/factories/corporate/update-corporate-onboarding.factory.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";
import { onboardingCorporateSchema } from "@/application/dtos/onboarding/onboarding-corporate.dto.ts";
import { updateOnboardingCorporateSchema } from "@/application/dtos/onboarding/update-onboarding-corporate.dto.ts";

const onboardingCorporateRouter: ExpressRouter = Router();

onboardingCorporateRouter.post(
   "/",
   ValidateTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: onboardingCorporateSchema }),
   (req, res) => onboardingCorporateController.handle(req, res)
);

onboardingCorporateRouter.patch(
   "/",
   ValidateTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: updateOnboardingCorporateSchema }),
   (req, res) => updateCorporateOnboardingController.handle(req, res)
);

export { onboardingCorporateRouter };