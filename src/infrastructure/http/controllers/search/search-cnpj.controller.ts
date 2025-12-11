import type { Request, Response } from "express";
import type { SearchCnpjUsecase } from "@/application/use-cases/search/search-cnpj.usecase.ts";

export class SearchCnpjController {
	constructor(private readonly searchCnpjUsecase: SearchCnpjUsecase) {}

	async handle(req: Request, res: Response) {
		const { cnpj } = req.params;
		const authId = req.user?.id;

		if (!cnpj) {
			return res.status(400).json({
				success: false,
				message: "CNPJ is required",
			});
		}

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await this.searchCnpjUsecase.execute(cnpj, authId);

		return res.status(200).json(result);
	}
}
