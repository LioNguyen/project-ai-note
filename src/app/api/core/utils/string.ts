/**
 * String utility functions for text normalization and search
 * Combines Vietnamese-aware text processing with general string operations
 */

/**
 * Normalize Vietnamese text by removing diacritics
 * This allows searching with or without accents
 *
 * Example:
 * "Quán ăn ngon ở Sài Gòn" -> "quan an ngon o sai gon"
 * "PHỞ BÒ" -> "pho bo"
 */
export function normalizeVietnamese(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase() // Convert to lowercase FIRST
    .normalize("NFD") // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d") // Also lowercase
    .trim();
}

/**
 * Check if text contains search query (case-insensitive, diacritic-insensitive)
 * Works by normalizing both the text and query, then doing a simple string match
 * Supports Vietnamese characters
 */
export function containsSearch(text: string, query: string): boolean {
  if (!text || !query) return false;
  return normalizeVietnamese(text).includes(normalizeVietnamese(query));
}
