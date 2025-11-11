import { create } from "zustand";

interface ChatBoxStore {
  isOpen: boolean;
  openChatBox: () => void;
  closeChatBox: () => void;
  toggleChatBox: () => void;
}

export const useChatBoxStore = create<ChatBoxStore>((set) => ({
  isOpen: false,
  openChatBox: () => set({ isOpen: true }),
  closeChatBox: () => set({ isOpen: false }),
  toggleChatBox: () => set((state) => ({ isOpen: !state.isOpen })),
}));
