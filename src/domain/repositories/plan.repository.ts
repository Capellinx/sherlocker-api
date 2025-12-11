import type { PlanEntity } from "../entities/plan.ts";

export interface IPlanRepository {
	create(plan: PlanEntity): Promise<PlanEntity>;
	findById(id: string): Promise<PlanEntity | null>;
	findAll(): Promise<PlanEntity[]>;
	findAllActive(): Promise<PlanEntity[]>;
	findFreePlan(): Promise<PlanEntity | null>;
	update(id: string, data: Partial<ReturnType<PlanEntity['toJSON']>>): Promise<PlanEntity>;
	delete(id: string): Promise<void>;
}
