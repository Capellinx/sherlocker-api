import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";

export class GetUserSearchHistoryUsecase {
	constructor(
		private readonly searchHistoryRepository: ISearchHistoryRepository
	) {}

	async execute(
		request: GetUserSearchHistoryUsecase.Request
	): Promise<GetUserSearchHistoryUsecase.Response> {
		const searchHistory = await this.searchHistoryRepository.findByAuthId(
			request.authId,
			request.limit || 10
		);

		return {
			total: searchHistory.length,
			searches: searchHistory.map((search) => ({
				id: search.id,
				searchType: search.searchType,
				searchInput: search.searchInput,
				createdAt: search.createdAt,
			})),
		};
	}
}

export namespace GetUserSearchHistoryUsecase {
	export type Request = {
		authId: string;
		limit?: number;
	};

	export type Response = {
		total: number;
		searches: Array<{
			id: string;
			searchType: string;
			searchInput: string;
			createdAt: Date;
		}>;
	};
}
