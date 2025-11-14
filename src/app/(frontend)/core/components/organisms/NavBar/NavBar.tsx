"use client";

import { useSession } from "next-auth/react";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import LanguageSwitcher from "@/app/(frontend)/core/components/molecules/LanguageSwitcher/LanguageSwitcher";
import ThemeToggleButton from "@/app/(frontend)/core/components/molecules/ThemeToggleButton/ThemeToggleButton";
import { locales } from "@/app/(frontend)/core/i18n";
import { useNoteDialogStore } from "@/app/(frontend)/(modules)/notes/stores/useNoteDialogStore";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useUserMenuStore } from "@/app/(frontend)/core/store/useUserMenuStore";
import logo from "@/app/shared/assets/logo.png";

/**
 * Navigation Bar Component
 * Displays app navigation with user profile and actions
 */
export default function NavBar() {
  const pathname = usePathname();
  const locale = useLocale();
  const openDialog = useNoteDialogStore((state) => state.openDialog);
  const openUserMenu = useUserMenuStore((state) => state.openMenu);
  const { data: session } = useSession();

  // Get translations for current locale
  const t = locales[locale];

  const handleAddNote = () => {
    if (pathname?.startsWith("/notes")) {
      openDialog();
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-background p-4 shadow">
      <div className="m-auto mx-2 flex max-w-full flex-wrap items-center justify-between gap-3">
        <Link href="/notes" className="flex items-center gap-1">
          <Image src={logo} alt="AI Note logo" width={35} height={35} />
          <span className="ml-1 font-bold">{t.navbar.appName}</span>
        </Link>
        <div className="flex items-center gap-3">
          {pathname?.startsWith("/notes") && (
            <Button onClick={handleAddNote} size="sm" className="h-8 px-2.5">
              <Plus size={14} className="mr-1" />
              <span className="text-xs">{t.navbar.addNote}</span>
            </Button>
          )}
          <LanguageSwitcher />
          <ThemeToggleButton />

          {/* User Menu Trigger - Opens sheet via Zustand */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={openUserMenu}
          >
            {session?.user ? (
              // Authenticated User Avatar
              session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )
            ) : (
              // Trial Mode Avatar
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
