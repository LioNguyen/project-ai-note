import { NextResponse } from "next/server";
import { updatePineconeEmbeddings } from "./route.services";

// Use Node.js runtime for stable long-running tasks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

/**
 * Cron endpoint for updating Pinecone embeddings
 * Runs automatically via Vercel Cron at 21:00 UTC (9pm)
 * No authentication required - can be called directly for testing
 */
export async function GET(request: Request) {
  try {
    // --- Log execution info ---
    const environment = process.env.VERCEL_ENV || "development";
    const vercelUrl = process.env.VERCEL_URL || "localhost";
    const timestamp = new Date().toISOString();

    console.log("=".repeat(50));
    console.log("[Cron] Execution started at:", timestamp);
    console.log("[Cron] Environment:", environment);
    console.log("[Cron] URL:", vercelUrl);
    console.log("=".repeat(50));

    // --- Execute update ---
    console.log("[Cron] Starting Pinecone embedding update...");
    const startTime = Date.now();

    const result = await updatePineconeEmbeddings();

    const duration = Date.now() - startTime;

    console.log("=".repeat(50));
    console.log(`[Cron] ✅ Successfully updated ${result.updated} embeddings`);
    console.log(
      `[Cron] Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    console.log(`[Cron] Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      success: true,
      updated: result.updated,
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      message: `Successfully updated ${result.updated} embeddings in ${(
        duration / 1000
      ).toFixed(2)}s`,
    });
  } catch (err: any) {
    console.error("=".repeat(50));
    console.error("[Cron] ❌ Error occurred:");
    console.error(err);
    console.error("=".repeat(50));

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
