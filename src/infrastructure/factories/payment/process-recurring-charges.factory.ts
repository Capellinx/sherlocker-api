import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { IndividualAccountPrismaRepository } from "@/infrastructure/database/repositories/individual-account-prisma.repository.ts";
import { CorporateAccountPrismaRepository } from "@/infrastructure/database/repositories/corporate-account-prisma.repository.ts";
import { ZyonPayService } from "@/infrastructure/services/zyonpay/zyonpay.ts";
import { ResendService } from "@/infrastructure/services/mailer/resend.service.ts";
import { ProcessRecurringChargesUsecase } from "@/application/use-cases/payment/process-recurring-charges.usecase.ts";

export function makeProcessRecurringChargesUsecase() {
	const subscriptionRepository = new PrismaSubscriptionRepository();
	const paymentRepository = new PrismaPaymentRepository();
	const planRepository = new PrismaPlanRepository();
	const authRepository = new AuthPrismaRepository();
	const individualAccountRepository = new IndividualAccountPrismaRepository();
	const corporateAccountRepository = new CorporateAccountPrismaRepository();
	const zyonPayService = new ZyonPayService();
	const mailService = new ResendService();

	return new ProcessRecurringChargesUsecase(
		subscriptionRepository,
		paymentRepository,
		planRepository,
		authRepository,
		individualAccountRepository,
		corporateAccountRepository,
		zyonPayService,
		mailService
	);
}
