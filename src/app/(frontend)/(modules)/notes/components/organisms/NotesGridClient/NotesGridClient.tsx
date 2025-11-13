/**
 * Notes Grid Client Component
 *
 * Client-side notes grid for trial mode users.
 * Loads notes from localStorage and handles filtering/sorting locally.
 */

"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Search } from "lucide-react";

import Note from "../../molecules/Note/Note";
import DataGrid from "@/app/(frontend)/core/components/organisms/DataGrid/DataGrid";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import { convertTrialNoteToNote } from "@/app/(frontend)/core/utils/trialMode";
import { Note as NoteType } from "@prisma/client";

interface NotesGridClientProps {
  initialQuery: string;
  initialSort: string;
}

export default function NotesGridClient({
  initialQuery,
  initialSort,
}: NotesGridClientProps) {
  const locale = useLocale();
  const t = locales[locale];
  const searchParams = useSearchParams();
  const { notes: trialNotes, loadNotes, setTrialMode } = useTrialModeStore();

  // Get current query and sort from URL params
  const query = searchParams.get("query") || initialQuery;
  const sortBy = searchParams.get("sortBy") || initialSort;

  // Initialize trial mode and load notes
  useEffect(() => {
    setTrialMode(true);
    loadNotes();
  }, [setTrialMode, loadNotes]);

  // Re-load notes when they change (e.g., after adding/editing)
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Convert trial notes to Note type
  const notes: NoteType[] = useMemo(
    () => trialNotes.map(convertTrialNoteToNote),
    [trialNotes],
  );

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;

    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content?.toLowerCase().includes(lowerQuery),
    );
  }, [notes, query]);

  // Sort filtered notes
  const sortedNotes = useMemo(() => {
    const sorted = [...filteredNotes];

    switch (sortBy) {
      case "updated-desc":
        return sorted.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        );
      case "updated-asc":
        return sorted.sort(
          (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
        );
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [filteredNotes, sortBy]);

  const sortOptions = [
    { value: "updated-desc", label: t.notes.sortUpdatedDesc },
    { value: "updated-asc", label: t.notes.sortUpdatedAsc },
    { value: "title-asc", label: t.notes.sortTitleAsc },
    { value: "title-desc", label: t.notes.sortTitleDesc },
  ];

  // For trial mode, we don't have pagination - show all notes
  return (
    <DataGrid
      items={sortedNotes}
      renderItem={(note) => <Note note={note} />}
      getItemKey={(note) => note.id}
      currentPage={1}
      totalPages={1}
      totalCount={sortedNotes.length}
      initialQuery={query}
      initialSort={sortBy}
      sortOptions={sortOptions}
      searchPlaceholder={t.notes.searchPlaceholder}
      sortByLabel={t.notes.sortBy}
      emptyIcon={FileText}
      emptyTitle={t.notes.noNotes}
      emptyDescription={t.notes.noNotesDescription}
      noResultsIcon={Search}
      noResultsTitle={t.notes.noNotes}
      noResultsDescription={t.notes.noSearchResults}
      resultsText={{
        singular: t.notes.total,
        plural: t.notes.total,
        withQuery: t.notes.found,
      }}
      gridClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      containerClassName="max-h-[calc(100vh-250px)]"
    />
  );
}
