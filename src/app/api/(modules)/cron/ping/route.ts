import { NextResponse } from "next/server";
import { config, isDevelopment } from "@/app/api/core/config";
import { pingPineconeIndex, pingMongoDB } from "./route.services";

// Use Node.js runtime for stable long-running tasks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ping endpoint for Pinecone and MongoDB health check
 * Runs automatically via GitHub Actions daily at 20:00 UTC
 * No authentication required - can be called directly for testing
 */
export async function GET(request: Request) {
  try {
    // --- Log execution info ---
    const environment = config.app.vercelEnv;
    const vercelUrl = config.vercel.url;
    const timestamp = new Date().toISOString();

    console.log("=".repeat(50));
    console.log("[Ping] Execution started at:", timestamp);
    console.log("[Ping] Environment:", environment);
    console.log("[Ping] URL:", vercelUrl);
    console.log("=".repeat(50));

    // --- Execute pings ---
    console.log("[Ping] Starting health checks...");
    const startTime = Date.now();

    // Ping both services in parallel
    const [pineconeResult, mongoResult] = await Promise.allSettled([
      pingPineconeIndex(),
      pingMongoDB(),
    ]);

    const duration = Date.now() - startTime;

    // Process results
    const pineconeSuccess = pineconeResult.status === "fulfilled";
    const mongoSuccess = mongoResult.status === "fulfilled";
    const overallSuccess = pineconeSuccess && mongoSuccess;

    console.log("=".repeat(50));
    console.log(
      `[Ping] ${overallSuccess ? "✅" : "⚠️"} Health check completed`,
    );
    console.log(`[Ping] Pinecone: ${pineconeSuccess ? "✅" : "❌"}`);
    console.log(`[Ping] MongoDB: ${mongoSuccess ? "✅" : "❌"}`);
    console.log(
      `[Ping] Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    console.log(`[Ping] Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      success: overallSuccess,
      pinecone: {
        success: pineconeSuccess,
        stats:
          pineconeResult.status === "fulfilled"
            ? pineconeResult.value.stats
            : undefined,
        error:
          pineconeResult.status === "rejected"
            ? pineconeResult.reason instanceof Error
              ? pineconeResult.reason.message
              : "Unknown error"
            : undefined,
      },
      mongodb: {
        success: mongoSuccess,
        stats:
          mongoResult.status === "fulfilled"
            ? mongoResult.value.stats
            : undefined,
        error:
          mongoResult.status === "rejected"
            ? mongoResult.reason instanceof Error
              ? mongoResult.reason.message
              : "Unknown error"
            : undefined,
      },
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      message: overallSuccess
        ? `Successfully pinged all services in ${(duration / 1000).toFixed(2)}s`
        : `Health check completed with errors in ${(duration / 1000).toFixed(
            2,
          )}s`,
    });
  } catch (err: any) {
    console.error("=".repeat(50));
    console.error("[Ping] ❌ Error occurred:");
    console.error(err);
    console.error("=".repeat(50));

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        stack: isDevelopment ? err?.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
