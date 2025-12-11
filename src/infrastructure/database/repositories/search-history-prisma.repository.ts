import type { ISearchHistoryRepository } from "@/domain/repositories/search-history.repository.ts";
import { SearchHistoryEntity } from "@/domain/entities/search-history.ts";
import { prisma } from "@/main.ts";

export class PrismaSearchHistoryRepository implements ISearchHistoryRepository {
	async create(searchHistory: SearchHistoryEntity): Promise<void> {
		await prisma.searchHistory.create({
			data: {
				id: searchHistory.id,
				authId: searchHistory.authId,
				searchType: searchHistory.searchType,
				searchInput: searchHistory.searchInput,
				createdAt: searchHistory.createdAt,
			},
		});
	}

	async findByAuthId(authId: string, limit: number = 50): Promise<SearchHistoryEntity[]> {
		const searches = await prisma.searchHistory.findMany({
			where: { authId },
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return searches.map((search) =>
			SearchHistoryEntity.create({
				id: search.id,
				authId: search.authId,
				searchType: search.searchType,
				searchInput: search.searchInput,
				createdAt: search.createdAt,
			})
		);
	}

	async findById(id: string): Promise<SearchHistoryEntity | null> {
		const search = await prisma.searchHistory.findUnique({
			where: { id },
		});

		if (!search) return null;

		return SearchHistoryEntity.create({
			id: search.id,
			authId: search.authId,
			searchType: search.searchType,
			searchInput: search.searchInput,
			createdAt: search.createdAt,
		});
	}
}
