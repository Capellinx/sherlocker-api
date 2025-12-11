import type { ITokenTransactionRepository } from "@/domain/repositories/token-transaction.repository.ts";
import { TokenTransactionEntity } from "@/domain/entities/token-transaction.ts";
import { prisma } from "@/main.ts";

export class PrismaTokenTransactionRepository implements ITokenTransactionRepository {
	async create(transaction: TokenTransactionEntity): Promise<TokenTransactionEntity> {
		const created = await prisma.tokenTransaction.create({
			data: {
				id: transaction.id,
				authId: transaction.authId,
				type: transaction.type,
				amount: transaction.amount,
				description: transaction.description ?? null,
				searchType: transaction.searchType ?? null,
				balanceBefore: transaction.balanceBefore,
				balanceAfter: transaction.balanceAfter,
				createdAt: transaction.createdAt,
			},
		});

		return TokenTransactionEntity.from({
			id: created.id,
			authId: created.authId,
			type: created.type as 'DEDUCTION' | 'RESET' | 'REFUND',
			amount: created.amount,
			description: created.description ?? undefined,
			searchType: created.searchType ?? undefined,
			balanceBefore: created.balanceBefore,
			balanceAfter: created.balanceAfter,
			createdAt: created.createdAt,
		});
	}

	async findByAuthId(authId: string, page: number = 1, limit: number = 10): Promise<TokenTransactionEntity[]> {
		const skip = (page - 1) * limit;

		const transactions = await prisma.tokenTransaction.findMany({
			where: { authId },
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: skip,
		});

		return transactions.map((transaction) =>
			TokenTransactionEntity.from({
				id: transaction.id,
				authId: transaction.authId,
				type: transaction.type as 'DEDUCTION' | 'RESET' | 'REFUND',
				amount: transaction.amount,
				description: transaction.description ?? undefined,
				searchType: transaction.searchType ?? undefined,
				balanceBefore: transaction.balanceBefore,
				balanceAfter: transaction.balanceAfter,
				createdAt: transaction.createdAt,
			})
		);
	}

	async countByAuthId(authId: string): Promise<number> {
		return await prisma.tokenTransaction.count({
			where: { authId },
		});
	}

	async findById(id: string): Promise<TokenTransactionEntity | null> {
		const transaction = await prisma.tokenTransaction.findUnique({
			where: { id },
		});

		if (!transaction) return null;

		return TokenTransactionEntity.from({
			id: transaction.id,
			authId: transaction.authId,
			type: transaction.type as 'DEDUCTION' | 'RESET' | 'REFUND',
			amount: transaction.amount,
			description: transaction.description ?? undefined,
			searchType: transaction.searchType ?? undefined,
			balanceBefore: transaction.balanceBefore,
			balanceAfter: transaction.balanceAfter,
			createdAt: transaction.createdAt,
		});
	}
}
