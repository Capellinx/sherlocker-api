import type { Request, Response } from "express";
import type { SearchPhoneUsecase } from "@/application/use-cases/search/search-phone.usecase.ts";

export class SearchPhoneController {
	constructor(private readonly searchPhoneUsecase: SearchPhoneUsecase) {}

	async handle(req: Request, res: Response) {
		const { phone } = req.params;
		const authId = req.user?.id;

		if (!phone) {
			return res.status(400).json({
				success: false,
				message: "Phone is required",
			});
		}

		if (!authId) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await this.searchPhoneUsecase.execute(phone, authId);

		return res.status(200).json(result);
	}
}
