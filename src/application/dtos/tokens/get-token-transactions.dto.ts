import { z } from "zod";

export const getTokenTransactionsQuerySchema = z.object({
	page: z.string().optional().default("1").transform(Number),
});

export type GetTokenTransactionsQuery = z.infer<typeof getTokenTransactionsQuerySchema>;

export interface TokenTransactionDTO {
	id: string;
	type: 'DEDUCTION' | 'RESET' | 'REFUND';
	amount: number;
	description?: string;
	searchType?: string;
	balanceBefore: number;
	balanceAfter: number;
	createdAt: Date;
}

export interface GetTokenTransactionsResponseDTO {
	transactions: TokenTransactionDTO[];
	pagination: {
		page: number;
		perPage: number;
		total: number;
		totalPages: number;
	};
}
