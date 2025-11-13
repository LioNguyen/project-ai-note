"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import BaseSheet from "@/app/(frontend)/core/components/molecules/BaseSheet/BaseSheet";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useUserMenuStore } from "@/app/(frontend)/core/store/useUserMenuStore";

/**
 * AuthenticatedUserSheet Component
 * Displays user profile and sign out option for authenticated users
 */
export default function AuthenticatedUserSheet() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = locales[locale];
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
      title={t.auth.loginTitle}
    >
      <div className="mt-6 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-lg border p-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">
              {session.user.name || "User"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t.auth.signOut}
        </Button>
      </div>
    </BaseSheet>
  );
}
