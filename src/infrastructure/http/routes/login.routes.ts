import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { loginController } from "@/infrastructure/factories/login/login.factory.ts";
import { RequestValidationMiddleware } from "@/infrastructure/middlewares/validate-request.middleware.ts";
import { z } from "zod";

const loginSchema = z.object({
   email: z.string().email("Invalid email")
});

const loginRouter: ExpressRouter = Router();

loginRouter.post(
   "/",
   RequestValidationMiddleware.execute({ body: loginSchema }),
   (req, res) => loginController.handle(req, res)
);

export { loginRouter };