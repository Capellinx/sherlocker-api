import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import { PlanEntity, type PlanPeriodicity } from "@/domain/entities/plan.ts";
import { prisma } from "@/main.ts";
import type { Decimal } from "@prisma/client/runtime/library";

function toPlanEntity(prismaData: {
	id: string;
	name: string;
	description: string | null;
	amount: Decimal;
	periodicity: PlanPeriodicity;
	tokenCost: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}): PlanEntity {
	return PlanEntity.from({
		id: prismaData.id,
		name: prismaData.name,
		description: prismaData.description ?? undefined,
		amount: Number(prismaData.amount),
		periodicity: prismaData.periodicity,
		tokenCost: prismaData.tokenCost,
		isActive: prismaData.isActive,
		createdAt: prismaData.createdAt,
		updatedAt: prismaData.updatedAt,
		deletedAt: prismaData.deletedAt ?? undefined,
	});
}

export class PrismaPlanRepository implements IPlanRepository {
	async create(plan: PlanEntity): Promise<PlanEntity> {
		const data = await prisma.plan.create({
			data: {
				id: plan.id,
				name: plan.name,
				...(plan.description !== undefined && { description: plan.description }),
				amount: plan.amount,
				periodicity: plan.periodicity,
				isActive: plan.isActive,
				createdAt: plan.createdAt,
				updatedAt: plan.updatedAt,
			},
		});

		return toPlanEntity(data);
	}

	async findById(id: string): Promise<PlanEntity | null> {
		const plan = await prisma.plan.findUnique({
			where: { id },
		});

		if (!plan) return null;

		return toPlanEntity(plan);
	}

	async findAll(): Promise<PlanEntity[]> {
		const plans = await prisma.plan.findMany({
			orderBy: { createdAt: "desc" },
		});

		return plans.map(toPlanEntity);
	}

	async findAllActive(): Promise<PlanEntity[]> {
		const plans = await prisma.plan.findMany({
			where: { isActive: true },
			orderBy: { createdAt: "desc" },
		});

		return plans.map(toPlanEntity);
	}

	async findFreePlan(): Promise<PlanEntity | null> {
		const plan = await prisma.plan.findFirst({
			where: {
				amount: 0,
				isActive: true,
			},
		});

		return plan ? toPlanEntity(plan) : null;
	}

	async update(id: string, data: Partial<ReturnType<PlanEntity['toJSON']>>): Promise<PlanEntity> {
		const updated = await prisma.plan.update({
			where: { id },
			data: {
				...(data.name !== undefined && { name: data.name }),
				...(data.description !== undefined && {
					description: data.description,
				}),
				...(data.amount !== undefined && { amount: data.amount }),
				...(data.periodicity !== undefined && {
					periodicity: data.periodicity,
				}),
				...(data.isActive !== undefined && { isActive: data.isActive }),
				updatedAt: new Date(),
			},
		});

		return toPlanEntity(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.plan.delete({
			where: { id },
		});
	}
}
