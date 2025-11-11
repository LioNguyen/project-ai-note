import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  createNoteSchema,
  updateNoteSchema,
} from "@/app/(backend)/api/core/utils/validation/note";

import { createNote, getAllNotes, updateNote } from "./route.services";

/**
 * GET /api/notes
 * Fetch all notes for the authenticated user
 */
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("You are not authenticated", { status: 401 });
    }

    const data = await getAllNotes(userId);

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

/**
 * POST /api/notes
 * Create a new note for the authenticated user
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await createNote(userId, { title, content });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/notes
 * Update an existing note for the authenticated user
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const result = await updateNote(userId, { id, title, content });
      return Response.json(result, { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Note not found") {
          return Response.json({ error: "Note not found" }, { status: 404 });
        }
        if (error.message === "Unauthorized") {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
