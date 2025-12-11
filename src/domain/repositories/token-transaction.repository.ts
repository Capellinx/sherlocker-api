import type { TokenTransactionEntity } from "../entities/token-transaction.ts";

export interface ITokenTransactionRepository {
	create(transaction: TokenTransactionEntity): Promise<TokenTransactionEntity>;
	findByAuthId(authId: string, page: number, limit: number): Promise<TokenTransactionEntity[]>;
	countByAuthId(authId: string): Promise<number>;
	findById(id: string): Promise<TokenTransactionEntity | null>;
}
