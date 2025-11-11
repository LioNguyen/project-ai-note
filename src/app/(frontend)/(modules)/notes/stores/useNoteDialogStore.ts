import { Note } from "@prisma/client";
import { create } from "zustand";

interface NoteDialogState {
  isOpen: boolean;
  noteToEdit: Note | undefined;
  openDialog: (note?: Note) => void;
  closeDialog: () => void;
}

/**
 * Zustand store for managing AddEditNoteDialog state globally
 * This allows any component to open/close the dialog and pass a note for editing
 */
export const useNoteDialogStore = create<NoteDialogState>((set) => ({
  isOpen: false,
  noteToEdit: undefined,
  openDialog: (note) => set({ isOpen: true, noteToEdit: note }),
  closeDialog: () => set({ isOpen: false, noteToEdit: undefined }),
}));
