import { create } from "zustand";

/**
 * Store for managing delete confirmation dialog state
 */
interface DeleteConfirmStore {
  isOpen: boolean;
  noteId: string | null;
  noteTitle: string | null;
  onConfirm: (() => Promise<void>) | null;
  openDialog: (
    noteId: string,
    noteTitle: string,
    onConfirm: () => Promise<void>,
  ) => void;
  closeDialog: () => void;
  reset: () => void;
}

export const useDeleteConfirmStore = create<DeleteConfirmStore>((set) => ({
  isOpen: false,
  noteId: null,
  noteTitle: null,
  onConfirm: null,
  openDialog: (noteId, noteTitle, onConfirm) =>
    set({ isOpen: true, noteId, noteTitle, onConfirm }),
  closeDialog: () => set({ isOpen: false }),
  reset: () =>
    set({ isOpen: false, noteId: null, noteTitle: null, onConfirm: null }),
}));
