import type { Request, Response } from "express";
import type { LoginUsecase } from "@/application/use-cases/auth/login/login.usecase.ts";

export class LoginController {
   constructor(
      private readonly loginUsecase: LoginUsecase
   ) {}

   async handle(req: Request, res: Response) {
      const result = await this.loginUsecase.execute(req.body);

      return res.status(200).json({
         token: result.token,
         message: "Verification code sent to your email."
      });
   }
}