import prisma from "@/app/(backend)/api/core/utils/db/prisma";
import { notesIndex } from "@/app/(backend)/api/core/utils/db/pinecone";
import { getEmbedding } from "@/app/(backend)/api/core/utils/openai";

/**
 * Service to update Pinecone embeddings for recently updated notes
 * Fetches notes updated in the last 7 days and updates their embeddings in Pinecone
 */
export async function updatePineconeEmbeddings() {
  try {
    // 1. Get notes updated in the last 7 days
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const notes = await prisma.note.findMany({
      where: { updatedAt: { gte: oneWeekAgo } },
    });

    console.log(
      `[Cron] Found ${notes.length} notes updated in the last 7 days`,
    );

    // 2. Generate and update embeddings for each note
    let updatedCount = 0;

    for (const note of notes) {
      // Skip notes without content
      if (!note.content) continue;

      const embedding = await getEmbedding(note.content);

      // 3. Update in Pinecone
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { title: note.title },
        },
      ]);

      updatedCount++;
      console.log(
        `[Cron] Updated embedding for note: ${note.id} - ${note.title}`,
      );
    }

    console.log(`[Cron] Successfully updated ${updatedCount} embeddings`);

    return {
      success: true,
      updated: updatedCount,
    };
  } catch (error) {
    console.error("[Cron] Error updating Pinecone:", error);
    throw error;
  }
}
