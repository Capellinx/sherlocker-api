import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";

export class CreateSearchHistoryUsecase {
	constructor(
		private readonly searchHistoryRepository: ISearchHistoryRepository
	) {}

	async execute(
		request: CreateSearchHistoryUsecase.Request
	): Promise<CreateSearchHistoryUsecase.Response> {
		const searchHistory = SearchHistoryEntity.create({
			authId: request.authId,
			searchType: request.searchType,
			searchInput: request.searchInput,
		});

		await this.searchHistoryRepository.create(searchHistory);

		return {
			id: searchHistory.id,
			authId: searchHistory.authId,
			searchType: searchHistory.searchType,
			searchInput: searchHistory.searchInput,
			createdAt: searchHistory.createdAt,
		};
	}
}

export namespace CreateSearchHistoryUsecase {
	export type Request = {
		authId: string;
		searchType: string;
		searchInput: string;
	};

	export type Response = {
		id: string;
		authId: string;
		searchType: string;
		searchInput: string;
		createdAt: Date;
	};
}
