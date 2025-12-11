import { z } from "zod";

export const createSearchHistorySchema = z.object({
	searchType: z.string().min(1, "Search type is required"),
	searchInput: z.string().min(1, "Search input is required"),
});

export type CreateSearchHistoryDTO = z.infer<typeof createSearchHistorySchema>;
