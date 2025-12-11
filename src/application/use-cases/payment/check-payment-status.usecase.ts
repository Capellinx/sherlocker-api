import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import { NotFoundError } from "@/infrastructure/config/errors.ts";
import type { JwtService } from "@/infrastructure/services/jwt/jwt.service.ts";

export class CheckPaymentStatusUsecase {
	constructor(
		private readonly paymentRepository: IPaymentRepository,
		private readonly authRepository: IAuthRepository,
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly planRepository: IPlanRepository,
		private readonly jwtService: JwtService
	) {}

	async execute(
		request: CheckPaymentStatusUsecase.Request
	): Promise<CheckPaymentStatusUsecase.Response> {
		const payment = await this.paymentRepository.findByPixCopyPaste(
			request.pixCopyPaste
		);

		if (!payment) {
			return {
				isPaid: false,
				message: "Payment not found",
			};
		}
		const isPaid = payment.isPaid();

		if (!isPaid) {
			return {
				isPaid: false,
				message: "Payment is not completed yet",
			};
		}

		const user = await this.authRepository.findByIdWithAccounts(request.authId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		let name: string | undefined;

		if (user.individualAccount) {
			name = user.individualAccount.name;
		} else if (user.corporateAccount) {
			name = user.corporateAccount.ownerName;
		}

		const subscription = await this.subscriptionRepository.findActiveByAuthId(user.id);
		let planName = null;

		if (subscription) {
			const plan = await this.planRepository.findById(subscription.planId);
			if (plan) {
				planName = plan.name;
			}
		} else {
			const paymentSubscription = await this.subscriptionRepository.findById(payment.subscriptionId);
			if (paymentSubscription) {
				const plan = await this.planRepository.findById(paymentSubscription.planId);
				if (plan) {
					planName = plan.name;
				}
			}
		}

		const tokenPayload: any = {
			id: user.id,
			email: user.email!,
			isMissingOnboarding: user.isMissingOnboarding,
			tokenCount: user.tokenCount,
		};

		if (name || user.name) {
			tokenPayload.name = name || user.name;
		}

		if (planName) {
			tokenPayload.plan = planName;
		}

		const newToken = await this.jwtService.generate(tokenPayload, '24h', false);

		return {
			isPaid: true,
			token: newToken.token,
			message: "Payment completed successfully",
		};
	}
}

export namespace CheckPaymentStatusUsecase {
	export type Request = {
		authId: string;
		pixCopyPaste: string;
	};

	export type Response = {
		isPaid: boolean;
		token?: string;
		message: string;
	};
}
