import type { Request, Response } from "express";
import type { ValidateOtpUsecase } from "@/application/use-cases/validate-otp/validade-otp.usecase.ts";
import type { GenerateOtpUsecase } from "@/application/use-cases/generate-top/generate-otp.usecase.ts";
import { BadRequestError } from "@/infrastructure/config/errors.ts";

export class ValidateOtpController {
   constructor(
      private readonly validateOtpUseCase: ValidateOtpUsecase,
      private readonly generateOtpUsecase: GenerateOtpUsecase
   ) {}

   async handle(req: Request, res: Response) {
      const tokenData = req.user;
      
      if (!tokenData) {
         throw new BadRequestError("Token data not found");
      }

      const now = Math.floor(Date.now() / 1000);
      const tokenExpired = tokenData.exp && tokenData.exp < now;

      if (tokenExpired) {
         const newOtpResult = await this.generateOtpUsecase.execute({
            authId: tokenData.id
         });

         return res.status(400).json({
            success: false,
            error: "TOKEN_EXPIRED",
            message: "Token expired. A new code has been sent to your email.",
            data: {
               newToken: newOtpResult.token
            }
         });
      }

      const result = await this.validateOtpUseCase.execute(req.body, {
         id: tokenData.id,
         email: tokenData.email,
         otp: tokenData.otp
      });

      return res.status(200).json({
         success: true,
         data: result,
         message: "OTP validated successfully."
      });
   }
}