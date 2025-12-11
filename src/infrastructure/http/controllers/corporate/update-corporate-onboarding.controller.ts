import type { Request, Response } from "express";
import { updateOnboardingCorporateSchema } from "@/application/dtos/onboarding/update-onboarding-corporate.dto.ts";
import type { UpdateCorporateOnboardingUsecase } from "@/application/use-cases/corporate-account/update-corporate-onboarding.usecase.ts";

export class UpdateCorporateOnboardingController {
	constructor(
		private readonly updateCorporateOnboardingUsecase: UpdateCorporateOnboardingUsecase
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		try {
			const tokenData = req.user;

			if (!tokenData) {
				return res.status(401).json({
					error: "Unauthorized",
					message: "Authentication required"
				});
			}

			const validatedBody = updateOnboardingCorporateSchema.parse(req.body);

			const result = await this.updateCorporateOnboardingUsecase.execute({
				authId: tokenData.id,
				...validatedBody
			});

			return res.status(200).json(result);
		} catch (error: any) {
			if (error.name === "ZodError") {
				return res.status(400).json({
					error: "Validation Error",
					message: error.errors
				});
			}

			return res.status(error.statusCode || 500).json({
				error: error.name || "Internal Server Error",
				message: error.message || "An unexpected error occurred"
			});
		}
	}
}
