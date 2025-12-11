import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import { SubscriptionEntity } from "@/domain/entities/subscription.ts";
import { prisma } from "@/main.ts";

function toSubscriptionEntity(prismaData: {
	id: string;
	authId: string;
	planId: string;
	zyonSubscriptionId: string | null;
	status: "PENDING" | "ACTIVE" | "CANCELED" | "EXPIRED";
	startDate: Date | null;
	endDate: Date | null;
	nextPaymentDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}): SubscriptionEntity {
	return SubscriptionEntity.from({
		id: prismaData.id,
		authId: prismaData.authId,
		planId: prismaData.planId,
		zyonSubscriptionId: prismaData.zyonSubscriptionId ?? undefined,
		status: prismaData.status,
		startDate: prismaData.startDate ?? undefined,
		endDate: prismaData.endDate ?? undefined,
		nextPaymentDate: prismaData.nextPaymentDate ?? undefined,
		createdAt: prismaData.createdAt,
		updatedAt: prismaData.updatedAt,
		deletedAt: prismaData.deletedAt ?? undefined,
	});
}

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
	async create(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
		const data = await prisma.subscription.create({
			data: {
				id: subscription.id,
				authId: subscription.authId,
				planId: subscription.planId,
				...(subscription.zyonSubscriptionId !== undefined && { zyonSubscriptionId: subscription.zyonSubscriptionId }),
				status: subscription.status,
				...(subscription.startDate !== undefined && { startDate: subscription.startDate }),
				...(subscription.endDate !== undefined && { endDate: subscription.endDate }),
				createdAt: subscription.createdAt,
				updatedAt: subscription.updatedAt,
			},
		});

		return toSubscriptionEntity(data);
	}

	async findById(id: string): Promise<SubscriptionEntity | null> {
		const subscription = await prisma.subscription.findUnique({
			where: { id },
		});

		if (!subscription) return null;

		return toSubscriptionEntity(subscription);
	}

	async findByAuthId(authId: string): Promise<SubscriptionEntity[]> {
		const subscriptions = await prisma.subscription.findMany({
			where: { authId },
			orderBy: { createdAt: "desc" },
		});

		return subscriptions.map(toSubscriptionEntity);
	}

	async findActiveByAuthId(authId: string): Promise<SubscriptionEntity | null> {
		const subscription = await prisma.subscription.findFirst({
			where: {
				authId,
				status: "ACTIVE",
			},
			orderBy: { createdAt: "desc" },
		});

		if (!subscription) return null;

		return toSubscriptionEntity(subscription);
	}

	async findMany(filter: { status?: "PENDING" | "ACTIVE" | "CANCELED" | "EXPIRED" }): Promise<SubscriptionEntity[]> {
		const subscriptions = await prisma.subscription.findMany({
			where: {
				...(filter.status && { status: filter.status }),
			},
			orderBy: { createdAt: "desc" },
		});

		return subscriptions.map(toSubscriptionEntity);
	}

	async update(
		id: string,
		data: Partial<ReturnType<SubscriptionEntity["toJSON"]>>
	): Promise<SubscriptionEntity> {
		const updated = await prisma.subscription.update({
			where: { id },
			data: {
				...(data.status !== undefined && { status: data.status }),
				...(data.startDate !== undefined && { startDate: data.startDate }),
				...(data.endDate !== undefined && { endDate: data.endDate }),
				...(data.nextPaymentDate !== undefined && { nextPaymentDate: data.nextPaymentDate }),
				updatedAt: new Date(),
			},
		});

		return toSubscriptionEntity(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.subscription.delete({
			where: { id },
		});
	}

	async findExpiredSubscriptions(): Promise<SubscriptionEntity[]> {
		const now = new Date();
		const subscriptions = await prisma.subscription.findMany({
			where: {
				status: "ACTIVE",
				endDate: {
					lte: now,
				},
			},
		});

		return subscriptions.map(toSubscriptionEntity);
	}

	async findPendingCharges(date: Date): Promise<SubscriptionEntity[]> {
		const subscriptions = await prisma.subscription.findMany({
			where: {
				status: "ACTIVE",
				nextPaymentDate: {
					lte: date,
					not: null,
				},
			},
			include: {
				plan: true,
			},
		});

		// Filtra apenas planos pagos (amount > 0)
		const paidSubscriptions = subscriptions.filter(
			sub => sub.plan && Number(sub.plan.amount) > 0
		);

		return paidSubscriptions.map(toSubscriptionEntity);
	}
}
