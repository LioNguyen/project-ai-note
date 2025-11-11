import { getEmbedding } from "@/app/(backend)/api/core/utils/openai";

/**
 * Generate embedding vector for note content
 * Combines title and content for semantic search
 */
export async function getEmbeddingForNote(
  title: string,
  content: string | undefined,
): Promise<number[]> {
  return getEmbedding(title + "\n\n" + (content ?? ""));
}
