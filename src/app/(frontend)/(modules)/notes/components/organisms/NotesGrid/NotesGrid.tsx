"use client";

import { Note as NoteType } from "@prisma/client";
import { FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";
import DataGrid from "@/app/(frontend)/core/components/organisms/DataGrid/DataGrid";
import Note from "../../molecules/Note/Note";
import NoteCardSkeleton from "../../molecules/NoteCardSkeleton/NoteCardSkeleton";

interface NotesGridProps {
  notes: NoteType[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  initialQuery: string;
  initialSort: string;
}

export default function NotesGrid({
  notes,
  currentPage,
  totalPages,
  totalCount,
  initialQuery,
  initialSort,
}: NotesGridProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const sortOptions = [
    { value: "updated-desc", label: t("notes.sortUpdatedDesc") },
    { value: "updated-asc", label: t("notes.sortUpdatedAsc") },
    { value: "title-asc", label: t("notes.sortTitleAsc") },
    { value: "title-desc", label: t("notes.sortTitleDesc") },
  ];

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render skeleton on server to prevent hydration mismatch
  if (!isMounted) {
    return (
      <>
        {/* Search and Sort Controls Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-full flex-1 sm:max-w-md" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-full sm:w-[200px]" />
          </div>
        </div>

        {/* Notes Grid Skeleton */}
        <div className="scrollbar-clean max-h-[calc(100vh-250px)] overflow-y-auto">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: notes.length || 12 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <DataGrid
      items={notes}
      renderItem={(note) => <Note note={note} />}
      getItemKey={(note) => note.id}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      initialQuery={initialQuery}
      initialSort={initialSort}
      sortOptions={sortOptions}
      searchPlaceholder={t("notes.searchPlaceholder")}
      sortByLabel={t("notes.sortBy")}
      emptyIcon={FileText}
      emptyTitle={t("notes.noNotes")}
      emptyDescription={t("notes.noNotesDescription")}
      noResultsIcon={Search}
      noResultsTitle={t("notes.noNotes")}
      noResultsDescription={t("notes.noSearchResults")}
      resultsText={{
        singular: t("notes.total"),
        plural: t("notes.total"),
        withQuery: t("notes.found"),
      }}
      gridClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      containerClassName="max-h-[calc(100vh-250px)]"
    />
  );
}
