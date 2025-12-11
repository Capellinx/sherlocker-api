import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { AuthEntity } from "@/domain/entities/auth.ts";
import { registerSchema } from "@/application/dtos/auth/register.dto.ts";
import type { z } from "zod";
import { BadRequestError } from "@/infrastructure/config/errors.ts";
import { GenerateOtpUsecase } from "../../generate-top/generate-otp.usecase.ts";
import { AssignFreePlanUsecase } from "../../subscription/assign-free-plan.usecase.ts";

export class RegisterUsecase {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly generateOtpUsecase: GenerateOtpUsecase,
      private readonly assignFreePlanUsecase: AssignFreePlanUsecase
   ) { }

   async execute(payload: RegisterUsecase.Request): Promise<RegisterUsecase.Response> {
      const data = registerSchema.parse(payload);

      const existingAuth = await this.authRepository.findByEmail(data.email);
      if (existingAuth) throw new BadRequestError("Email already in use.");

      const auth = AuthEntity.create({ 
         name: data.name,
         surname: data.surname,
         email: data.email, 
         isMissingOnboarding: true,
         tokenCount: 0
      });
      const createdAuth = await this.authRepository.create(auth);

      await this.assignFreePlanUsecase.execute(createdAuth.id);

      const otpResult = await this.generateOtpUsecase.execute({
         authId: createdAuth.id
      });

      return {
         token: otpResult.token,
      };
   }
}

export namespace RegisterUsecase {
   export type Request = z.infer<typeof registerSchema>;
   export type Response = {
      token: string;
   };
}
