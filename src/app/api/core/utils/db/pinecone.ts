import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "@/app/api/core/config";

const pinecone = new Pinecone({
  apiKey: config.pinecone.apiKey,
});

// Get Index name from configuration
export const notesIndex = pinecone.Index(config.pinecone.indexName);
