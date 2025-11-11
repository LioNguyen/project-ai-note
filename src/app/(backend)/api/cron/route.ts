import { NextResponse } from "next/server";
import { updatePineconeEmbeddings } from "./route.services";

// Configure route for Edge Runtime (optional, use Node.js runtime if needed)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max execution time

/**
 * GET /api/cron
 * Cron job endpoint to update Pinecone embeddings for recently updated notes
 * This endpoint is called automatically by Vercel Cron Jobs at 3am daily
 */
export async function GET() {
  try {
    // Log environment info for debugging
    console.log("[Cron] Running on environment:", process.env.VERCEL_ENV);
    console.log("[Cron] Domain:", process.env.VERCEL_URL);

    const result = await updatePineconeEmbeddings();

    return NextResponse.json({
      success: true,
      updated: result.updated,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
