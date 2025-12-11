import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { ProfileUsecase } from "@/application/use-cases/auth/profile/profile.usecase.ts";
import { ProfileController } from "@/infrastructure/http/controllers/auth/profile.controller.ts";

const authRepository = new AuthPrismaRepository();
const subscriptionRepository = new PrismaSubscriptionRepository();
const planRepository = new PrismaPlanRepository();

const profileUsecase = new ProfileUsecase(
   authRepository, 
   subscriptionRepository, 
   planRepository
);
const profileController = new ProfileController(profileUsecase);

export { profileController };
