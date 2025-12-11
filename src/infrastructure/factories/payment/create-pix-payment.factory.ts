import { CreatePixPaymentUsecase } from "@/application/use-cases/payment/create-pix-payment.usecase.ts";
import { PaymentController } from "@/infrastructure/http/controllers/payment/payment.controller.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { IndividualAccountPrismaRepository } from "@/infrastructure/database/repositories/individual-account-prisma.repository.ts";
import { CorporateAccountPrismaRepository } from "@/infrastructure/database/repositories/corporate-account-prisma.repository.ts";
import { ZyonPayService } from "@/infrastructure/services/zyonpay/zyonpay.ts";

export function makeCreatePixPaymentController(): PaymentController {
	const planRepository = new PrismaPlanRepository();
	const subscriptionRepository = new PrismaSubscriptionRepository();
	const paymentRepository = new PrismaPaymentRepository();
	const authRepository = new AuthPrismaRepository();
	const individualAccountRepository = new IndividualAccountPrismaRepository();
	const corporateAccountRepository = new CorporateAccountPrismaRepository();
	const zyonPayService = new ZyonPayService();

	const createPixPaymentUsecase = new CreatePixPaymentUsecase(
		planRepository,
		subscriptionRepository,
		paymentRepository,
		authRepository,
		individualAccountRepository,
		corporateAccountRepository,
		zyonPayService
	);

	return new PaymentController(createPixPaymentUsecase);
}
