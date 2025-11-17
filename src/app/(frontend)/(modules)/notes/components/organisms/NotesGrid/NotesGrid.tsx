"use client";

import { Note as NoteType } from "@prisma/client";
import { FileText, Search } from "lucide-react";

import Note from "../../molecules/Note/Note";
import DataGrid from "@/app/(frontend)/core/components/organisms/DataGrid/DataGrid";
import { useTranslation } from "react-i18next";

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

  const sortOptions = [
    { value: "updated-desc", label: t("notes.sortUpdatedDesc") },
    { value: "updated-asc", label: t("notes.sortUpdatedAsc") },
    { value: "title-asc", label: t("notes.sortTitleAsc") },
    { value: "title-desc", label: t("notes.sortTitleDesc") },
  ];

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
