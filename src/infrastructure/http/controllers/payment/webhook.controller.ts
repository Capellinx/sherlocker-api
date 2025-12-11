import type { Request, Response } from "express";
import type { HandlePaymentWebhookUsecase } from "@/application/use-cases/payment/handle-payment-webhook.usecase.ts";

export class WebhookController {
	constructor(
		private readonly handlePaymentWebhookUsecase: HandlePaymentWebhookUsecase
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const statusMap: Record<string, "PENDING" | "PAID" | "FAILED" | "CANCELED" | "REFUNDED"> = {
			"PENDING": "PENDING",
			"COMPLETED": "PAID",
			"FAILED": "FAILED",
			"CANCELED": "CANCELED",
			"REFUNDED": "REFUNDED"
		};

		const zyonStatus = req.body.transaction?.status;
		const mappedStatus = statusMap[zyonStatus] || "PENDING";
		
		// O identifier é o nosso payment.id que enviamos ao criar o pagamento
		const paymentId = req.body.transaction?.identifier;
		const transactionId = req.body.transaction?.id;
		const paidAt = req.body.transaction?.payedAt;

		try {
			const result = await this.handlePaymentWebhookUsecase.execute({
				paymentId,
				transactionId,
				status: mappedStatus,
				paidAt,
			});

			return res.status(200).json(result);
		} catch (error) {
			// Sempre retornar 200 para o webhook não ficar tentando reenviar
			return res.status(200).json({
				success: false,
				message: error instanceof Error ? error.message : "Error processing webhook"
			});
		}
	}
}
