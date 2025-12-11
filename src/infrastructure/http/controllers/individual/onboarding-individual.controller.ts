import type { Request, Response } from "express";
import type { OnboardingIndividualUsecase } from "@/application/use-cases/individual-account/onboarding-individual.usecase.ts";

export class OnboardingIndividualController {
   constructor(
      private readonly onboardingIndividualUsecase: OnboardingIndividualUsecase
   ) {}

   async handle(req: Request, res: Response) {
      const tokenData = req.user;
      
      if (!tokenData) {
         throw new Error("Token data not found");
      }

      const result = await this.onboardingIndividualUsecase.execute({
         authId: tokenData.id,
         ...req.body
      });

      return res.status(201).json({
         success: true,
         message: "Individual onboarding completed successfully."
      });
   }
}