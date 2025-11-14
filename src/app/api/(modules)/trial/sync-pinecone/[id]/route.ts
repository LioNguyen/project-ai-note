import { NextResponse } from "next/server";
import { notesIndex } from "@/app/api/core/utils/db/pinecone";

/**
 * DELETE /api/trial/sync-pinecone/[id]
 * Remove trial note from Pinecone
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Note ID required" }, { status: 400 });
    }

    // Delete from Pinecone
    await notesIndex.deleteOne(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pinecone delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete from Pinecone" },
      { status: 500 },
    );
  }
}
