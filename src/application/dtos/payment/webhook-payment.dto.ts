import { z } from "zod";

// Schema baseado no formato real da HotPayy/ZyonPay
export const webhookPaymentSchema = z.object({
	event: z.string(), // "TRANSACTION_PAID", etc
	token: z.string().optional().nullable(),
	offerCode: z.string().optional().nullable(),
	client: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		phone: z.string().optional().nullable(),
		cpf: z.string().optional().nullable(),
		cnpj: z.string().optional().nullable(),
		address: z.any().optional().nullable(),
	}).optional().nullable(),
	transaction: z.object({
		id: z.string(), // ID da transação na ZyonPay
		identifier: z.string(), // Nosso payment.id (usado para encontrar o pagamento)
		status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELED", "REFUNDED"]),
		paymentMethod: z.string(),
		originalAmount: z.number(),
		originalCurrency: z.string(),
		currency: z.string(),
		exchangeRate: z.number(),
		amount: z.number(),
		createdAt: z.string(),
		payedAt: z.string().optional().nullable(),
		boletoInformation: z.any().optional().nullable(),
		pixInformation: z.object({
			id: z.string(),
			qrCode: z.string(),
			description: z.string().optional().nullable(),
			image: z.string().optional().nullable(),
			expiresAt: z.string().optional().nullable(),
			endToEndId: z.string(),
			transactionId: z.string(),
			createdAt: z.string(),
			updatedAt: z.string(),
		}).optional().nullable(),
		pixMetadata: z.any().optional().nullable(),
	}),
	subscription: z.any().optional().nullable(),
	orderItems: z.array(z.object({
		id: z.string(),
		price: z.number(),
		product: z.object({
			id: z.string(),
			name: z.string(),
			externalId: z.string(),
		}),
	})).optional(),
	trackProps: z.object({
		authId: z.string(),
		isUpsell: z.boolean().optional(),
		subscriptionId: z.string(),
	}).optional().nullable(),
}).passthrough(); // Aceita outros campos também

export type WebhookPaymentDTO = z.infer<typeof webhookPaymentSchema>;

