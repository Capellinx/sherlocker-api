import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { registerController } from "@/infrastructure/factories/auth/register.factory.ts";
import { validateOtpController } from "@/infrastructure/factories/auth/validate-otp.factory.ts";
import { profileController } from "@/infrastructure/factories/auth/profile.factory.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { ValidateNoAccessTokenMiddleware } from "@/infrastructure/middlewares/validate-noaccess-token.middleware.ts";
import { ValidateTokenMiddleware } from "@/infrastructure/middlewares/validate-token.middleware.ts";
import { registerSchema } from "@/application/dtos/auth/register.dto.ts";
import { validateOtpSchema } from "@/application/dtos/auth/validate-otp.dto.ts";

const authRouter: ExpressRouter = Router();

authRouter.post(
   "/register",
   RequestValidationMiddleware.execute({ body: registerSchema }),
   (req, res) => registerController.handle(req, res)
);

authRouter.post(
   "/validate",
   ValidateNoAccessTokenMiddleware.execute,
   RequestValidationMiddleware.execute({ body: validateOtpSchema }),
   (req, res) => validateOtpController.handle(req, res)
);

authRouter.get(
   "/profile",
   ValidateTokenMiddleware.execute,
   (req, res) => profileController.handle(req, res)
);

export { authRouter };