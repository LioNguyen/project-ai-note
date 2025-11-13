/**
 * Trial Mode Store
 *
 * Manages trial mode state across the application.
 * Tracks note count, limits, and provides methods to interact with trial notes.
 */

import { create } from "zustand";
import {
  createTrialNote,
  deleteTrialNote,
  getRemainingTrialNotes,
  getTrialNotes,
  hasReachedTrialLimit,
  TRIAL_NOTE_LIMIT,
  TRIAL_CHAT_LIMIT,
  TrialNote,
  updateTrialNote,
  getTrialChatCount,
  incrementTrialChatCount,
  hasReachedChatLimit,
  getRemainingChatCount,
} from "@/app/(frontend)/core/utils/trialMode";

interface TrialModeState {
  // State - Notes
  notes: TrialNote[];
  isTrialMode: boolean;
  noteCount: number;
  remainingNotes: number;
  hasReachedLimit: boolean;

  // State - Chat
  chatCount: number;
  remainingChats: number;
  hasReachedChatLimit: boolean;

  // Actions - Notes
  loadNotes: () => void;
  createNote: (title: string, content: string) => TrialNote | null;
  updateNote: (id: string, title: string, content: string) => TrialNote | null;
  deleteNote: (id: string) => boolean;
  refreshStats: () => void;
  setTrialMode: (isTrialMode: boolean) => void;

  // Actions - Chat
  incrementChat: () => number | null;
  refreshChatStats: () => void;
}

/**
 * Zustand store for trial mode management
 */
export const useTrialModeStore = create<TrialModeState>((set, get) => ({
  // Initial state - Notes
  notes: [],
  isTrialMode: false,
  noteCount: 0,
  remainingNotes: TRIAL_NOTE_LIMIT,
  hasReachedLimit: false,

  // Initial state - Chat
  chatCount: 0,
  remainingChats: TRIAL_CHAT_LIMIT,
  hasReachedChatLimit: false,

  /**
   * Load notes from localStorage
   */
  loadNotes: () => {
    const notes = getTrialNotes();
    set({
      notes,
      noteCount: notes.length,
      remainingNotes: getRemainingTrialNotes(),
      hasReachedLimit: hasReachedTrialLimit(),
    });
  },

  /**
   * Create a new trial note
   */
  createNote: (title: string, content: string) => {
    const newNote = createTrialNote(title, content);

    if (newNote) {
      get().loadNotes(); // Refresh state after creation
    }

    return newNote;
  },

  /**
   * Update an existing trial note
   */
  updateNote: (id: string, title: string, content: string) => {
    const updatedNote = updateTrialNote(id, title, content);

    if (updatedNote) {
      get().loadNotes(); // Refresh state after update
    }

    return updatedNote;
  },

  /**
   * Delete a trial note
   */
  deleteNote: (id: string) => {
    const success = deleteTrialNote(id);

    if (success) {
      get().loadNotes(); // Refresh state after deletion
    }

    return success;
  },

  /**
   * Refresh trial mode statistics
   */
  refreshStats: () => {
    set({
      noteCount: getTrialNotes().length,
      remainingNotes: getRemainingTrialNotes(),
      hasReachedLimit: hasReachedTrialLimit(),
    });
  },

  /**
   * Set trial mode status
   */
  setTrialMode: (isTrialMode: boolean) => {
    set({ isTrialMode });

    if (isTrialMode) {
      get().loadNotes();
      get().refreshChatStats();
    }
  },

  /**
   * Increment chat count and return new count (or null if limit reached)
   */
  incrementChat: () => {
    const newCount = incrementTrialChatCount();

    if (newCount !== null) {
      get().refreshChatStats();
    }

    return newCount;
  },

  /**
   * Refresh chat statistics
   */
  refreshChatStats: () => {
    set({
      chatCount: getTrialChatCount(),
      remainingChats: getRemainingChatCount(),
      hasReachedChatLimit: hasReachedChatLimit(),
    });
  },
}));
