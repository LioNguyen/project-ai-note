import { notesIndex } from "@/app/api/core/utils/db/pinecone";

/**
 * Service to ping Pinecone index and verify it's accessible
 * Fetches index statistics to confirm connectivity and health
 */
export async function pingPineconeIndex() {
  try {
    // Ping the index by fetching its statistics
    console.log("[Pinecone Ping] Fetching index statistics...");
    const indexStats = await notesIndex.describeIndexStats();

    console.log("[Pinecone Ping] Index stats retrieved successfully");
    console.log(
      `[Pinecone Ping] Total records: ${indexStats.totalRecordCount}`,
    );
    console.log(`[Pinecone Ping] Dimension: ${indexStats.dimension}`);

    return {
      success: true,
      stats: {
        totalVectorCount: indexStats.totalRecordCount,
        dimension: indexStats.dimension,
      },
    };
  } catch (error) {
    console.error("[Pinecone Ping] Error pinging Pinecone:", error);
    throw error;
  }
}
