import type { Request, Response } from "express";
import type { SearchNameUsecase } from "@/application/use-cases/search/search-name.usecase.ts";

export class SearchNameController {
	constructor(private readonly searchNameUsecase: SearchNameUsecase) {}

	async handle(req: Request, res: Response) {
		const { name } = req.params;
		const { page } = req.query;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: "Name is required",
			});
		}

		const pageNumber = page ? Number.parseInt(page as string, 10) : 1;

		const result = await this.searchNameUsecase.execute(name, pageNumber);

		return res.status(200).json({
			success: result.success,
			data: result.data,
			message: result.message,
		});
	}
}
