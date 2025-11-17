"use client";

import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * ChatHeader Component
 * Displays the header section of the chat with branding and status indicator
 */
export default function ChatHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between rounded-t-2xl border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent px-4 py-4">
      <div className="flex items-center gap-2.5">
        {/* AI Icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>

        {/* Header Text */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-foreground">
            {t("chat.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("chat.aiAssistant")}
          </p>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
    </div>
  );
}
