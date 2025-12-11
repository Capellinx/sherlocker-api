import type { Request, Response } from "express";
import type { CreatePixPaymentUsecase } from "@/application/use-cases/payment/create-pix-payment.usecase.ts";

export class PaymentController {
	constructor(private readonly createPixPaymentUsecase: CreatePixPaymentUsecase) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const { planId } = req.body;
		const authId = req.user?.id;

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await this.createPixPaymentUsecase.execute({
			authId,
			planId,
		});

		return res.status(201).json({
			success: true,
			data: result,
		});
	}
}
