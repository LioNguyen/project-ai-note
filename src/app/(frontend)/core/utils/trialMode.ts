/**
 * Trial Mode Utilities
 *
 * Manages trial mode functionality for unauthenticated users.
 * Trial users can create up to 5 notes stored in localStorage.
 */

import { Note } from "@prisma/client";

// Maximum number of notes allowed in trial mode
export const TRIAL_NOTE_LIMIT = 5;

// Maximum number of chat requests allowed in trial mode
export const TRIAL_CHAT_LIMIT = 10;

// localStorage key for trial notes
const TRIAL_NOTES_KEY = "trial-notes";

// localStorage key for trial chat count
const TRIAL_CHAT_COUNT_KEY = "trial-chat-count";

/**
 * Trial note type - similar to Prisma Note but with local storage structure
 */
export interface TrialNote {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Check if user is in trial mode (not authenticated)
 * This should be called from client components
 */
export function isTrialMode(): boolean {
  if (typeof window === "undefined") return false;
  // If no session/auth token exists, user is in trial mode
  // This will be enhanced with proper session check
  return true;
}

/**
 * Get all trial notes from localStorage
 */
export function getTrialNotes(): TrialNote[] {
  if (typeof window === "undefined") return [];

  try {
    const notesJson = localStorage.getItem(TRIAL_NOTES_KEY);
    if (!notesJson) return [];

    const notes = JSON.parse(notesJson) as TrialNote[];
    return notes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch (error) {
    console.error("Error reading trial notes:", error);
    return [];
  }
}

/**
 * Save trial notes to localStorage
 */
function saveTrialNotes(notes: TrialNote[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TRIAL_NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving trial notes:", error);
  }
}

/**
 * Create a new trial note
 * Returns the created note or null if limit reached
 * NOTE: Embedding to Pinecone is done on backend via API
 */
export function createTrialNote(
  title: string,
  content: string,
): TrialNote | null {
  const notes = getTrialNotes();

  // Check if limit is reached
  if (notes.length >= TRIAL_NOTE_LIMIT) {
    return null;
  }

  const newNote: TrialNote = {
    id: `trial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(newNote);
  saveTrialNotes(notes);

  // Trigger backend sync to Pinecone (fire and forget)
  syncTrialNoteToPinecone(newNote).catch((err) =>
    console.error("Failed to sync to Pinecone:", err),
  );

  return newNote;
}

/**
 * Sync trial note to Pinecone for semantic search
 */
async function syncTrialNoteToPinecone(note: TrialNote): Promise<void> {
  try {
    await fetch("/api/trial/sync-pinecone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
  } catch (error) {
    console.error("Pinecone sync failed:", error);
    // Don't throw - note is still saved locally
  }
}

/**
 * Update an existing trial note
 * Also updates embedding in Pinecone
 */
export function updateTrialNote(
  id: string,
  title: string,
  content: string,
): TrialNote | null {
  const notes = getTrialNotes();
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) return null;

  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
    updatedAt: new Date().toISOString(),
  };

  saveTrialNotes(notes);

  // Update in Pinecone (fire and forget)
  syncTrialNoteToPinecone(notes[noteIndex]).catch((err) =>
    console.error("Failed to update Pinecone:", err),
  );

  return notes[noteIndex];
}

/**
 * Delete a trial note
 * Also removes from Pinecone
 */
export function deleteTrialNote(id: string): boolean {
  const notes = getTrialNotes();
  const filteredNotes = notes.filter((n) => n.id !== id);

  if (filteredNotes.length === notes.length) return false;

  saveTrialNotes(filteredNotes);

  // Remove from Pinecone (fire and forget)
  fetch(`/api/trial/sync-pinecone/${id}`, { method: "DELETE" }).catch((err) =>
    console.error("Failed to delete from Pinecone:", err),
  );

  return true;
}

/**
 * Get a single trial note by ID
 */
export function getTrialNoteById(id: string): TrialNote | null {
  const notes = getTrialNotes();
  return notes.find((n) => n.id === id) || null;
}

/**
 * Check if trial user has reached the note limit
 */
export function hasReachedTrialLimit(): boolean {
  const notes = getTrialNotes();
  return notes.length >= TRIAL_NOTE_LIMIT;
}

/**
 * Get remaining notes count in trial mode
 */
export function getRemainingTrialNotes(): number {
  const notes = getTrialNotes();
  return Math.max(0, TRIAL_NOTE_LIMIT - notes.length);
}

/**
 * Clear all trial notes (useful when user signs up)
 */
export function clearTrialNotes(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TRIAL_NOTES_KEY);
}

/**
 * Convert trial notes to format compatible with Note type for UI
 */
export function convertTrialNoteToNote(trialNote: TrialNote): Note {
  return {
    id: trialNote.id,
    title: trialNote.title,
    content: trialNote.content,
    createdAt: new Date(trialNote.createdAt),
    updatedAt: new Date(trialNote.updatedAt),
    userId: "trial-user",
  };
}

/**
 * Get trial chat count from localStorage
 */
export function getTrialChatCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const count = localStorage.getItem(TRIAL_CHAT_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error("Error reading trial chat count:", error);
    return 0;
  }
}

/**
 * Increment trial chat count
 * Returns the new count or null if limit reached
 */
export function incrementTrialChatCount(): number | null {
  const currentCount = getTrialChatCount();

  // Check if limit is reached
  if (currentCount >= TRIAL_CHAT_LIMIT) {
    return null;
  }

  const newCount = currentCount + 1;

  try {
    localStorage.setItem(TRIAL_CHAT_COUNT_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error("Error saving trial chat count:", error);
    return null;
  }
}

/**
 * Check if trial user has reached the chat limit
 */
export function hasReachedChatLimit(): boolean {
  return getTrialChatCount() >= TRIAL_CHAT_LIMIT;
}

/**
 * Get remaining chat count in trial mode
 */
export function getRemainingChatCount(): number {
  return Math.max(0, TRIAL_CHAT_LIMIT - getTrialChatCount());
}

/**
 * Clear trial chat count (useful when user signs up)
 */
export function clearTrialChatCount(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TRIAL_CHAT_COUNT_KEY);
}

/**
 * Clear all trial data and sync with backend
 * Called after user signs in/signs up
 */
export async function clearAllTrialData(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // Get all trial note IDs before clearing
    const notes = getTrialNotes();
    const noteIds = notes.map((note) => note.id);

    // Clear from Pinecone via API
    if (noteIds.length > 0) {
      await fetch("/api/trial/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteIds }),
      });
    }

    // Clear from localStorage
    clearTrialNotes();
    clearTrialChatCount();

    console.log(
      `[Trial Clear] Cleared ${noteIds.length} notes and chat history`,
    );
  } catch (error) {
    console.error("[Trial Clear] Error clearing trial data:", error);
    // Still clear localStorage even if API fails
    clearTrialNotes();
    clearTrialChatCount();
  }
}
