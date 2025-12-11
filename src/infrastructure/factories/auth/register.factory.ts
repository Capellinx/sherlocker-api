import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { RegisterUsecase } from "@/application/use-cases/auth/register/register.usecase.ts";
import { RegisterController } from "@/infrastructure/http/controllers/auth/register.controller.ts";
import { generateOtpUsecase } from "./generate-otp.factory.ts";
import { assignFreePlanUsecase } from "../subscription/assign-free-plan.factory.ts";

const authRepository = new AuthPrismaRepository();
const registerUsecase = new RegisterUsecase(authRepository, generateOtpUsecase, assignFreePlanUsecase);
const registerController = new RegisterController(registerUsecase);

export { registerController };