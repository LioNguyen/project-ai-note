/**
 * Script to sync all existing notes from database to Pinecone
 * Run: bun run scripts/sync-pinecone.ts
 */

import { notesIndex } from "../src/app/api/core/utils/db/pinecone";
import prisma from "../src/app/api/core/utils/db/prisma";
import { getEmbedding } from "../src/app/api/core/utils/openai";

async function syncNotesToPinecone() {
  console.log("🚀 Starting Pinecone sync...\n");

  try {
    // Fetch all notes from database
    console.log("📖 Fetching all notes from database...");
    const allNotes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${allNotes.length} notes\n`);

    if (allNotes.length === 0) {
      console.log("⚠️  No notes found in database. Nothing to sync.");
      return;
    }

    // Process notes in batches to avoid rate limits
    const BATCH_SIZE = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < allNotes.length; i += BATCH_SIZE) {
      const batch = allNotes.slice(i, i + BATCH_SIZE);
      console.log(
        `📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          allNotes.length / BATCH_SIZE,
        )} (${batch.length} notes)...`,
      );

      // Process batch in parallel
      const batchPromises = batch.map(async (note) => {
        try {
          // Generate embedding for note
          const noteText = note.title + "\n\n" + (note.content || "");
          const embedding = await getEmbedding(noteText);

          // Upsert to Pinecone
          await notesIndex.upsert([
            {
              id: note.id,
              values: embedding,
              metadata: {
                userId: note.userId,
              },
            },
          ]);

          console.log(`  ✓ Synced: "${note.title}" (ID: ${note.id})`);
          return { success: true, id: note.id };
        } catch (error) {
          console.error(`  ✗ Failed: "${note.title}" (ID: ${note.id})`, error);
          return { success: false, id: note.id };
        }
      });

      const results = await Promise.all(batchPromises);
      successCount += results.filter((r) => r.success).length;
      errorCount += results.filter((r) => !r.success).length;

      // Add delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < allNotes.length) {
        console.log("⏳ Waiting 2 seconds before next batch...\n");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 Sync Summary:");
    console.log(`  ✅ Successfully synced: ${successCount} notes`);
    console.log(`  ❌ Failed: ${errorCount} notes`);
    console.log(`  📝 Total processed: ${allNotes.length} notes`);
    console.log("=".repeat(50) + "\n");

    if (errorCount > 0) {
      console.log(
        "⚠️  Some notes failed to sync. Check the error messages above.",
      );
    } else {
      console.log("🎉 All notes successfully synced to Pinecone!");
    }
  } catch (error) {
    console.error("❌ Fatal error during sync:", error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await prisma.$disconnect();
    console.log("\n✨ Sync process completed.");
  }
}

// Run the sync
syncNotesToPinecone();
