"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
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

export default function NavBar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const locale = useLocale();
  const openDialog = useNoteDialogStore((state) => state.openDialog);

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
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: { avatarBox: { width: "2rem", height: "2rem" } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
