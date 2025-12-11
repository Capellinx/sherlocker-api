import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { AssignFreePlanUsecase } from "@/application/use-cases/subscription/assign-free-plan.usecase.ts";
import { ResetUserTokensUsecase } from "@/application/use-cases/tokens/reset-user-tokens.usecase.ts";

const authRepository = new AuthPrismaRepository();
const planRepository = new PrismaPlanRepository();
const subscriptionRepository = new PrismaSubscriptionRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();

const resetUserTokensUsecase = new ResetUserTokensUsecase(authRepository, tokenTransactionRepository);

const assignFreePlanUsecase = new AssignFreePlanUsecase(
	authRepository,
	planRepository,
	subscriptionRepository,
	resetUserTokensUsecase
);

export { assignFreePlanUsecase };
