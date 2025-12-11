export type PlanPeriodicity = 'DAYS' | 'MONTHLY' | 'ANNUAL';

export interface Plan {
	id: string;
	name: string;
	description: string | undefined;
	amount: number;
	periodicity: PlanPeriodicity;
	tokenCost: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | undefined;
}

export class PlanEntity {
	private constructor(private props: Plan) {}

	static create(data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'deletedAt'> & { id?: string; description?: string; deletedAt?: Date }): PlanEntity {
		return new PlanEntity({
			id: data.id || crypto.randomUUID(),
			name: data.name,
			description: data.description,
			amount: data.amount,
			periodicity: data.periodicity,
			tokenCost: data.tokenCost,
			isActive: data.isActive ?? true,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: data.deletedAt,
		});
	}

	static from(data: Plan): PlanEntity {
		return new PlanEntity(data);
	}

	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string | undefined {
		return this.props.description;
	}

	get amount(): number {
		return this.props.amount;
	}

	get periodicity(): PlanPeriodicity {
		return this.props.periodicity;
	}

	get tokenCost(): number {
		return this.props.tokenCost;
	}

	get isActive(): boolean {
		return this.props.isActive;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get deletedAt(): Date | undefined {
		return this.props.deletedAt;
	}

	deactivate(): void {
		this.props.isActive = false;
		this.props.updatedAt = new Date();
	}

	activate(): void {
		this.props.isActive = true;
		this.props.updatedAt = new Date();
	}

	toJSON(): Plan {
		return {
			...this.props,
		};
	}
}
