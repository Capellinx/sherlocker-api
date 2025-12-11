import type { Request, Response } from "express";
import type { OnboardingCorporateUsecase } from "@/application/use-cases/corporate-account/onboarding-corporate.usecase.ts";

export class OnboardingCorporateController {
   constructor(
      private readonly onboardingCorporateUsecase: OnboardingCorporateUsecase
   ) {}

   async handle(req: Request, res: Response) {
      const tokenData = req.user;
      
      if (!tokenData) {
         throw new Error("Token data not found");
      }

      const result = await this.onboardingCorporateUsecase.execute({
         authId: tokenData.id,
         ...req.body
      });

      return res.status(201).json({
         success: true,
         message: "Corporate onboarding completed successfully."
      });
   }
}