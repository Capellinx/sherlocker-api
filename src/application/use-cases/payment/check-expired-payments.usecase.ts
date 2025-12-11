import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";

export class CheckExpiredPaymentsUsecase {
	constructor(
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly paymentRepository: IPaymentRepository
	) {}

	async execute(): Promise<CheckExpiredPaymentsUsecase.Response> {
		const activeSubscriptions = await this.subscriptionRepository.findMany({
			status: "ACTIVE",
		});

		const results = {
			checked: 0,
			inactivated: 0,
			errors: [] as string[],
		};

		for (const subscription of activeSubscriptions) {
			try {
				results.checked++;

				// Busca o pagamento mais recente da subscription
				const latestPayment = await this.paymentRepository.findLatestBySubscriptionId(
					subscription.id
				);

				if (!latestPayment) {
					continue;
				}

				// Se o pagamento mais recente está PAGO, subscription deve continuar ativa
				if (latestPayment.isPaid()) {
					continue;
				}

				// Se o pagamento mais recente está PENDING há mais de 3 dias, inativa
				if (latestPayment.isPending()) {
					const threeDaysAgo = new Date();
					threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

					if (latestPayment.createdAt < threeDaysAgo) {
						subscription.cancel();
						await this.subscriptionRepository.update(
							subscription.id,
							subscription.toJSON()
						);
						results.inactivated++;
					}
				}
			} catch (error) {
				results.errors.push(
					`Error checking subscription ${subscription.id}: ${
						error instanceof Error ? error.message : String(error)
					}`
				);
			}
		}

		return {
			checked: results.checked,
			inactivated: results.inactivated,
			errors: results.errors,
		};
	}
}

export namespace CheckExpiredPaymentsUsecase {
	export type Response = {
		checked: number;
		inactivated: number;
		errors: string[];
	};
}
