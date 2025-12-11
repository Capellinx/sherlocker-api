import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { TokenBalanceResponseDTO } from "@/application/dtos/tokens/token-balance-response.dto.ts";
import { NotFoundError } from "@/infrastructure/config/errors.ts";

export class GetTokenBalanceUsecase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(authId: string): Promise<TokenBalanceResponseDTO> {
		const auth = await this.authRepository.findById(authId);

		if (!auth) {
			throw new NotFoundError('User not found');
		}

		return {
			tokenCount: auth.tokenCount,
			message: `You have ${auth.tokenCount} tokens available`,
		};
	}
}
