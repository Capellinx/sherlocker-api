import type { IPaymentRepository } from "@/domain/repositories/payment.repository.ts";
import { PaymentEntity } from "@/domain/entities/payment.ts";
import { prisma } from "@/main.ts";
import type { Decimal } from "@prisma/client/runtime/library";

function toPaymentEntity(prismaData: {
	id: string;
	subscriptionId: string;
	transactionId: string | null;
	amount: Decimal;
	status: "PENDING" | "PAID" | "FAILED" | "CANCELED" | "REFUNDED";
	pixQrCode: string | null;
	pixCopyPaste: string | null;
	expiresAt: Date | null;
	paidAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}): PaymentEntity {
	return PaymentEntity.from({
		id: prismaData.id,
		subscriptionId: prismaData.subscriptionId,
		transactionId: prismaData.transactionId ?? undefined,
		amount: Number(prismaData.amount),
		status: prismaData.status,
		pixQrCode: prismaData.pixQrCode ?? undefined,
		pixCopyPaste: prismaData.pixCopyPaste ?? undefined,
		expiresAt: prismaData.expiresAt ?? undefined,
		paidAt: prismaData.paidAt ?? undefined,
		createdAt: prismaData.createdAt,
		updatedAt: prismaData.updatedAt,
		deletedAt: prismaData.deletedAt ?? undefined,
	});
}

export class PrismaPaymentRepository implements IPaymentRepository {
	async create(payment: PaymentEntity): Promise<PaymentEntity> {
		const data = await prisma.payment.create({
			data: {
				id: payment.id,
				subscriptionId: payment.subscriptionId,
				...(payment.transactionId !== undefined && { transactionId: payment.transactionId }),
				amount: payment.amount,
				status: payment.status,
				...(payment.pixQrCode !== undefined && { pixQrCode: payment.pixQrCode }),
				...(payment.pixCopyPaste !== undefined && { pixCopyPaste: payment.pixCopyPaste }),
				...(payment.paidAt !== undefined && { paidAt: payment.paidAt }),
				createdAt: payment.createdAt,
				updatedAt: payment.updatedAt,
			},
		});

		return toPaymentEntity(data);
	}

	async findById(id: string): Promise<PaymentEntity | null> {
		const payment = await prisma.payment.findUnique({
			where: { id },
		});

		if (!payment) return null;

		return toPaymentEntity(payment);
	}

	async findBySubscriptionId(subscriptionId: string): Promise<PaymentEntity[]> {
		const payments = await prisma.payment.findMany({
			where: { subscriptionId },
			orderBy: { createdAt: "desc" },
		});

		return payments.map(toPaymentEntity);
	}

	async findByTransactionId(transactionId: string): Promise<PaymentEntity | null> {
		const payment = await prisma.payment.findUnique({
			where: { transactionId },
		});

		if (!payment) return null;

		return toPaymentEntity(payment);
	}

	async findByPixCopyPaste(pixCopyPaste: string): Promise<PaymentEntity | null> {
		const payment = await prisma.payment.findFirst({
			where: { pixCopyPaste },
		});

		if (!payment) return null;

		return toPaymentEntity(payment);
	}

	async findLatestBySubscriptionId(subscriptionId: string): Promise<PaymentEntity | null> {
		const payment = await prisma.payment.findFirst({
			where: { subscriptionId },
			orderBy: { createdAt: "desc" },
		});

		if (!payment) return null;

		return toPaymentEntity(payment);
	}

	async update(
		id: string,
		data: Partial<ReturnType<PaymentEntity["toJSON"]>>
	): Promise<PaymentEntity> {
		const updated = await prisma.payment.update({
			where: { id },
			data: {
				...(data.status !== undefined && { status: data.status }),
				...(data.transactionId !== undefined && {
					transactionId: data.transactionId,
				}),
				...(data.pixQrCode !== undefined && { pixQrCode: data.pixQrCode }),
				...(data.pixCopyPaste !== undefined && {
					pixCopyPaste: data.pixCopyPaste,
				}),
				...(data.paidAt !== undefined && { paidAt: data.paidAt }),
				updatedAt: new Date(),
			},
		});

		return toPaymentEntity(updated);
	}

	async delete(id: string): Promise<void> {
		await prisma.payment.delete({
			where: { id },
		});
	}

	async findPendingPayments(): Promise<PaymentEntity[]> {
		const payments = await prisma.payment.findMany({
			where: {
				status: "PENDING",
			},
			orderBy: { createdAt: "asc" },
		});

		return payments.map(toPaymentEntity);
	}

	async findPendingBySubscriptionId(subscriptionId: string): Promise<PaymentEntity | null> {
		const payment = await prisma.payment.findFirst({
			where: {
				subscriptionId,
				status: "PENDING",
			},
			orderBy: { createdAt: "desc" },
		});

		if (!payment) return null;

		return toPaymentEntity(payment);
	}

	async findExpiredPendingPayments(daysExpired: number): Promise<PaymentEntity[]> {
		// Calcula a data limite (hoje - dias de expiração)
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() - daysExpired);

		const payments = await prisma.payment.findMany({
			where: {
				status: "PENDING",
				createdAt: {
					lte: expirationDate, // Pagamentos criados há mais de X dias
				},
			},
			include: {
				subscription: {
					include: {
						plan: true,
					},
				},
			},
			orderBy: { createdAt: "asc" },
		});

		return payments.map(toPaymentEntity);
	}
}
