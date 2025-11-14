"use client";

import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { useNoteDialogStore } from "@/app/(frontend)/(modules)/notes/stores/useNoteDialogStore";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { locales } from "@/app/(frontend)/core/i18n";

/**
 * Add Note Button Component
 *
 * A molecule component that displays a button to add new notes.
 * Only visible on the notes page and triggers the note dialog.
 *
 * @example
 * ```tsx
 * <AddNoteButton />
 * ```
 */
export default function AddNoteButton() {
  const pathname = usePathname();
  const locale = useLocale();
  const openDialog = useNoteDialogStore((state) => state.openDialog);

  // Get translations for current locale
  const t = locales[locale];

  // Only show on notes page
  if (!pathname?.startsWith("/notes")) {
    return null;
  }

  const handleAddNote = () => {
    openDialog();
  };

  return (
    <Button onClick={handleAddNote} size="sm" className="h-8 px-2.5">
      <Plus size={14} className="mr-1" />
      <span className="text-xs">{t.navbar.addNote}</span>
    </Button>
  );
}
