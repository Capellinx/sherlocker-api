import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import type { IZyonPayService } from "@/infrastructure/services/zyonpay/zyonpay.repository.ts";
import { SubscriptionEntity } from "@/domain/entities/subscription.ts";
import { PaymentEntity } from "@/domain/entities/payment.ts";
import { 
	ApplicationError, 
	NotFoundError, 
	BadRequestError 
} from "@/infrastructure/config/errors.ts";
import { env } from "@/infrastructure/config/env.ts";

export class CreatePixPaymentUsecase {
	constructor(
		private readonly planRepository: IPlanRepository,
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly paymentRepository: IPaymentRepository,
		private readonly authRepository: IAuthRepository,
		private readonly individualAccountRepository: IIndividualAccountRepository,
		private readonly corporateAccountRepository: ICorporateAccountRepository,
		private readonly zyonPayService: IZyonPayService
	) {}

	async execute(
		request: CreatePixPaymentUsecase.Request
	): Promise<CreatePixPaymentUsecase.Response> {
		const auth = await this.authRepository.findById(request.authId);
		if (!auth) {
			throw new NotFoundError("User not found");
		}

		const activeSubscription =
			await this.subscriptionRepository.findActiveByAuthId(request.authId);
		
		// ✅ NÃO cancelar a subscription antiga aqui - ela deve continuar ativa
		// até que o novo pagamento seja confirmado como PAID
		
		if (activeSubscription && activeSubscription.planId === request.planId) {
			throw new BadRequestError("User already has an active subscription with this plan");
		}

		const plan = await this.planRepository.findById(request.planId);
		if (!plan) {
			throw new NotFoundError("Plan not found");
		}

		if (!plan.isActive) {
			throw new BadRequestError("Plan is not available");
		}

		let document = "";
		let phone = "";
		if (auth.individualAccountId) {
			const individualAccount =
				await this.individualAccountRepository.findById(
					auth.individualAccountId
				);
			document = individualAccount?.cpf || "";
			phone = individualAccount?.phone || "";
		} else if (auth.corporateAccountId) {
			const corporateAccount =
				await this.corporateAccountRepository.findById(auth.corporateAccountId);
			document = corporateAccount?.cnpj || "";
			phone = corporateAccount?.phone || "";
		}

		const subscription = SubscriptionEntity.create({
			authId: request.authId,
			planId: request.planId,
		});

		await this.subscriptionRepository.create(subscription);

		const payment = PaymentEntity.create({
			subscriptionId: subscription.id,
			amount: plan.amount,
		});

		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 1);
		const dueDateFormatted = dueDate.toISOString().split("T")[0];

		const nextPaymentDate = new Date();
		if (plan.periodicity === "DAYS") {
			nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
		} else if (plan.periodicity === "MONTHLY") {
			nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
		} else if (plan.periodicity === "ANNUAL") {
			nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
		}

		try {
			const zyonPayResponse = await this.zyonPayService.createPixPayment({
				identifier: payment.id,
				amount: plan.amount / 100,
				shippingFee: 0,
				extraFee: 0,
				discount: 0,
				client: {
					name: auth.name || "Unknown",
					email: auth.email || "",
					phone: phone || "(00) 00000-0000",
					document: document || "000.000.000-00",
				},
				products: [{
					id: plan.id,
					name: plan.name,
					price: plan.amount / 100,
				}],
				...(dueDateFormatted && { dueDate: dueDateFormatted }),
				metadata: {
					subscriptionId: subscription.id,
					authId: request.authId,
				},
				callbackUrl: env.ZYONPAY_WEBHOOK_URL || "http://localhost:3000/payments/webhook",
			});

			if (!zyonPayResponse.transactionId || zyonPayResponse.status !== "OK") {
				throw new ApplicationError(
					"Failed to create Pix payment with ZyonPay",
					500
				);
			}

			subscription.setNextPaymentDate(nextPaymentDate);
			await this.subscriptionRepository.update(subscription.id, subscription.toJSON());

			payment.setTransactionId(zyonPayResponse.transactionId);
			payment.setPixData(
				zyonPayResponse.pix.base64,
				zyonPayResponse.pix.code
			);

			await this.paymentRepository.create(payment);

			return {
				paymentId: payment.id,
				subscriptionId: subscription.id,
				transactionId: payment.transactionId!,
				amount: payment.amount,
				pixQrCode: payment.pixQrCode!,
				pixCopyPaste: payment.pixCopyPaste!,
				pixQrCodeImage: zyonPayResponse.pix.image,
				nextChargeAt: nextPaymentDate,
				expiresAt: new Date(zyonPayResponse.pix.expiresAt),
			};
		} catch (error) {
			await this.subscriptionRepository.delete(subscription.id);

			if (error instanceof ApplicationError) {
				throw error;
			}

			throw new ApplicationError(
				"Failed to create Pix payment. Please try again later.",
				500
			);
		}
	}
}

export namespace CreatePixPaymentUsecase {
	export type Request = {
		authId: string;
		planId: string;
	};

	export type Response = {
		paymentId: string;
		subscriptionId: string;
		transactionId: string;
		amount: number;
		pixQrCode: string;        // base64 do QR Code
		pixCopyPaste: string;     // Código Pix Copia e Cola
		pixQrCodeImage: string;   // URL da imagem do QR Code
		nextChargeAt: Date;       // Data da próxima cobrança
		expiresAt: Date;
	};
}
