import { HandlePaymentWebhookUsecase } from "@/application/use-cases/payment/handle-payment-webhook.usecase.ts";
import { WebhookController } from "@/infrastructure/http/controllers/payment/webhook.controller.ts";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { ResendService } from "@/infrastructure/services/mailer/resend.service.ts";
import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { ResetUserTokensUsecase } from "@/application/use-cases/tokens/reset-user-tokens.usecase.ts";

export function makeHandlePaymentWebhookController(): WebhookController {
	const paymentRepository = new PrismaPaymentRepository();
	const subscriptionRepository = new PrismaSubscriptionRepository();
	const authRepository = new AuthPrismaRepository();
	const planRepository = new PrismaPlanRepository();
	const mailerService = new ResendService();
	const tokenTransactionRepository = new PrismaTokenTransactionRepository();
	
	const resetUserTokensUsecase = new ResetUserTokensUsecase(
		authRepository,
		tokenTransactionRepository
	);

	const handlePaymentWebhookUsecase = new HandlePaymentWebhookUsecase(
		paymentRepository,
		subscriptionRepository,
		authRepository,
		planRepository,
		mailerService,
		resetUserTokensUsecase
	);

	return new WebhookController(handlePaymentWebhookUsecase);
}
