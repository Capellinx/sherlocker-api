import type { Request, Response } from "express";
import type { SearchCpfUsecase } from "@/application/use-cases/search/search-cpf.usecase.ts";

export class SearchCpfController {
	constructor(private readonly searchCpfUsecase: SearchCpfUsecase) {}

	async handle(req: Request, res: Response) {
		const { cpf } = req.params;
		const authId = req.user?.id;

		if (!cpf) {
			return res.status(400).json({
				success: false,
				message: "CPF is required",
			});
		}

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await this.searchCpfUsecase.execute(cpf, authId);

		return res.status(200).json(result);
	}
}
