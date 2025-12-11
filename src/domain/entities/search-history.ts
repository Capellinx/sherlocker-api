import { randomUUID } from "node:crypto";

export class SearchHistoryEntity {
	private constructor(
		private readonly _id: string,
		private readonly _authId: string,
		private readonly _searchType: string,
		private readonly _searchInput: string,
		private readonly _createdAt: Date
	) {}

	static create(data: {
		id?: string;
		authId: string;
		searchType: string;
		searchInput: string;
		createdAt?: Date;
	}): SearchHistoryEntity {
		return new SearchHistoryEntity(
			data.id || randomUUID(),
			data.authId,
			data.searchType,
			data.searchInput,
			data.createdAt || new Date()
		);
	}

	get id(): string {
		return this._id;
	}

	get authId(): string {
		return this._authId;
	}

	get searchType(): string {
		return this._searchType;
	}

	get searchInput(): string {
		return this._searchInput;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	toJSON() {
		return {
			id: this._id,
			authId: this._authId,
			searchType: this._searchType,
			searchInput: this._searchInput,
			createdAt: this._createdAt,
		};
	}
}
