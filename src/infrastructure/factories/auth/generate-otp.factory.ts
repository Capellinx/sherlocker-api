import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { GenerateOtpUsecase } from "@/application/use-cases/generate-top/generate-otp.usecase.ts";
import { jwtService } from "@/infrastructure/services/jwt/index.ts";
import { ResendService } from "@/infrastructure/services/mailer/resend.service.ts";

const authRepository = new AuthPrismaRepository();
const mailService = new ResendService();
const generateOtpUsecase = new GenerateOtpUsecase(authRepository, jwtService, mailService);

export { generateOtpUsecase };