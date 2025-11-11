import { NextResponse } from "next/server";
import { updatePineconeEmbeddings } from "./route.services";

// Use Node.js runtime for stable long-running tasks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

/**
 * Cron endpoint for updating Pinecone embeddings
 * Runs automatically via Vercel Cron at 3 AM UTC
 */
export async function GET(request: Request) {
  try {
    // --- Verify environment ---
    const environment = process.env.VERCEL_ENV;
    const vercelUrl = process.env.VERCEL_URL;
    const baseUrl =
      process.env.CRON_BASE_URL || (vercelUrl ? `https://${vercelUrl}` : "");

    console.log("[Cron] Environment:", environment);
    console.log("[Cron] Base URL:", baseUrl);

    if (environment !== "production") {
      console.log("[Cron] Skipping: not in production environment");
      return NextResponse.json(
        {
          success: false,
          message: "Cron only runs in production environment",
          environment,
        },
        { status: 403 },
      );
    }

    // --- Execute update ---
    console.log("[Cron] Starting Pinecone embedding update...");
    const result = await updatePineconeEmbeddings();

    console.log(`[Cron] Successfully updated ${result.updated} embeddings`);

    return NextResponse.json({
      success: true,
      updated: result.updated,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Cron] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
