/**
 * Cleanup Trial Notes Cron Job
 *
 * This endpoint removes trial notes from Pinecone that are older than 7 days.
 * Should be called by a cron service (e.g., Vercel Cron, GitHub Actions).
 * No authentication required - can be called directly for testing.
 */

import { NextRequest, NextResponse } from "next/server";
import { config, isDevelopment } from "@/app/api/core/config";
import { executeCleanup, dryRunCleanup } from "./route.services";

// Use Node.js runtime for stable long-running tasks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/cron/cleanup
 *
 * Removes trial notes older than 7 days from Pinecone
 */
export async function POST(req: NextRequest) {
  try {
    // --- Log execution info ---
    const environment = config.app.vercelEnv;
    const timestamp = new Date().toISOString();

    console.log("=".repeat(50));
    console.log("[Cleanup] Execution started at:", timestamp);
    console.log("[Cleanup] Environment:", environment);
    console.log("=".repeat(50));

    // --- Execute cleanup ---
    const startTime = Date.now();
    const result = await executeCleanup(7);
    const duration = Date.now() - startTime;

    console.log("=".repeat(50));
    console.log(`[Cleanup] ✅ Cleanup completed`);
    console.log(`[Cleanup] Deleted: ${result.deleted} notes`);
    console.log(
      `[Cleanup] Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    console.log(`[Cleanup] Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      ...result,
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=".repeat(50));
    console.error("[Cleanup] ❌ Error occurred:");
    console.error(error);
    console.error("=".repeat(50));

    return NextResponse.json(
      {
        error: "Failed to cleanup trial notes",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          isDevelopment && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/cron/cleanup
 *
 * Returns information about trial notes that would be cleaned up (dry run)
 */
export async function GET(req: NextRequest) {
  try {
    // --- Log execution info ---
    const environment = config.app.vercelEnv;
    const timestamp = new Date().toISOString();

    console.log("=".repeat(50));
    console.log("[Cleanup] Dry run started at:", timestamp);
    console.log("[Cleanup] Environment:", environment);
    console.log("=".repeat(50));

    // --- Execute dry run ---
    const startTime = Date.now();
    const result = await dryRunCleanup(7);
    const duration = Date.now() - startTime;

    console.log("=".repeat(50));
    console.log(`[Cleanup] ✅ Dry run completed`);
    console.log(`[Cleanup] Would delete: ${result.stats.oldNotes} notes`);
    console.log(
      `[Cleanup] Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    console.log(`[Cleanup] Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      ...result,
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=".repeat(50));
    console.error("[Cleanup] ❌ Error occurred:");
    console.error(error);
    console.error("=".repeat(50));

    return NextResponse.json(
      {
        error: "Failed to check trial notes",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          isDevelopment && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
