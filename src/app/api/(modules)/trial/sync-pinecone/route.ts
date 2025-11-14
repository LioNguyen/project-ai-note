import { NextResponse } from "next/server";
import { notesIndex } from "@/app/api/core/utils/db/pinecone";
import { getEmbeddingForNote } from "@/app/api/core/utils/embedding";

/**
 * POST /api/trial/sync-pinecone
 * Sync trial notes to Pinecone for semantic search
 * Allows trial users to benefit from vector search without authentication
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { note } = body;

    if (!note || !note.id || !note.title) {
      return NextResponse.json({ error: "Invalid note data" }, { status: 400 });
    }

    // Generate embedding for the note
    const embedding = await getEmbeddingForNote(note.title, note.content || "");

    // Upsert to Pinecone with special "trial-user" userId
    await notesIndex.upsert([
      {
        id: note.id,
        values: embedding,
        metadata: {
          userId: "trial-user", // Special identifier for trial notes
          title: note.title,
          createdAt: note.createdAt,
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pinecone sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync to Pinecone" },
      { status: 500 },
    );
  }
}
