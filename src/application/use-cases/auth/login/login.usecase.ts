import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { GenerateOtpUsecase } from "../../generate-top/generate-otp.usecase.ts";

export class LoginUsecase {
   constructor (
      private authRepository: IAuthRepository,
      private generateOtpUsecase: GenerateOtpUsecase
   ) {}
   async execute(payload: LoginUsecase.Request): Promise<LoginUsecase.Response> {
      const { email } = payload;

      const existentAuth = await this.authRepository.findByEmail(email);

      if (!existentAuth) {
         throw new Error("Email not registered.");
      }
      
      const otpResult = await this.generateOtpUsecase.execute({
         authId: existentAuth.id
      });

      return {
         token: otpResult.token
      };
   }
}

export namespace LoginUsecase {
   export type Request = {
      email: string;
   };
   export type Response = {
      token: string;
   };
}