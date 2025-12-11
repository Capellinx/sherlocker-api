import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import type { MailMessageService } from "@/infrastructure/services/mailer/nodemailer.repository.ts";
import { AssignFreePlanUsecase } from "@/application/use-cases/subscription/assign-free-plan.usecase.ts";
import { generatePaymentExpiredEmailTemplate } from "@/infrastructure/templates/payment-expired-email.template.ts";

export class ProcessExpiredPaymentsUsecase {
	// Número de dias após criação do payment para considerar expirado
	private readonly EXPIRATION_DAYS = 5;

	constructor(
		private readonly paymentRepository: IPaymentRepository,
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly authRepository: IAuthRepository,
		private readonly planRepository: IPlanRepository,
		private readonly mailerService: MailMessageService,
		private readonly assignFreePlanUsecase: AssignFreePlanUsecase
	) {}

	async execute(): Promise<ProcessExpiredPaymentsUsecase.Response> {
		console.log(`[ProcessExpiredPayments] Starting check for payments expired after ${this.EXPIRATION_DAYS} days...`);

		// Busca pagamentos PENDING criados há mais de X dias
		const expiredPayments = await this.paymentRepository.findExpiredPendingPayments(
			this.EXPIRATION_DAYS
		);

		console.log(`[ProcessExpiredPayments] Found ${expiredPayments.length} expired pending payments`);

		let processedCount = 0;
		let skippedCount = 0;
		const errors: string[] = [];

		for (const payment of expiredPayments) {
			try {
				// VERIFICAÇÃO 1: Confirmar que o payment ainda está PENDING
				if (payment.status !== "PENDING") {
					console.log(`[ProcessExpiredPayments] Skipping payment ${payment.id} - Status changed to ${payment.status}`);
					skippedCount++;
					continue;
				}

				// VERIFICAÇÃO 2: Buscar subscription associada
				const subscription = await this.subscriptionRepository.findById(
					payment.subscriptionId
				);

				if (!subscription) {
					console.log(`[ProcessExpiredPayments] Skipping payment ${payment.id} - Subscription not found`);
					skippedCount++;
					continue;
				}

				// VERIFICAÇÃO 3: Verificar se há um pagamento mais recente PAGO
				const payments = await this.paymentRepository.findBySubscriptionId(
					subscription.id
				);
				
				// Ordena por data de criação decrescente
				const sortedPayments = payments.sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
				);

				// Se o pagamento mais recente está PAGO, usuário está em dia
				const latestPayment = sortedPayments[0];
				if (latestPayment && latestPayment.id !== payment.id && latestPayment.isPaid()) {
					console.log(`[ProcessExpiredPayments] Skipping payment ${payment.id} - User has a more recent paid payment`);
					skippedCount++;
					continue;
				}

				// VERIFICAÇÃO 4: Verificar se o payment expirado é do período correto
				// Se a subscription já tem uma nextPaymentDate futura, significa que já foi processada
				if (subscription.nextPaymentDate) {
					const paymentMonth = payment.createdAt.getMonth();
					const nextPaymentMonth = subscription.nextPaymentDate.getMonth();
					
					// Se a próxima data de pagamento já passou do mês deste payment,
					// significa que este payment é antigo e já foi processado
					if (nextPaymentMonth > paymentMonth || 
						(nextPaymentMonth === 0 && paymentMonth === 11)) { // Virada de ano
						console.log(`[ProcessExpiredPayments] Skipping payment ${payment.id} - Payment is from previous period`);
						skippedCount++;
						continue;
					}
				}

				// VERIFICAÇÃO 5: Subscription ainda está ACTIVE
				if (subscription.status !== "ACTIVE") {
					console.log(`[ProcessExpiredPayments] Skipping payment ${payment.id} - Subscription is ${subscription.status}`);
					skippedCount++;
					continue;
				}

				console.log(`[ProcessExpiredPayments] Processing expired payment ${payment.id} for subscription ${subscription.id}`);

				// Buscar dados do plano
				const plan = await this.planRepository.findById(subscription.planId);
				const planName = plan?.name || "Unknown Plan";

				// 1. Marca o payment como FAILED
				payment.markAsFailed();
				await this.paymentRepository.update(payment.id, payment.toJSON());
				console.log(`[ProcessExpiredPayments] Payment ${payment.id} marked as FAILED`);

				// 2. Cancela a subscription
				subscription.cancel();
				await this.subscriptionRepository.update(
					subscription.id,
					subscription.toJSON()
				);
				console.log(`[ProcessExpiredPayments] Subscription ${subscription.id} canceled`);

				// 3. Atribui plano FREE
				await this.assignFreePlanUsecase.execute(subscription.authId);
				console.log(`[ProcessExpiredPayments] Free plan assigned to user ${subscription.authId}`);

			// 4. Buscar usuário para enviar email
			const auth = await this.authRepository.findById(subscription.authId);
			
			if (auth && auth.email) {
				// 5. Enviar email de notificação
				await this.mailerService
					.send({
						from: process.env.MAIL_USER || "noreply@sherlocker.com",
						to: [auth.email],
						subject: "Assinatura Cancelada - Pagamento Não Realizado",
						body: generatePaymentExpiredEmailTemplate({
							name: auth.name || "Cliente",
							planName,
							amount: payment.amount,
							paymentCreatedAt: payment.createdAt,
							expirationDays: this.EXPIRATION_DAYS,
						}),
					})
					.catch((error) => {
						console.error(`[ProcessExpiredPayments] Failed to send email to ${auth.email}:`, error);
					});
				console.log(`[ProcessExpiredPayments] Notification email sent to ${auth.email}`);
			}				processedCount++;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				console.error(`[ProcessExpiredPayments] Error processing payment ${payment.id}:`, errorMessage);
				errors.push(`Payment ${payment.id}: ${errorMessage}`);
			}
		}

		const result = {
			totalExpired: expiredPayments.length,
			processed: processedCount,
			skipped: skippedCount,
			errors,
		};

		console.log(`[ProcessExpiredPayments] Finished: ${JSON.stringify(result)}`);

		return result;
	}

}

export namespace ProcessExpiredPaymentsUsecase {
	export type Response = {
		totalExpired: number;
		processed: number;
		skipped: number;
		errors: string[];
	};
}
