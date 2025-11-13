"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import BaseSheet from "@/app/(frontend)/core/components/molecules/BaseSheet/BaseSheet";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useUserMenuStore } from "@/app/(frontend)/core/store/useUserMenuStore";

/**
 * TrialUserSheet Component
 * Displays trial mode benefits and sign up/in options for non-authenticated users
 */
export default function TrialUserSheet() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = locales[locale];
  const isOpen = useUserMenuStore((state) => state.isOpen);
  const closeMenu = useUserMenuStore((state) => state.closeMenu);

  // Only render for trial (non-authenticated) users
  if (session?.user) return null;

  return (
    <BaseSheet
      open={isOpen}
      onOpenChange={closeMenu}
      side="right"
      title={t.navbar.appName}
    >
      <div className="mt-6 space-y-6">
        {/* Trial Mode Badge */}
        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <div className="mb-2 text-2xl">🎯</div>
          <p className="mb-1 font-semibold text-primary">{t.trial.trialMode}</p>
          <p className="text-sm text-muted-foreground">
            {t.trial.unlockUnlimited}
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <p className="text-sm font-medium">{t.trial.benefits}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>{t.trial.benefitUnlimitedNotes}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>{t.trial.benefitUnlimitedChat}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>{t.trial.benefitPermanentStorage}</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            asChild
            className="w-full"
            size="lg"
            onClick={() => closeMenu()}
          >
            <Link href="/sign-up">{t.auth.signUp}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            onClick={() => closeMenu()}
          >
            <Link href="/sign-in">{t.auth.signIn}</Link>
          </Button>
        </div>
      </div>
    </BaseSheet>
  );
}
