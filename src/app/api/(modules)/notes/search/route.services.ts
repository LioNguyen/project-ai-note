import prisma from "@/app/api/core/utils/db/prisma";
import { containsSearch } from "@/app/api/core/utils/string";

import { SearchNotesParams, SearchNotesResponse } from "./route.types";

/**
 * Search and filter notes based on query and sort options
 * Supports case-insensitive and diacritic-insensitive search with pagination
 */
export async function searchNotes(
  params: SearchNotesParams,
): Promise<SearchNotesResponse> {
  const {
    userId,
    query = "",
    sortBy = "updated-desc",
    page = 1,
    pageSize = 12,
  } = params;

  // Fetch all user's notes
  const allNotes = await prisma.note.findMany({
    where: { userId },
  });

  // Filter notes by search query (case-insensitive, diacritic-insensitive)
  let filteredNotes = allNotes;
  if (query.trim()) {
    filteredNotes = allNotes.filter(
      (note) =>
        containsSearch(note.title, query) ||
        containsSearch(note.content || "", query),
    );
  }

  // Sort notes based on sortBy parameter
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "updated-desc":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case "updated-asc":
        return a.updatedAt.getTime() - b.updatedAt.getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Apply pagination
  const totalCount = sortedNotes.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedNotes = sortedNotes.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return {
    notes: paginatedNotes,
    total: totalCount,
    currentPage: page,
    totalPages,
  };
}
