import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { ValidateOtpUsecase } from "@/application/use-cases/validate-otp/validade-otp.usecase.ts";
import { ValidateOtpController } from "@/infrastructure/http/controllers/validade-otp/validade-otp.controller.ts";
import { jwtService } from "@/infrastructure/services/jwt/index.ts";
import { generateOtpUsecase } from "./generate-otp.factory.ts";

const authRepository = new AuthPrismaRepository();
const subscriptionRepository = new PrismaSubscriptionRepository();
const planRepository = new PrismaPlanRepository();
const validateOtpUsecase = new ValidateOtpUsecase(
   authRepository, 
   jwtService, 
   subscriptionRepository, 
   planRepository
);
const validateOtpController = new ValidateOtpController(validateOtpUsecase, generateOtpUsecase);

export { validateOtpController };