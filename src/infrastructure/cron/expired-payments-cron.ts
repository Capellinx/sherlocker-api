import cron from "node-cron";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { ResendService } from "@/infrastructure/services/mailer/resend.service.ts";
import { ProcessExpiredPaymentsUsecase } from "@/application/use-cases/payment/process-expired-payments.usecase.ts";
import { AssignFreePlanUsecase } from "@/application/use-cases/subscription/assign-free-plan.usecase.ts";
import { ResetUserTokensUsecase } from "@/application/use-cases/tokens/reset-user-tokens.usecase.ts";

const paymentRepository = new PrismaPaymentRepository();
const subscriptionRepository = new PrismaSubscriptionRepository();
const authRepository = new AuthPrismaRepository();
const planRepository = new PrismaPlanRepository();
const tokenTransactionRepository = new PrismaTokenTransactionRepository();
const mailerService = new ResendService();

const resetUserTokensUsecase = new ResetUserTokensUsecase(
	authRepository,
	tokenTransactionRepository
);

const assignFreePlanUsecase = new AssignFreePlanUsecase(
	authRepository,
	planRepository,
	subscriptionRepository,
	resetUserTokensUsecase
);

const processExpiredPaymentsUsecase = new ProcessExpiredPaymentsUsecase(
	paymentRepository,
	subscriptionRepository,
	authRepository,
	planRepository,
	mailerService,
	assignFreePlanUsecase
);

export function startExpiredPaymentsCron() {
	// Roda diariamente às 2h da manhã (1 hora após o cron de cobranças)
	cron.schedule("0 2 * * *", async () => {
		console.log("[Cron] Starting expired payments check...");
		try {
			const result = await processExpiredPaymentsUsecase.execute();
			console.log("[Cron] Expired payments check completed:", result);
		} catch (error) {
			console.error("[Cron] Error in expired payments check:", error);
		}
	});

	console.log("✅ Expired payments cron job scheduled (daily at 2:00 AM)");
}
