import { CheckPaymentStatusUsecase } from "@/application/use-cases/payment/check-payment-status.usecase.ts";
import { CheckPaymentStatusController } from "@/infrastructure/http/controllers/payment/check-payment-status.controller.ts";
import { PrismaPaymentRepository } from "@/infrastructure/database/repositories/payment-prisma.repository.ts";
import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { PrismaSubscriptionRepository } from "@/infrastructure/database/repositories/subscription-prisma.repository.ts";
import { PrismaPlanRepository } from "@/infrastructure/database/repositories/plan-prisma.repository.ts";
import { JwtService } from "@/infrastructure/services/jwt/jwt.service.ts";

export function makeCheckPaymentStatusController(): CheckPaymentStatusController {
	const paymentRepository = new PrismaPaymentRepository();
	const authRepository = new AuthPrismaRepository();
	const subscriptionRepository = new PrismaSubscriptionRepository();
	const planRepository = new PrismaPlanRepository();
	const jwtService = new JwtService();

	const checkPaymentStatusUsecase = new CheckPaymentStatusUsecase(
		paymentRepository,
		authRepository,
		subscriptionRepository,
		planRepository,
		jwtService
	);

	return new CheckPaymentStatusController(checkPaymentStatusUsecase);
}
