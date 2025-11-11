import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SupportedLocale } from "@/app/(frontend)/core/i18n";

interface LanguageState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

/**
 * Zustand store for managing application language state
 * Persists language preference to localStorage
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "language-storage", // localStorage key
    },
  ),
);

// Selector hooks for optimized re-renders
export const useLocale = () => useLanguageStore((state) => state.locale);
export const useSetLocale = () => useLanguageStore((state) => state.setLocale);
