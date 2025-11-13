"use client";

import { signOut, useSession } from "next-auth/react";
import { Plus, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import LanguageSwitcher from "@/app/(frontend)/core/components/molecules/LanguageSwitcher/LanguageSwitcher";
import ThemeToggleButton from "@/app/(frontend)/core/components/molecules/ThemeToggleButton/ThemeToggleButton";
import { locales } from "@/app/(frontend)/core/i18n";
import { useNoteDialogStore } from "@/app/(frontend)/(modules)/notes/stores/useNoteDialogStore";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import logo from "@/app/shared/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(frontend)/core/components/atoms/Sheet/Sheet";

/**
 * Navigation Bar Component
 * Displays app navigation with user profile and actions
 */
export default function NavBar() {
  const pathname = usePathname();
  const locale = useLocale();
  const openDialog = useNoteDialogStore((state) => state.openDialog);
  const { data: session } = useSession();

  // Get translations for current locale
  const t = locales[locale];

  const handleAddNote = () => {
    if (pathname?.startsWith("/notes")) {
      openDialog();
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-background p-4 shadow">
      <div className="m-auto mx-2 flex max-w-full flex-wrap items-center justify-between gap-3">
        <Link href="/notes" className="flex items-center gap-1">
          <Image src={logo} alt="AI Note logo" width={40} height={40} />
          <span className="font-bold">{t.navbar.appName}</span>
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

          {/* User Profile Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Account</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
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
                  <div>
                    <p className="font-medium">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
