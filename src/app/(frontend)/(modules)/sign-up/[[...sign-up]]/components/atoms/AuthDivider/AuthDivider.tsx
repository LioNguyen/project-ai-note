"use client";

import { useTranslation } from "react-i18next";

/**
 * AuthDivider Component
 * Displays 'Or continue with' divider for authentication forms
 */
export default function AuthDivider() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {t("auth.orContinueWith")}
        </span>
      </div>
    </div>
  );
}
