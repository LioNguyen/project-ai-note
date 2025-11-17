/**
 * Trial Limit Dialog Component
 *
 * Displays when trial users reach the 5-note limit.
 * Encourages users to sign up for unlimited access.
 * Controlled by useTrialLimitDialogStore
 */

"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import BaseDialog from "@/app/(frontend)/core/components/molecules/BaseDialog/BaseDialog";
import { useTranslation } from "react-i18next";
import { trackTrialLimitReached } from "@/app/(frontend)/core/utils/analytics";
import { useTrialLimitDialogStore } from "../../../stores/useTrialLimitDialogStore";

export default function TrialLimitDialog() {
  const { t } = useTranslation();
  const isOpen = useTrialLimitDialogStore((state) => state.isOpen);
  const closeDialog = useTrialLimitDialogStore((state) => state.closeDialog);

  // Track when trial limit dialog is shown
  useEffect(() => {
    if (isOpen) {
      trackTrialLimitReached("notes");
    }
  }, [isOpen]);

  const title = (
    <div className="flex items-center gap-2 text-xl">
      <Sparkles className="text-primary" />
      {t("trial.limitReachedTitle")}
    </div>
  );

  return (
    <BaseDialog
      open={isOpen}
      onOpenChange={closeDialog}
      title={title}
      description={t("trial.limitReachedDescription")}
      className="sm:max-w-md"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={closeDialog}
            className="w-full sm:w-auto"
          >
            {t("trial.maybeLater")}
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/sign-up" onClick={closeDialog}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("trial.signUpFree")}
            </Link>
          </Button>
        </>
      }
    >
      <div className="my-4 space-y-3 rounded-lg bg-primary/10 p-4">
        <h4 className="font-semibold">{t("trial.premiumFeatures")}</h4>
        <ul className="space-y-2 text-sm">
          <li>✅ {t("trial.benefitUnlimitedNotes")}</li>
          <li>✅ {t("trial.benefitUnlimitedChat")}</li>
          <li>✅ {t("trial.benefitAiSearch")}</li>
          <li>✅ {t("trial.benefitSecure")}</li>
        </ul>
      </div>
    </BaseDialog>
  );
}
