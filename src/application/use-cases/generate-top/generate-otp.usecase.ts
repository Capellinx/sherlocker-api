import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { BadRequestError } from "@/infrastructure/config/errors.ts";
import { env } from "@/infrastructure/config/env.ts";
import type { JwtService } from "@/infrastructure/services/jwt/jwt.service.ts";
import type { MailMessageService } from "@/infrastructure/services/mailer/nodemailer.repository.ts";
import { generateOtpVerificationEmailTemplate } from "@/infrastructure/templates/otp-verification-email.template.ts";

export class GenerateOtpUsecase {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly jwtService: JwtService,
      private readonly mailService: MailMessageService
   ) {}

   async execute(payload: GenerateOtpUsecase.Request): Promise<GenerateOtpUsecase.Response> {
      const user = await this.authRepository.findById(payload.authId);
      if (!user) {
         throw new BadRequestError("User not found");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const token = await this.jwtService.generate({
         id: user.id,
         email: user.email!,
         otp,
         isMissingOnboarding: user.isMissingOnboarding,
      }, '5m', true);

      await this.sendVerificationEmail(user.email!, user.name || 'User', otp);

      return {
         token: token.token,
      };
   }

   private async sendVerificationEmail(email: string, name: string, otp: string): Promise<void> {
      const emailBody = generateOtpVerificationEmailTemplate({
         name,
         otp,
      });

      try {
         await this.mailService.send({
         from: `Sherlocker <${env.EMAIL_FROM}>`,
         to: [email],
         subject: 'Verificação de Email - Sherlocker',
         body: emailBody,
      });
   } catch (error) {
      throw new BadRequestError('Failed to send verification email');
   }
}
}

export namespace GenerateOtpUsecase {
   export type Request = {
      authId: string;
   };
   export type Response = {
      token: string;
   };
}