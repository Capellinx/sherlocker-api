import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { InsufficientTokensError, NotFoundError } from "@/infrastructure/config/errors.ts";

export class CheckTokenAvailabilityUsecase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(authId: string, requiredTokens: number): Promise<void> {
		const auth = await this.authRepository.findById(authId);

		if (!auth) {
			throw new NotFoundError('User not found');
		}

		if (auth.tokenCount < requiredTokens) {
			throw new InsufficientTokensError(
				`Insufficient tokens. Required: ${requiredTokens}, Available: ${auth.tokenCount}`
			);
		}
	}
}
