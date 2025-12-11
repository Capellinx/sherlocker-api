import type { ITokenTransactionRepository } from "@/domain/repositories/token-transaction.repository.ts";
import type { GetTokenTransactionsResponseDTO, TokenTransactionDTO } from "@/application/dtos/tokens/get-token-transactions.dto.ts";

export class GetTokenTransactionsUsecase {
	private readonly PER_PAGE = 10;

	constructor(
		private readonly tokenTransactionRepository: ITokenTransactionRepository
	) {}

	async execute(authId: string, page: number = 1): Promise<GetTokenTransactionsResponseDTO> {
		const [transactions, total] = await Promise.all([
			this.tokenTransactionRepository.findByAuthId(authId, page, this.PER_PAGE),
			this.tokenTransactionRepository.countByAuthId(authId)
		]);

		const totalPages = Math.ceil(total / this.PER_PAGE);

		const transactionDTOs: TokenTransactionDTO[] = transactions.map(transaction => ({
			id: transaction.id,
			type: transaction.type,
			amount: transaction.amount,
			...(transaction.description && { description: transaction.description }),
			...(transaction.searchType && { searchType: transaction.searchType }),
			balanceBefore: transaction.balanceBefore,
			balanceAfter: transaction.balanceAfter,
			createdAt: transaction.createdAt,
		}));

		return {
			transactions: transactionDTOs,
			pagination: {
				page,
				perPage: this.PER_PAGE,
				total,
				totalPages,
			},
		};
	}
}
