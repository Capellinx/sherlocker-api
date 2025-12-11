import type { Request, Response } from "express";
import type { SearchEmailUsecase } from "@/application/use-cases/search/search-email.usecase.ts";

export class SearchEmailController {
	constructor(private readonly searchEmailUsecase: SearchEmailUsecase) {}

	async handle(req: Request, res: Response) {
		const { email } = req.params;
		const { page } = req.query;
		const authId = req.user?.id;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const pageNumber = page ? Number.parseInt(page as string, 10) : 1;

		const result = await this.searchEmailUsecase.execute(email, authId, pageNumber);

		return res.status(200).json(result);
	}
}
