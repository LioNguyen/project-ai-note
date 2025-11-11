"use client";

import {
  useLocale,
  useSetLocale,
} from "@/app/(frontend)/core/store/useLanguageStore";
import { cn } from "@/app/(frontend)/core/utils/utils";

/**
 * LanguageSwitcher component - Toggle between English and Vietnamese
 * Shows language code inside the toggle thumb
 */
export default function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();

  const isVietnamese = locale === "vi";

  const handleToggle = () => {
    setLocale(isVietnamese ? "en" : "vi");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isVietnamese}
      aria-label="Switch language"
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isVietnamese ? "bg-primary" : "bg-input",
      )}
    >
      {/* Background labels */}
      <span
        className={cn(
          "absolute left-1.5 text-[10px] font-medium transition-opacity",
          isVietnamese ? "opacity-0" : "text-muted-foreground opacity-70",
        )}
      >
        EN
      </span>
      <span
        className={cn(
          "absolute right-1.5 text-[10px] font-medium transition-opacity",
          isVietnamese ? "text-primary-foreground opacity-70" : "opacity-0",
        )}
      >
        VI
      </span>
      {/* Thumb with text */}
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-lg transition-transform",
          isVietnamese ? "translate-x-7" : "translate-x-0",
        )}
      >
        <span className="text-[10px] font-bold text-foreground">
          {isVietnamese ? "VI" : "EN"}
        </span>
      </span>
    </button>
  );
}
