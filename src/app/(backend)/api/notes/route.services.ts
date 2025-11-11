import { notesIndex } from "@/app/(backend)/api/core/utils/db/pinecone";
import prisma from "@/app/(backend)/api/core/utils/db/prisma";
import { getEmbeddingForNote } from "@/app/(backend)/api/core/utils/embedding";

import {
  CreateNoteRequest,
  CreateNoteResponse,
  GetNotesResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from "./route.types";

/**
 * Fetch all notes for a specific user
 * Ordered by creation date (newest first)
 */
export async function getAllNotes(userId: string): Promise<GetNotesResponse> {
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notes;
}

/**
 * Create a new note with Pinecone embedding
 * Handles both database creation and vector indexing
 */
export async function createNote(
  userId: string,
  data: CreateNoteRequest,
): Promise<CreateNoteResponse> {
  const { title, content } = data;

  const embedding = await getEmbeddingForNote(title, content);

  const note = await prisma.$transaction(async (tx) => {
    const note = await tx.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    // Try to update Pinecone, but don't fail if it errors
    try {
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
    } catch (pineconeError) {
      console.error("Pinecone upsert failed:", pineconeError);
      // Continue anyway - note is still created in database
    }

    return note;
  });

  return { note };
}

/**
 * Update an existing note with new content
 * Updates both database and Pinecone vector index
 */
export async function updateNote(
  userId: string,
  data: UpdateNoteRequest,
): Promise<UpdateNoteResponse> {
  const { id, title, content } = data;

  // Verify note exists
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    throw new Error("Note not found");
  }

  // Verify ownership
  if (userId !== note.userId) {
    throw new Error("Unauthorized");
  }

  const embedding = await getEmbeddingForNote(title, content);

  const updatedNote = await prisma.$transaction(async (tx) => {
    const updatedNote = await tx.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    // Try to update Pinecone, but don't fail if it errors
    try {
      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
    } catch (pineconeError) {
      console.error("Pinecone upsert failed:", pineconeError);
      // Continue anyway - note is still updated in database
    }

    return updatedNote;
  });

  return { updatedNote };
}
