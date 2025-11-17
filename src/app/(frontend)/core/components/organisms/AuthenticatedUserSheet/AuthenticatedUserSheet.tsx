"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import BaseSheet from "@/app/(frontend)/core/components/molecules/BaseSheet/BaseSheet";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useUserMenuStore } from "@/app/(frontend)/core/store/useUserMenuStore";

/**
 * AuthenticatedUserSheet Component
 * Displays user profile and sign out option for authenticated users
 */
export default function AuthenticatedUserSheet() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const locale = useLocale(); // Keep for locale-specific conditional rendering
  const isOpen = useUserMenuStore((state) => state.isOpen);
  const closeMenu = useUserMenuStore((state) => state.closeMenu);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    closeMenu();
  };

  // Only render for authenticated users
  if (!session?.user) return null;

  return (
    <BaseSheet
      open={isOpen}
      onOpenChange={closeMenu}
      side="right"
      title={
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">{t("auth.loginTitle")}</span>
        </div>
      }
      className="sm:max-w-[400px]"
    >
      <div className="mt-6 space-y-6">
        {/* User Profile Card */}
        <div className="rounded-xl border bg-gradient-to-br from-background to-muted/20 p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-col items-center gap-3 text-center">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {session.user.image ? (
                <div className="relative">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={64}
                    height={64}
                    className="rounded-full ring-2 ring-primary/10"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                </div>
              ) : (
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 ring-2 ring-primary/10">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="w-full space-y-2">
              <h3 className="truncate text-lg font-semibold leading-none">
                {session.user.name || "User"}
              </h3>
              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <p className="truncate text-sm text-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {locale === "vi" ? "Hành động" : "Actions"}
          </div>

          {/* Sign Out Button */}
          <Button
            variant="destructive"
            className="w-full justify-start gap-2 shadow-sm transition-all hover:shadow-md"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">{t("auth.signOut")}</span>
          </Button>
        </div>

        {/* Footer Info */}
        <div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-foreground">
                {locale === "vi" ? "Mẹo hữu ích" : "Pro Tip"}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {locale === "vi"
                  ? "Bạn có thể sử dụng AI Chat để tìm kiếm và phân tích ghi chú của mình một cách thông minh."
                  : "Use AI Chat to intelligently search and analyze your notes."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseSheet>
  );
}
