import { NextResponse } from "next/server";
import { updatePineconeEmbeddings } from "./route.services";

/**
 * GET /api/cron
 * Cron job endpoint to update Pinecone embeddings for recently updated notes
 * This endpoint is called automatically by Vercel Cron Jobs at 3am daily
 */
export async function GET() {
  try {
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
