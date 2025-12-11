import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import { SubscriptionEntity } from "@/domain/entities/subscription.ts";
import { NotFoundError } from "@/infrastructure/config/errors.ts";
import { ResetUserTokensUsecase } from "@/application/use-cases/tokens/reset-user-tokens.usecase.ts";

export class AssignFreePlanUsecase {
	constructor(
		private readonly authRepository: IAuthRepository,
		private readonly planRepository: IPlanRepository,
		private readonly subscriptionRepository: ISubscriptionRepository,
		private readonly resetUserTokensUsecase: ResetUserTokensUsecase
	) {}

	async execute(authId: string): Promise<void> {
		const existingSubscription = await this.subscriptionRepository.findActiveByAuthId(authId);
		
		if (existingSubscription) {
			return;
		}

		const freePlan = await this.planRepository.findFreePlan();

		if (!freePlan) {
			throw new NotFoundError("Free plan not found");
		}

		const startDate = new Date();
		const endDate = new Date(startDate);
		
		if (freePlan.periodicity === "DAYS") {
			endDate.setDate(endDate.getDate() + 1);
		} else if (freePlan.periodicity === "MONTHLY") {
			endDate.setMonth(endDate.getMonth() + 1);
		} else if (freePlan.periodicity === "ANNUAL") {
			endDate.setFullYear(endDate.getFullYear() + 1);
		}

		const subscription = SubscriptionEntity.create({
			authId,
			planId: freePlan.id,
		});

		subscription.activate(startDate, endDate);

		await this.subscriptionRepository.create(subscription);

		await this.resetUserTokensUsecase.execute(authId, freePlan.tokenCost);
	}
}
