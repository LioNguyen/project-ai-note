import { Note } from "@prisma/client";

/**
 * Supported sort options for note search
 */
export type NoteSortBy =
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc";

/**
 * Request parameters for note search
 */
export interface SearchNotesParams {
  userId: string;
  query?: string;
  sortBy?: NoteSortBy;
  page?: number;
  pageSize?: number;
}

/**
 * Response type for note search results
 */
export interface SearchNotesResponse {
  notes: Note[];
  total: number;
  currentPage: number;
  totalPages: number;
}
