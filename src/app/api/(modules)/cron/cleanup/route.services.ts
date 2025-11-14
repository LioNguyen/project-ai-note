import { notesIndex } from "@/app/api/core/utils/db/pinecone";
import type { CleanupStats } from "./route.types";

/**
 * Service to query and filter trial notes older than specified days
 * Returns the filtered notes and statistics
 */
export async function getOldTrialNotes(daysOld: number = 7) {
  try {
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    console.log(
      `[Cleanup] Querying trial notes older than ${cutoffDate.toISOString()}`,
    );

    // Query for trial notes using a dummy vector
    // Note: Pinecone requires a vector for query, even when filtering by metadata
    const dummyVector = new Array(768).fill(0); // Google text-embedding-004 dimension

    const queryResponse = await notesIndex.query({
      vector: dummyVector,
      topK: 10000, // Get all trial notes (adjust based on expected volume)
      filter: {
        userId: { $eq: "trial-user" },
      },
      includeMetadata: true,
    });

    // Filter by date
    const notesToDelete = queryResponse.matches.filter((match) => {
      const createdAt = match.metadata?.createdAt as string;
      if (!createdAt) return false;
      return new Date(createdAt) < cutoffDate;
    });

    const totalTrialNotes = queryResponse.matches.length;
    const oldNotes = notesToDelete.length;

    console.log(`[Cleanup] Found ${totalTrialNotes} total trial notes`);
    console.log(`[Cleanup] Found ${oldNotes} old notes to delete`);

    return {
      notesToDelete,
      cutoffDate: cutoffDate.toISOString(),
      stats: {
        totalTrialNotes,
        oldNotes,
        recentNotes: totalTrialNotes - oldNotes,
        wouldDelete: oldNotes,
      },
    };
  } catch (error) {
    console.error("[Cleanup] Error querying trial notes:", error);
    throw error;
  }
}

/**
 * Service to delete notes from Pinecone in batches
 * Returns the total number of deleted notes
 */
export async function deleteNotesInBatches(noteIds: string[]) {
  try {
    if (noteIds.length === 0) {
      console.log("[Cleanup] No notes to delete");
      return 0;
    }

    console.log(`[Cleanup] Deleting ${noteIds.length} notes in batches`);

    // Delete in batches of 100 (Pinecone limit)
    const batchSize = 100;
    let totalDeleted = 0;

    for (let i = 0; i < noteIds.length; i += batchSize) {
      const batch = noteIds.slice(i, i + batchSize);
      await notesIndex.deleteMany(batch);
      totalDeleted += batch.length;
      console.log(`[Cleanup] Deleted batch: ${totalDeleted}/${noteIds.length}`);
    }

    console.log(`[Cleanup] Successfully deleted ${totalDeleted} notes`);
    return totalDeleted;
  } catch (error) {
    console.error("[Cleanup] Error deleting notes:", error);
    throw error;
  }
}

/**
 * Service to execute the cleanup process
 * Queries old trial notes and deletes them
 */
export async function executeCleanup(daysOld: number = 7) {
  try {
    console.log(
      `[Cleanup] Starting cleanup for trial notes older than ${daysOld} days`,
    );

    // Get old notes
    const { notesToDelete, cutoffDate, stats } =
      await getOldTrialNotes(daysOld);

    if (notesToDelete.length === 0) {
      console.log("[Cleanup] No old trial notes found");
      return {
        success: true,
        deleted: 0,
        cutoffDate,
        message: "No old trial notes to clean up",
      };
    }

    // Delete notes
    const idsToDelete = notesToDelete.map((match) => match.id);
    const totalDeleted = await deleteNotesInBatches(idsToDelete);

    console.log(
      `[Cleanup] Successfully deleted ${totalDeleted} old trial notes`,
    );

    return {
      success: true,
      deleted: totalDeleted,
      cutoffDate,
      message: `Successfully cleaned up ${totalDeleted} trial notes older than ${daysOld} days`,
    };
  } catch (error) {
    console.error("[Cleanup] Error executing cleanup:", error);
    throw error;
  }
}

/**
 * Service to perform a dry run of the cleanup
 * Returns statistics without deleting any notes
 */
export async function dryRunCleanup(daysOld: number = 7) {
  try {
    console.log(
      `[Cleanup] Performing dry run for notes older than ${daysOld} days`,
    );

    // Get old notes (but don't delete)
    const { cutoffDate, stats } = await getOldTrialNotes(daysOld);

    console.log(
      `[Cleanup] Dry run complete: ${stats.oldNotes} notes would be deleted`,
    );

    return {
      success: true,
      dryRun: true,
      cutoffDate,
      stats,
      message: `Would delete ${stats.oldNotes} trial notes older than ${daysOld} days`,
    };
  } catch (error) {
    console.error("[Cleanup] Error during dry run:", error);
    throw error;
  }
}
