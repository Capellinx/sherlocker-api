import type { Request, Response } from "express";
import type { GetTokenTransactionsUsecase } from "@/application/use-cases/tokens/get-token-transactions.usecase.ts";
import { getTokenTransactionsQuerySchema } from "@/application/dtos/tokens/get-token-transactions.dto.ts";

export class GetTokenTransactionsController {
	constructor(
		private readonly getTokenTransactionsUsecase: GetTokenTransactionsUsecase
	) {}

	async handle(req: Request, res: Response) {
		const authId = req.user?.id;

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const { page } = getTokenTransactionsQuerySchema.parse(req.query);

		const result = await this.getTokenTransactionsUsecase.execute(authId, page);

		return res.status(200).json(result);
	}
}
