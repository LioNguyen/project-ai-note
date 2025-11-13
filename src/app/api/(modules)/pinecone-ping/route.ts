import { NextResponse } from "next/server";
import { pingPineconeIndex } from "./route.services";

// Use Node.js runtime for stable long-running tasks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ping endpoint for Pinecone index health check
 * Runs automatically via GitHub Actions daily at 20:00 UTC
 * No authentication required - can be called directly for testing
 */
export async function GET(request: Request) {
  try {
    // --- Log execution info ---
    const environment = process.env.VERCEL_ENV || "development";
    const vercelUrl = process.env.VERCEL_URL || "localhost";
    const timestamp = new Date().toISOString();

    console.log("=".repeat(50));
    console.log("[Pinecone Ping] Execution started at:", timestamp);
    console.log("[Pinecone Ping] Environment:", environment);
    console.log("[Pinecone Ping] URL:", vercelUrl);
    console.log("=".repeat(50));

    // --- Execute ping ---
    console.log("[Pinecone Ping] Pinging Pinecone index...");
    const startTime = Date.now();

    const result = await pingPineconeIndex();

    const duration = Date.now() - startTime;

    console.log("=".repeat(50));
    console.log(`[Pinecone Ping] ✅ Successfully pinged Pinecone index`);
    console.log(`[Pinecone Ping] Stats: ${JSON.stringify(result.stats)}`);
    console.log(
      `[Pinecone Ping] Duration: ${duration}ms (${(duration / 1000).toFixed(
        2,
      )}s)`,
    );
    console.log(`[Pinecone Ping] Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      success: true,
      stats: result.stats,
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      message: `Successfully pinged Pinecone index in ${(
        duration / 1000
      ).toFixed(2)}s`,
    });
  } catch (err: any) {
    console.error("=".repeat(50));
    console.error("[Pinecone Ping] ❌ Error occurred:");
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
