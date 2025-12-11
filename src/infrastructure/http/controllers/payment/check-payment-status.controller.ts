import type { Request, Response } from "express";
import type { CheckPaymentStatusUsecase } from "@/application/use-cases/payment/check-payment-status.usecase.ts";

export class CheckPaymentStatusController {
	constructor(
		private readonly checkPaymentStatusUsecase: CheckPaymentStatusUsecase
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const { pixCopyPaste } = req.body;
		const authId = req.user?.id;

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await this.checkPaymentStatusUsecase.execute({
			authId,
			pixCopyPaste,
		});

		return res.status(200).json({
			success: result.isPaid,
			data: result,
		});
	}
}
