import type { Request, Response } from "express";
import type { RegisterUsecase } from "@/application/use-cases/auth/register/register.usecase.ts";

export class RegisterController {
   constructor(
      private readonly registerUsecase: RegisterUsecase
   ) { }

   async handle(req: Request, res: Response) {
      const result = await this.registerUsecase.execute(req.body);

      return res.status(201).json({
         token: result.token,
         message: "Registration started successfully. Check your email for the verification code."
      });
   }
}