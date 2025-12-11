import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import { BadRequestError } from "@/infrastructure/config/errors.ts";
import type { JwtService } from "@/infrastructure/services/jwt/jwt.service.ts";
import { validateOtpSchema } from "@/application/dtos/auth/validate-otp.dto.ts";
import type { z } from "zod";

export class ValidateOtpUsecase {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly jwtService: JwtService,
      private readonly subscriptionRepository: ISubscriptionRepository,
      private readonly planRepository: IPlanRepository
   ) {}

   async execute(payload: ValidateOtpUsecase.Request, userData: ValidateOtpUsecase.UserData): Promise<ValidateOtpUsecase.Response> {
      const data = validateOtpSchema.parse(payload);

      const user = await this.authRepository.findByIdWithAccounts(userData.id);
      if (!user) {
         throw new BadRequestError("User not found.");
      }

      if (data.otp !== userData.otp) {
         throw new BadRequestError("Invalid OTP code.");
      }

      let name: string | undefined;

      if (user.individualAccount) {
         name = user.individualAccount.name;
      } else if (user.corporateAccount) {
         name = user.corporateAccount.ownerName;
      }

      const subscription = await this.subscriptionRepository.findActiveByAuthId(user.id);
      let planName = null;

      if (subscription) {
         const plan = await this.planRepository.findById(subscription.planId);
         if (plan) {
            planName = plan.name;
         }
      }

      const tokenPayload: any = {
         id: user.id,
         email: user.email!,
         isMissingOnboarding: user.isMissingOnboarding,
         tokenCount: user.tokenCount,
      };

      if (name || user.name) {
         tokenPayload.name = name || user.name;
      }

      if (planName) {
         tokenPayload.plan = planName;
      }

      const newToken = await this.jwtService.generate(tokenPayload, '24h', false);

      return { 
         token: newToken.token
      };
   }
}

export namespace ValidateOtpUsecase {
   export type Request = z.infer<typeof validateOtpSchema>;
   export type UserData = {
      id: string;
      email: string;
      otp: string;
   };
   export type Response = {
      token: string;
   };
}