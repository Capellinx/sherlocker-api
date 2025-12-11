import type { PaymentEntity } from "../entities/payment.ts";

export interface IPaymentRepository {
	create(payment: PaymentEntity): Promise<PaymentEntity>;
	findById(id: string): Promise<PaymentEntity | null>;
	findBySubscriptionId(subscriptionId: string): Promise<PaymentEntity[]>;
	findByTransactionId(transactionId: string): Promise<PaymentEntity | null>;
	findByPixCopyPaste(pixCopyPaste: string): Promise<PaymentEntity | null>;
	findLatestBySubscriptionId(subscriptionId: string): Promise<PaymentEntity | null>;
	update(id: string, data: Partial<ReturnType<PaymentEntity['toJSON']>>): Promise<PaymentEntity>;
	delete(id: string): Promise<void>;
	findPendingPayments(): Promise<PaymentEntity[]>;
	findPendingBySubscriptionId(subscriptionId: string): Promise<PaymentEntity | null>;
	findExpiredPendingPayments(daysExpired: number): Promise<PaymentEntity[]>;
}
