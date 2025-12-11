import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ITokenTransactionRepository } from "@/domain/repositories/token-transaction.repository.ts";
import { TokenTransactionEntity } from "@/domain/entities/token-transaction.ts";
import { NotFoundError } from "@/infrastructure/config/errors.ts";

export class ResetUserTokensUsecase {
	constructor(
		private readonly authRepository: IAuthRepository,
		private readonly tokenTransactionRepository: ITokenTransactionRepository
	) {}

	async execute(authId: string, newTokenAmount: number): Promise<void> {
		const auth = await this.authRepository.findById(authId);

		if (!auth) {
			throw new NotFoundError('User not found');
		}

		const balanceBefore = auth.tokenCount;
		const balanceAfter = newTokenAmount;

		const transaction = TokenTransactionEntity.create({
			authId,
			type: 'RESET',
			amount: newTokenAmount,
			description: 'Token reset on subscription renewal',
			balanceBefore,
			balanceAfter,
		});

		await this.tokenTransactionRepository.create(transaction);

		await this.authRepository.update(authId, { tokenCount: balanceAfter });
	}
}
