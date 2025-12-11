import { CheckExpiredPaymentsUsecase } from "@/application/use-cases/payment/check-expired-payments.usecase.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";

export function makeCheckExpiredPaymentsUsecase(): CheckExpiredPaymentsUsecase {
	const subscriptionRepository = new PrismaSubscriptionRepository();
	const paymentRepository = new PrismaPaymentRepository();

	return new CheckExpiredPaymentsUsecase(
		subscriptionRepository,
		paymentRepository
	);
}
