import type { Request, Response } from "express";
import type { GetUserSearchHistoryUsecase } from "@/application/use-cases/search-history/get-user-search-history.usecase.ts";

export class GetSearchHistoryController {
	constructor(
		private readonly getUserSearchHistoryUsecase: GetUserSearchHistoryUsecase
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const authId = req.user?.id;

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		try {
			const result = await this.getUserSearchHistoryUsecase.execute({
				authId,
				limit: 10,
			});

			return res.status(200).json({
				success: true,
				data: result.searches,
				total: result.total,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Failed to fetch search history",
			});
		}
	}
}
