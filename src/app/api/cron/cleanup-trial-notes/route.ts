/**
 * Cleanup Trial Notes Cron Job
 *
 * This endpoint removes trial notes from Pinecone that are older than 7 days.
 * Should be called by a cron service (e.g., Vercel Cron, GitHub Actions).
 *
 * Security: Protected by CRON_SECRET environment variable
 */

import { NextRequest, NextResponse } from "next/server";
import { notesIndex } from "@/app/api/core/utils/db/pinecone";

/**
 * DELETE /api/cron/cleanup-trial-notes
 *
 * Removes trial notes older than 7 days from Pinecone
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron job not configured" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString();

    console.log(
      `[Cleanup] Starting cleanup for trial notes older than ${cutoffDate}`,
    );

    // Query for old trial notes
    // Note: We need to use a dummy vector for the query
    // In production, you might want to use Pinecone's list() or query with metadata filtering
    const dummyVector = new Array(1536).fill(0); // OpenAI embedding dimension

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
      return new Date(createdAt) < sevenDaysAgo;
    });

    if (notesToDelete.length === 0) {
      console.log("[Cleanup] No old trial notes found");
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: "No old trial notes to clean up",
      });
    }

    // Delete old notes
    const idsToDelete = notesToDelete.map((match) => match.id);

    console.log(`[Cleanup] Deleting ${idsToDelete.length} old trial notes`);

    // Delete in batches of 100 (Pinecone limit)
    const batchSize = 100;
    let totalDeleted = 0;

    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize);
      await notesIndex.deleteMany(batch);
      totalDeleted += batch.length;
      console.log(
        `[Cleanup] Deleted batch: ${totalDeleted}/${idsToDelete.length}`,
      );
    }

    console.log(
      `[Cleanup] Successfully deleted ${totalDeleted} old trial notes`,
    );

    return NextResponse.json({
      success: true,
      deleted: totalDeleted,
      cutoffDate,
      message: `Successfully cleaned up ${totalDeleted} trial notes older than 7 days`,
    });
  } catch (error) {
    console.error("[Cleanup] Error cleaning up trial notes:", error);
    return NextResponse.json(
      {
        error: "Failed to cleanup trial notes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/cron/cleanup-trial-notes
 *
 * Returns information about trial notes that would be cleaned up (dry run)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron job not configured" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString();

    // Query for old trial notes
    const dummyVector = new Array(1536).fill(0);

    const queryResponse = await notesIndex.query({
      vector: dummyVector,
      topK: 10000,
      filter: {
        userId: { $eq: "trial-user" },
      },
      includeMetadata: true,
    });

    // Filter by date
    const notesToDelete = queryResponse.matches.filter((match) => {
      const createdAt = match.metadata?.createdAt as string;
      if (!createdAt) return false;
      return new Date(createdAt) < sevenDaysAgo;
    });

    // Get statistics
    const totalTrialNotes = queryResponse.matches.length;
    const oldNotes = notesToDelete.length;
    const recentNotes = totalTrialNotes - oldNotes;

    return NextResponse.json({
      success: true,
      dryRun: true,
      cutoffDate,
      stats: {
        totalTrialNotes,
        oldNotes,
        recentNotes,
        wouldDelete: oldNotes,
      },
      message: `Would delete ${oldNotes} trial notes older than 7 days`,
    });
  } catch (error) {
    console.error("[Cleanup] Error checking trial notes:", error);
    return NextResponse.json(
      {
        error: "Failed to check trial notes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
