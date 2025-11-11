"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Note as NoteType } from "@prisma/client";
import { FileText, Search } from "lucide-react";

import Note from "../Note/Note";
import NotesSearchControls from "../../molecules/NotesSearchControls/NotesSearchControls";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/(frontend)/core/components/atoms/Pagination/Pagination";
import { EmptyState } from "@/app/(frontend)/core/components/atoms/EmptyState/EmptyState";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = locales[locale];

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page), { scroll: true });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      {/* Search and Sort Controls */}
      <NotesSearchControls
        initialQuery={initialQuery}
        initialSort={initialSort}
        totalCount={totalCount}
      />

      {/* Notes Grid with fixed height and scroll */}
      <div className="scrollbar-clean max-h-[calc(100vh-250px)] overflow-y-auto">
        {notes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {notes.map((note) => (
              <Note note={note} key={note.id} />
            ))}
          </div>
        ) : initialQuery ? (
          <EmptyState
            icon={Search}
            title={t.notes.noNotes}
            description={t.notes.noSearchResults.replace(
              "{{query}}",
              initialQuery,
            )}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title={t.notes.noNotes}
            description={t.notes.noNotesDescription}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                onClick={(e) => {
                  if (currentPage <= 1) {
                    e.preventDefault();
                    return;
                  }
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={createPageUrl(page)}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  currentPage < totalPages
                    ? createPageUrl(currentPage + 1)
                    : "#"
                }
                onClick={(e) => {
                  if (currentPage >= totalPages) {
                    e.preventDefault();
                    return;
                  }
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
