import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { onboardingIndividualController } from "@/infrastructure/factories/individual/onboarding-individual.factory.ts";
import { updateIndividualOnboardingController } from "@/infrastructure/factories/individual/update-individual-onboarding.factory.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";
import { onboardingIndividualSchema } from "@/application/dtos/onboarding/onboarding-individual.dto.ts";
import { updateOnboardingIndividualSchema } from "@/application/dtos/onboarding/update-onboarding-individual.dto.ts";

const onboardingIndividualRouter: ExpressRouter = Router();

onboardingIndividualRouter.post(
   "/",
   ValidateTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: onboardingIndividualSchema }),
   (req, res) => onboardingIndividualController.handle(req, res)
);

onboardingIndividualRouter.patch(
   "/",
   ValidateTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: updateOnboardingIndividualSchema }),
   (req, res) => updateIndividualOnboardingController.handle(req, res)
);

export { onboardingIndividualRouter };