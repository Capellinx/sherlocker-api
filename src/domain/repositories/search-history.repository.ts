import type { SearchHistoryEntity } from "@/domain/entities/search-history.ts";

export interface ISearchHistoryRepository {
	create(searchHistory: SearchHistoryEntity): Promise<void>;
	findByAuthId(authId: string, limit?: number): Promise<SearchHistoryEntity[]>;
	findById(id: string): Promise<SearchHistoryEntity | null>;
}
