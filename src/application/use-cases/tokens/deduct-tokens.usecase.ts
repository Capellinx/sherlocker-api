import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ITokenTransactionRepository } from "@/domain/repositories/token-transaction.repository.ts";
import { TokenTransactionEntity } from "@/domain/entities/token-transaction.ts";
import type { SearchType } from "@/application/dtos/tokens/token-costs.dto.ts";
import { NotFoundError } from "@/infrastructure/config/errors.ts";

export class DeductTokensUsecase {
	constructor(
		private readonly authRepository: IAuthRepository,
		private readonly tokenTransactionRepository: ITokenTransactionRepository
	) {}

	async execute(authId: string, amount: number, searchType: SearchType): Promise<number> {
		const auth = await this.authRepository.findById(authId);

		if (!auth) {
			throw new NotFoundError('User not found');
		}

		const balanceBefore = auth.tokenCount;
		const balanceAfter = balanceBefore - amount;

		const transaction = TokenTransactionEntity.create({
			authId,
			type: 'DEDUCTION',
			amount,
			searchType,
			description: `Token deduction for ${searchType} search`,
			balanceBefore,
			balanceAfter,
		});

		await this.tokenTransactionRepository.create(transaction);

		await this.authRepository.update(authId, { tokenCount: balanceAfter });

		return balanceAfter;
	}
}
