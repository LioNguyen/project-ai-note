import { create } from "zustand";

interface UserMenuStore {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useUserMenuStore = create<UserMenuStore>((set) => ({
  isOpen: false,
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
}));
