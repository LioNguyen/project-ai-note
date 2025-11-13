import { Note } from "@prisma/client";

/**
 * Request body type for creating a new note
 */
export interface CreateNoteRequest {
  title: string;
  content?: string;
}

/**
 * Request body type for updating an existing note
 */
export interface UpdateNoteRequest {
  id: string;
  title: string;
  content?: string;
}

/**
 * Response type for successful note creation
 */
export interface CreateNoteResponse {
  note: Note;
}

/**
 * Response type for successful note update
 */
export interface UpdateNoteResponse {
  updatedNote: Note;
}

/**
 * Response type for fetching all notes
 */
export type GetNotesResponse = Note[];
