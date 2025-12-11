import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import { NotFoundError, BadRequestError } from "@/infrastructure/config/errors.ts";
import type { MailMessageService } from "@/infrastructure/services/mailer/nodemailer.repository.ts";
import { PaymentEntity } from "@/domain/entities/payment.ts";
import { ResetUserTokensUsecase } from "@/application/use-cases/tokens/reset-user-tokens.usecase.ts";
import { generatePaymentConfirmationEmailTemplate } from "@/infrastructure/templates/payment-confirmation-email.template.ts";

export class HandlePaymentWebhookUsecase {
	constructor(
		private readonly paymentRepository: IPaymentRepository,
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly authRepository: IAuthRepository,
		private readonly planRepository: IPlanRepository,
		private readonly mailerService: MailMessageService,
		private readonly resetUserTokensUsecase: ResetUserTokensUsecase
	) {}

	async execute(
		request: HandlePaymentWebhookUsecase.Request
	): Promise<HandlePaymentWebhookUsecase.Response> {
		// Buscar o payment pelo ID (identifier enviado ao criar o pagamento)
		const payment = await this.paymentRepository.findById(request.paymentId);

		if (!payment) {
			throw new NotFoundError("Payment not found");
		}

		if (payment.isPaid()) {
			return {
				success: true,
				message: "Payment already processed",
			};
		}

		const subscription = await this.subscriptionRepository.findById(
			payment.subscriptionId
		);

		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}

		switch (request.status) {
			case "PAID":
				payment.markAsPaid();
				if (request.paidAt) {
					const paidAtDate = new Date(request.paidAt);
					await this.paymentRepository.update(payment.id, {
						...payment.toJSON(),
						paidAt: paidAtDate,
					});
				} else {
					await this.paymentRepository.update(payment.id, payment.toJSON());
				}

				const startDate = new Date();
				const endDate = new Date(startDate);
				const nextPaymentDate = new Date(startDate);

				const plan = await this.planRepository.findById(subscription.planId);
				if (plan) {
					if (plan.periodicity === "DAYS") {
						endDate.setDate(endDate.getDate() + 1);
						nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
					} else if (plan.periodicity === "MONTHLY") {
						endDate.setMonth(endDate.getMonth() + 1);
						nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
					} else if (plan.periodicity === "ANNUAL") {
						endDate.setFullYear(endDate.getFullYear() + 1);
						nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
					}
				}

				// ✅ Cancelar qualquer outra subscription ACTIVE antes de ativar a nova
				// Isso garante que o usuário só tenha uma subscription ativa por vez
				const oldActiveSubscription = await this.subscriptionRepository.findActiveByAuthId(
					subscription.authId
				);
				
				if (oldActiveSubscription && oldActiveSubscription.id !== subscription.id) {
					oldActiveSubscription.cancel();
					await this.subscriptionRepository.update(
						oldActiveSubscription.id,
						oldActiveSubscription.toJSON()
					);
				}

				subscription.activate(startDate, endDate);
				await this.subscriptionRepository.update(
					subscription.id,
					{
						...subscription.toJSON(),
						nextPaymentDate,
					}
				);

				if (plan) {
					await this.resetUserTokensUsecase.execute(
						subscription.authId,
						plan.tokenCost
					);
				}

			const auth = await this.authRepository.findById(subscription.authId);
			if (auth && auth.email) {
				await this.mailerService
					.send({
						from: process.env.MAIL_USER || "noreply@sherlocker.com",
						to: [auth.email],
						subject: "Pagamento Confirmado - Sherlocker",
						body: generatePaymentConfirmationEmailTemplate({
							name: auth.name || "Cliente",
							planName: plan?.name || "Plano",
							amount: payment.amount,
							endDate,
						}),
					})
					.catch((error) => {
						// Email error - não bloqueia o webhook
					});
			}				return {
					success: true,
					message: "Payment processed successfully",
				};

			case "FAILED":
				payment.markAsFailed();
				await this.paymentRepository.update(payment.id, payment.toJSON());

				subscription.cancel();
				await this.subscriptionRepository.update(
					subscription.id,
					subscription.toJSON()
				);

				return {
					success: true,
					message: "Payment marked as failed",
				};

			case "CANCELED":
				payment.cancel();
				await this.paymentRepository.update(payment.id, payment.toJSON());

				subscription.cancel();
				await this.subscriptionRepository.update(
					subscription.id,
					subscription.toJSON()
				);

				return {
					success: true,
					message: "Payment canceled",
				};

			case "REFUNDED":
				payment.refund();
				await this.paymentRepository.update(payment.id, payment.toJSON());

				subscription.cancel();
				await this.subscriptionRepository.update(
					subscription.id,
					subscription.toJSON()
				);

				return {
					success: true,
					message: "Payment refunded",
				};

			default:
				throw new BadRequestError("Invalid payment status");
		}
	}

}

export namespace HandlePaymentWebhookUsecase {
export type Request = {
paymentId: string;
		transactionId: string; // ID da transação no ZyonPay
		status: "PENDING" | "PAID" | "FAILED" | "CANCELED" | "REFUNDED";
		paidAt?: string;
	};

	export type Response = {
		success: boolean;
		message: string;
	};
}
