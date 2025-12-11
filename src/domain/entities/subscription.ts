export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
	id: string;
	authId: string;
	planId: string;
	zyonSubscriptionId: string | undefined;
	status: SubscriptionStatus;
	startDate: Date | undefined;
	endDate: Date | undefined;
	nextPaymentDate: Date | undefined;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | undefined;
}

export class SubscriptionEntity {
	private constructor(private props: Subscription) {}

	static create(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'startDate' | 'endDate' | 'nextPaymentDate' | 'deletedAt' | 'zyonSubscriptionId'> & { id?: string; startDate?: Date; endDate?: Date; nextPaymentDate?: Date; deletedAt?: Date; zyonSubscriptionId?: string }): SubscriptionEntity {
		return new SubscriptionEntity({
			id: data.id || crypto.randomUUID(),
			authId: data.authId,
			planId: data.planId,
			zyonSubscriptionId: data.zyonSubscriptionId,
			status: 'PENDING',
			startDate: data.startDate,
			endDate: data.endDate,
			nextPaymentDate: data.nextPaymentDate,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: data.deletedAt,
		});
	}

	static from(data: Subscription): SubscriptionEntity {
		return new SubscriptionEntity(data);
	}

	get id(): string {
		return this.props.id;
	}

	get authId(): string {
		return this.props.authId;
	}

	get planId(): string {
		return this.props.planId;
	}

	get zyonSubscriptionId(): string | undefined {
		return this.props.zyonSubscriptionId;
	}

	get status(): SubscriptionStatus {
		return this.props.status;
	}

	get startDate(): Date | undefined {
		return this.props.startDate;
	}

	get endDate(): Date | undefined {
		return this.props.endDate;
	}

	get nextPaymentDate(): Date | undefined {
		return this.props.nextPaymentDate;
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

	setNextPaymentDate(nextPaymentDate: Date): void {
		this.props.nextPaymentDate = nextPaymentDate;
		this.props.updatedAt = new Date();
	}

	activate(startDate: Date, endDate: Date): void {
		this.props.status = 'ACTIVE';
		this.props.startDate = startDate;
		this.props.endDate = endDate;
		this.props.updatedAt = new Date();
	}

	cancel(): void {
		this.props.status = 'CANCELED';
		this.props.updatedAt = new Date();
	}

	expire(): void {
		this.props.status = 'EXPIRED';
		this.props.updatedAt = new Date();
	}

	isActive(): boolean {
		return this.props.status === 'ACTIVE';
	}

	isPending(): boolean {
		return this.props.status === 'PENDING';
	}

	toJSON(): Subscription {
		return {
			...this.props,
		};
	}
}
