import type { Request, Response } from "express";
import { updateOnboardingIndividualSchema } from "@/application/dtos/onboarding/update-onboarding-individual.dto.ts";
import type { UpdateIndividualOnboardingUsecase } from "@/application/use-cases/individual-account/update-individual-onboarding.usecase.ts";

export class UpdateIndividualOnboardingController {
	constructor(
		private readonly updateIndividualOnboardingUsecase: UpdateIndividualOnboardingUsecase
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

			const validatedBody = updateOnboardingIndividualSchema.parse(req.body);

			const result = await this.updateIndividualOnboardingUsecase.execute({
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
