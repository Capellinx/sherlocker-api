export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'REFUNDED';

export interface Payment {
	id: string;
	subscriptionId: string;
	transactionId: string | undefined;
	amount: number;
	status: PaymentStatus;
	pixQrCode: string | undefined;
	pixCopyPaste: string | undefined;
	expiresAt: Date | undefined;
	paidAt: Date | undefined;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | undefined;
}

export class PaymentEntity {
	private constructor(private props: Payment) {}

	static create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'transactionId' | 'pixQrCode' | 'pixCopyPaste' | 'expiresAt' | 'paidAt' | 'deletedAt'> & { 
		id?: string; 
		transactionId?: string; 
		pixQrCode?: string; 
		pixCopyPaste?: string; 
		expiresAt?: Date; 
		paidAt?: Date; 
		deletedAt?: Date;
	}): PaymentEntity {
		return new PaymentEntity({
			id: data.id || crypto.randomUUID(),
			subscriptionId: data.subscriptionId,
			transactionId: data.transactionId,
			amount: data.amount,
			status: 'PENDING',
			pixQrCode: data.pixQrCode,
			pixCopyPaste: data.pixCopyPaste,
			expiresAt: data.expiresAt,
			paidAt: data.paidAt,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: data.deletedAt,
		});
	}

	static from(data: Payment): PaymentEntity {
		return new PaymentEntity(data);
	}

	get id(): string {
		return this.props.id;
	}

	get subscriptionId(): string {
		return this.props.subscriptionId;
	}

	get transactionId(): string | undefined {
		return this.props.transactionId;
	}

	get amount(): number {
		return this.props.amount;
	}

	get status(): PaymentStatus {
		return this.props.status;
	}

	get pixQrCode(): string | undefined {
		return this.props.pixQrCode;
	}

	get pixCopyPaste(): string | undefined {
		return this.props.pixCopyPaste;
	}

	get expiresAt(): Date | undefined {
		return this.props.expiresAt;
	}

	get paidAt(): Date | undefined {
		return this.props.paidAt;
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

	markAsPaid(paidAt: Date = new Date()): void {
		this.props.status = 'PAID';
		this.props.paidAt = paidAt;
		this.props.updatedAt = new Date();
	}

	markAsFailed(): void {
		this.props.status = 'FAILED';
		this.props.updatedAt = new Date();
	}

	cancel(): void {
		this.props.status = 'CANCELED';
		this.props.updatedAt = new Date();
	}

	refund(): void {
		this.props.status = 'REFUNDED';
		this.props.updatedAt = new Date();
	}

	setTransactionId(transactionId: string): void {
		this.props.transactionId = transactionId;
		this.props.updatedAt = new Date();
	}

	setPixData(qrCode: string, copyPaste: string): void {
		this.props.pixQrCode = qrCode;
		this.props.pixCopyPaste = copyPaste;
		this.props.updatedAt = new Date();
	}

	isPaid(): boolean {
		return this.props.status === 'PAID';
	}

	isPending(): boolean {
		return this.props.status === 'PENDING';
	}

	toJSON(): Payment {
		return {
			...this.props,
		};
	}
}
