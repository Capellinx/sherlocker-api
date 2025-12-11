import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { LoginUsecase } from "@/application/use-cases/auth/login/login.usecase.ts";
import { LoginController } from "@/infrastructure/http/controllers/login/login.controller.ts";
import { generateOtpUsecase } from "../auth/generate-otp.factory.ts";

const authRepository = new AuthPrismaRepository();
const loginUsecase = new LoginUsecase(authRepository, generateOtpUsecase);
const loginController = new LoginController(loginUsecase);

export { loginController };