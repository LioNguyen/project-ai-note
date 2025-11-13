/**
 * Clear Trial Mode Data
 *
 * Clears all trial notes from localStorage (client) and Pinecone (server)
 * Called after user successfully signs in/signs up
 */

import { NextResponse } from "next/server";
import { notesIndex } from "@/app/api/core/utils/db/pinecone";

/**
 * POST /api/trial/clear
 *
 * Clears trial notes from Pinecone for a specific user session
 * Note: localStorage is cleared on the client side
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { noteIds } = body as { noteIds: string[] };

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return NextResponse.json(
        { success: true, deleted: 0, message: "No notes to clear" },
        { status: 200 },
      );
    }

    // Delete notes from Pinecone in batches of 100
    const batchSize = 100;
    let totalDeleted = 0;

    for (let i = 0; i < noteIds.length; i += batchSize) {
      const batch = noteIds.slice(i, i + batchSize);
      await notesIndex.deleteMany(batch);
      totalDeleted += batch.length;
    }

    console.log(
      `[Trial Clear] Successfully deleted ${totalDeleted} trial notes from Pinecone`,
    );

    return NextResponse.json({
      success: true,
      deleted: totalDeleted,
      message: `Successfully cleared ${totalDeleted} trial notes`,
    });
  } catch (error) {
    console.error("[Trial Clear] Error clearing trial notes:", error);
    return NextResponse.json(
      {
        error: "Failed to clear trial notes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
