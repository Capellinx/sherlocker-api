import type { SubscriptionEntity } from "../entities/subscription.ts";

export interface ISubscriptionRepository {
	create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
	findById(id: string): Promise<SubscriptionEntity | null>;
	findByAuthId(authId: string): Promise<SubscriptionEntity[]>;
	findActiveByAuthId(authId: string): Promise<SubscriptionEntity | null>;
	findMany(filter: { status?: "PENDING" | "ACTIVE" | "CANCELED" | "EXPIRED" }): Promise<SubscriptionEntity[]>;
	update(id: string, data: Partial<ReturnType<SubscriptionEntity['toJSON']>>): Promise<SubscriptionEntity>;
	delete(id: string): Promise<void>;
	findExpiredSubscriptions(): Promise<SubscriptionEntity[]>;
	findPendingCharges(date: Date): Promise<SubscriptionEntity[]>;
}
