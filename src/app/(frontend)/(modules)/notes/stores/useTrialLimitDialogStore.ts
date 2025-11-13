import { create } from "zustand";

interface TrialLimitDialogStore {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useTrialLimitDialogStore = create<TrialLimitDialogStore>(
  (set) => ({
    isOpen: false,
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
  }),
);
