export type TokenTransactionType = 'DEDUCTION' | 'RESET' | 'REFUND';

export interface TokenTransaction {
	id: string;
	authId: string;
	type: TokenTransactionType;
	amount: number;
	description: string | undefined;
	searchType: string | undefined;
	balanceBefore: number;
	balanceAfter: number;
	createdAt: Date;
}

export class TokenTransactionEntity {
	private constructor(private props: TokenTransaction) {}

	static create(
		data: Omit<TokenTransaction, 'id' | 'createdAt' | 'description' | 'searchType'> & { id?: string; description?: string; searchType?: string }
	): TokenTransactionEntity {
		return new TokenTransactionEntity({
			id: data.id || crypto.randomUUID(),
			authId: data.authId,
			type: data.type,
			amount: data.amount,
			description: data.description,
			searchType: data.searchType,
			balanceBefore: data.balanceBefore,
			balanceAfter: data.balanceAfter,
			createdAt: new Date(),
		});
	}

	static from(data: TokenTransaction): TokenTransactionEntity {
		return new TokenTransactionEntity(data);
	}

	get id(): string {
		return this.props.id;
	}

	get authId(): string {
		return this.props.authId;
	}

	get type(): TokenTransactionType {
		return this.props.type;
	}

	get amount(): number {
		return this.props.amount;
	}

	get description(): string | undefined {
		return this.props.description;
	}

	get searchType(): string | undefined {
		return this.props.searchType;
	}

	get balanceBefore(): number {
		return this.props.balanceBefore;
	}

	get balanceAfter(): number {
		return this.props.balanceAfter;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	toJSON(): TokenTransaction {
		return {
			id: this.id,
			authId: this.authId,
			type: this.type,
			amount: this.amount,
			description: this.description,
			searchType: this.searchType,
			balanceBefore: this.balanceBefore,
			balanceAfter: this.balanceAfter,
			createdAt: this.createdAt,
		};
	}
}
