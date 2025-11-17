"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "./config";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18nProvider Component
 * Wraps the application with i18next provider and syncs with language store
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const locale = useLocale();

  // Sync i18next with the language store on mount and locale change
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
