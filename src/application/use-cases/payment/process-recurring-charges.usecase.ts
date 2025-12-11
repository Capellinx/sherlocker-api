import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import type { IZyonPayService } from "@/infrastructure/services/zyonpay/zyonpay.repository.ts";
import type { MailMessageService } from "@/infrastructure/services/mailer/nodemailer.repository.ts";
import type { SubscriptionEntity } from "@/domain/entities/subscription.ts";
import type { PlanEntity } from "@/domain/entities/plan.ts";
import { PaymentEntity } from "@/domain/entities/payment.ts";
import { generateRecurringChargeEmailTemplate } from "@/infrastructure/templates/recurring-charge-email.template.ts";
import { ApplicationError } from "@/infrastructure/config/errors.ts";

export class ProcessRecurringChargesUsecase {
	constructor(
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly paymentRepository: IPaymentRepository,
		private readonly planRepository: IPlanRepository,
		private readonly authRepository: IAuthRepository,
		private readonly individualAccountRepository: IIndividualAccountRepository,
		private readonly corporateAccountRepository: ICorporateAccountRepository,
		private readonly zyonPayService: IZyonPayService,
		private readonly mailService: MailMessageService
	) {}

	async execute(): Promise<ProcessRecurringChargesUsecase.Response> {
		const today = this.getTodayEndOfDay();
		const subscriptionsDue = await this.subscriptionRepository.findPendingCharges(today);

		const results = {
			processed: 0,
			failed: 0,
			errors: [] as string[],
		};

		for (const subscription of subscriptionsDue) {
			try {
				await this.processSubscription(subscription, results);
			} catch (error) {
				this.handleProcessingError(subscription.id, error, results);
			}
		}

		return {
			totalSubscriptions: subscriptionsDue.length,
			processed: results.processed,
			failed: results.failed,
			errors: results.errors,
		};
	}

	private getTodayEndOfDay(): Date {
		const today = new Date();
		today.setHours(23, 59, 59, 999);
		return today;
	}

	private async processSubscription(
		subscription: SubscriptionEntity,
		results: { processed: number; failed: number; errors: string[] }
	): Promise<void> {
		if (await this.hasPendingPayment(subscription.id)) {
			return;
		}

		const plan = await this.getPlanOrFail(subscription, results);
		if (!plan) return;

		const auth = await this.getAuthOrFail(subscription, results);
		if (!auth) return;

		const { document, phone } = await this.getAccountDetails(auth);

		const payment = await this.createPaymentWithGateway(
			subscription,
			plan,
			auth,
			document,
			phone
		);

		await this.paymentRepository.create(payment);
		await this.updateNextPaymentDate(subscription.id, plan);
		await this.sendRecurringChargeEmail(auth, plan, payment);

		results.processed++;
	}

	private async hasPendingPayment(subscriptionId: string): Promise<boolean> {
		const existingPayment = await this.paymentRepository.findPendingBySubscriptionId(
			subscriptionId
		);
		return !!existingPayment;
	}

	private async getPlanOrFail(
		subscription: SubscriptionEntity,
		results: { failed: number; errors: string[] }
	): Promise<PlanEntity | null> {
		const plan = await this.planRepository.findById(subscription.planId);
		if (!plan) {
			results.failed++;
			results.errors.push(`Plan not found for subscription ${subscription.id}`);
		}
		return plan;
	}

	private async getAuthOrFail(
		subscription: SubscriptionEntity,
		results: { failed: number; errors: string[] }
	): Promise<any | null> {
		const auth = await this.authRepository.findById(subscription.authId);
		if (!auth) {
			results.failed++;
			results.errors.push(`User not found for subscription ${subscription.id}`);
		}
		return auth;
	}

	private async getAccountDetails(
		auth: any
	): Promise<{ document: string; phone: string }> {
		if (auth.individualAccountId) {
			const account = await this.individualAccountRepository.findById(
				auth.individualAccountId
			);
			return {
				document: account?.cpf || "",
				phone: account?.phone || "",
			};
		}

		if (auth.corporateAccountId) {
			const account = await this.corporateAccountRepository.findById(
				auth.corporateAccountId
			);
			return {
				document: account?.cnpj || "",
				phone: account?.phone || "",
			};
		}

		return { document: "", phone: "" };
	}

	private async createPaymentWithGateway(
		subscription: SubscriptionEntity,
		plan: PlanEntity,
		auth: any,
		document: string,
		phone: string
	): Promise<PaymentEntity> {
		const payment = PaymentEntity.create({
			subscriptionId: subscription.id,
			amount: plan.amount,
		});

		const dueDateFormatted = this.calculateDueDate();
		
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
			dueDate: dueDateFormatted,
			metadata: {
				subscriptionId: subscription.id,
				authId: subscription.authId,
				paymentId: payment.id,
				isRecurringCharge: "true",
			},
			callbackUrl: "https://webhook.site/0ae2ed4d-ff24-4db1-9ada-229801513835",
		});

		if (!zyonPayResponse.transactionId || zyonPayResponse.status !== "OK") {
			throw new ApplicationError("Failed to create Pix payment with ZyonPay", 500);
		}

		payment.setTransactionId(zyonPayResponse.transactionId);
		payment.setPixData(zyonPayResponse.pix.base64, zyonPayResponse.pix.code);

		return PaymentEntity.create({
			id: payment.id,
			subscriptionId: payment.subscriptionId,
			amount: payment.amount,
			transactionId: payment.transactionId!,
			pixQrCode: payment.pixQrCode!,
			pixCopyPaste: payment.pixCopyPaste!,
			expiresAt: new Date(zyonPayResponse.pix.expiresAt),
		});
	}

	private calculateDueDate(): string {
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 3);
		return dueDate.toISOString().split("T")[0] as string;
	}

	private async updateNextPaymentDate(
		subscriptionId: string,
		plan: PlanEntity
	): Promise<void> {
		const subscription = await this.subscriptionRepository.findById(subscriptionId);
		if (!subscription) return;

		const nextPaymentDate = this.calculateNextPaymentDate(plan);
		subscription.setNextPaymentDate(nextPaymentDate);
		await this.subscriptionRepository.update(subscriptionId, subscription.toJSON());
	}

	private calculateNextPaymentDate(plan: PlanEntity): Date {
		const nextDate = new Date();
		const periodicityMap: Record<string, () => void> = {
			DAYS: () => nextDate.setDate(nextDate.getDate() + 1),
			MONTHLY: () => nextDate.setMonth(nextDate.getMonth() + 1),
			ANNUAL: () => nextDate.setFullYear(nextDate.getFullYear() + 1),
		};

		periodicityMap[plan.periodicity]?.();
		return nextDate;
	}

	private async sendRecurringChargeEmail(
		auth: any,
		plan: PlanEntity,
		payment: PaymentEntity
	): Promise<void> {
		const emailHtml = generateRecurringChargeEmailTemplate({
			userName: auth.name || "Cliente",
			planName: plan.name,
			amount: plan.amount,
			expiresAt: payment.expiresAt!,
			pixQrCodeBase64: payment.pixQrCode!,
			pixCopyPaste: payment.pixCopyPaste!,
		});

		await this.mailService.send({
			from: "Sherlocker <noreply@sherlocker.com>",
			to: [auth.email || ""],
			subject: `💳 Nova cobrança da sua assinatura - ${plan.name}`,
			body: emailHtml,
		});
	}

	private handleProcessingError(
		subscriptionId: string,
		error: unknown,
		results: { failed: number; errors: string[] }
	): void {
		results.failed++;
		results.errors.push(
			`Error processing subscription ${subscriptionId}: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

export namespace ProcessRecurringChargesUsecase {
	export type Response = {
		totalSubscriptions: number;
		processed: number;
		failed: number;
		errors: string[];
	};
}
