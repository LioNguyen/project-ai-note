import { Trans } from "react-i18next";
import en from "./locale/en/default";
import vi from "./locale/vi/default";

// Re-export for backward compatibility
export const locales = {
  en,
  vi,
} as const;

// Translation key type
export type TranslationKey = string;

// Type for supported locales
export type SupportedLocale = keyof typeof locales;

// Translation utility
export function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
    template,
  );
}

// Pluralization helper
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

// RTL language detection
export function isRTLLanguage(locale: string): boolean {
  const rtlLanguages = ["ar", "he", "fa", "ur", "yi"];
  return rtlLanguages.includes(locale.split("-")[0]);
}

// Number formatting with locale
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

// Date formatting with locale
export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// Type for all translation keys (using string values instead of literal types)
export type TranslationKeys = Record<string, unknown>;

// Get locale data
export function getLocaleData(
  locale: SupportedLocale,
): Record<string, unknown> {
  return locales[locale] || locales.en;
}

// Export i18n instance for direct access
export { default as i18n } from "./config";

// Export I18nProvider
export { I18nProvider } from "./I18nProvider";

// Export Trans component for JSX translations
export { Trans };

export default locales;
