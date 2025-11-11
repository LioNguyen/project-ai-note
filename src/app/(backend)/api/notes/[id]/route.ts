import { auth } from "@clerk/nextjs/server";

import { notesIndex } from "@/app/(backend)/api/core/utils/db/pinecone";
import prisma from "@/app/(backend)/api/core/utils/db/prisma";
import { deleteNoteSchema } from "@/app/(backend)/api/core/utils/validation/note";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params as required in Next.js 16
    const resolvedParams = await params;
    const parseResult = deleteNoteSchema.safeParse(resolvedParams);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = await auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
