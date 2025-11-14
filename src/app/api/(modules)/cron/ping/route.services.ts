import { notesIndex } from "@/app/api/core/utils/db/pinecone";
import prisma from "@/app/api/core/utils/db/prisma";

/**
 * Service to ping Pinecone index and verify it's accessible
 * Fetches index statistics to confirm connectivity and health
 */
export async function pingPineconeIndex() {
  try {
    // Ping the index by fetching its statistics
    console.log("[Ping] Fetching Pinecone index statistics...");
    const indexStats = await notesIndex.describeIndexStats();

    console.log("[Ping] Pinecone index stats retrieved successfully");
    console.log(`[Ping] Total records: ${indexStats.totalRecordCount}`);
    console.log(`[Ping] Dimension: ${indexStats.dimension}`);

    return {
      success: true,
      stats: {
        totalVectorCount: indexStats.totalRecordCount,
        dimension: indexStats.dimension,
      },
    };
  } catch (error) {
    console.error("[Ping] Error pinging Pinecone:", error);
    throw error;
  }
}

/**
 * Service to ping MongoDB (via Prisma) and verify it's accessible
 * Performs a simple database query to confirm connectivity
 */
export async function pingMongoDB() {
  try {
    console.log("[Ping] Pinging MongoDB via Prisma...");

    // Execute a simple query to verify database connection
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();

    console.log("[Ping] MongoDB connection verified successfully");
    console.log(`[Ping] User count: ${userCount}`);
    console.log(`[Ping] Note count: ${noteCount}`);

    return {
      success: true,
      stats: {
        userCount,
        noteCount,
      },
    };
  } catch (error) {
    console.error("[Ping] Error pinging MongoDB:", error);
    throw error;
  }
}
