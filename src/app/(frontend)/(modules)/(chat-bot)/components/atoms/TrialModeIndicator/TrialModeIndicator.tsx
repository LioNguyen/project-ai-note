"use client";

import { Bot } from "lucide-react";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

interface TrialModeIndicatorProps {
  hasReachedLimit: boolean;
  remainingChats: number;
}

/**
 * TrialModeIndicator Component
 * Displays trial mode status for users
 */
export default function TrialModeIndicator({
  hasReachedLimit,
  remainingChats,
}: TrialModeIndicatorProps) {
  const locale = useLocale();
  const t = locales[locale];

  return (
    <div className="mt-3 rounded-lg border border-primary/10 bg-gradient-to-r from-primary/5 to-transparent px-3 py-2 text-center text-xs text-muted-foreground">
      {hasReachedLimit ? (
        <div className="space-y-1">
          <p className="font-medium text-foreground">{t.chat.upgradeMessage}</p>
          <p className="text-xs">{t.chat.limitReached}</p>
        </div>
      ) : (
        <p>
          <span className="font-semibold text-primary">{remainingChats}</span>{" "}
          {t.chat.remainingChats}
        </p>
      )}
    </div>
  );
}
