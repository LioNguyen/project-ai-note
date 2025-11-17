/**
 * Trial Mode Banner Component
 *
 * Displays trial status information and encourages users to sign up.
 * Shows remaining notes count and provides a link to sign up page.
 */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Card } from "@/app/(frontend)/core/components/atoms/Card/Card";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import {
  TRIAL_NOTE_LIMIT,
  TRIAL_CHAT_LIMIT,
} from "@/app/(frontend)/core/utils/trialMode";
import { useTranslation } from "react-i18next";

export default function TrialModeBanner() {
  const { t } = useTranslation();
  const {
    isTrialMode,
    remainingNotes,
    remainingChats,
    hasReachedLimit,
    hasReachedChatLimit,
    loadNotes,
    refreshChatStats,
  } = useTrialModeStore();

  // Load notes and chat stats on mount
  useEffect(() => {
    loadNotes();
    refreshChatStats();
  }, [loadNotes, refreshChatStats]);

  // Don't show banner if not in trial mode
  if (!isTrialMode) return null;

  return (
    <Card
      className={`mb-6 p-4 ${
        hasReachedLimit || hasReachedChatLimit
          ? "border-destructive bg-destructive/10"
          : "border-primary bg-primary/10"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🎯 {t("trial.trialMode")}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span>
              {hasReachedLimit ? (
                <span className="font-medium text-destructive">
                  {t("trial.noteLimitReached")}
                </span>
              ) : (
                <>
                  📝 {remainingNotes} / {TRIAL_NOTE_LIMIT}{" "}
                  {t("trial.notesRemaining")}
                </>
              )}
            </span>
            <span>
              {hasReachedChatLimit ? (
                <span className="font-medium text-destructive">
                  {t("trial.chatLimitReached")}
                </span>
              ) : (
                <>
                  💬 {remainingChats} / {TRIAL_CHAT_LIMIT}{" "}
                  {t("trial.chatsRemaining")}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t("trial.signUpForUnlimited")}
          </span>
          <Button
            asChild
            size="sm"
            variant={
              hasReachedLimit || hasReachedChatLimit ? "destructive" : "default"
            }
          >
            <Link href="/sign-up">{t("trial.signUp")}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
