"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

import SearchBox from "@/app/(frontend)/core/components/molecules/SearchBox/SearchBox";
import SortSelect, {
  SortOption,
} from "@/app/(frontend)/core/components/molecules/SortSelect";
import DataGridPagination from "@/app/(frontend)/core/components/molecules/DataGridPagination";
import { EmptyState } from "@/app/(frontend)/core/components/atoms/EmptyState/EmptyState";

export interface DataGridProps<T> {
  // Data
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;

  // Search & Sort
  initialQuery?: string;
  initialSort?: string;
  sortOptions: SortOption[];
  searchPlaceholder: string;

  // Empty States
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  noResultsIcon?: LucideIcon;
  noResultsTitle?: string;
  noResultsDescription?: string;

  // Translations
  sortByLabel: string;
  resultsText?: {
    singular: string; // "{{count}} result"
    plural: string; // "{{count}} results"
    withQuery: string; // "{{count}} result{{plural}} for '{{query}}'"
  };

  // Layout
  gridClassName?: string;
  containerClassName?: string;
}

export default function DataGrid<T>({
  items,
  renderItem,
  getItemKey,
  currentPage,
  totalPages,
  totalCount,
  initialQuery = "",
  initialSort = "",
  sortOptions,
  searchPlaceholder,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  noResultsIcon,
  noResultsTitle,
  noResultsDescription,
  sortByLabel,
  resultsText,
  gridClassName = "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
  containerClassName = "max-h-[calc(100vh-250px)]",
}: DataGridProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Reset to page 1 when search or sort changes
      if (name !== "page") {
        params.delete("page");
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = useCallback(
    (query: string) => {
      const queryString = createQueryString("query", query);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  const handleSort = useCallback(
    (sortBy: string) => {
      const queryString = createQueryString("sortBy", sortBy);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page), { scroll: true });
  };

  // Format results count text
  const getResultsText = () => {
    if (!resultsText || totalCount === 0) return null;

    const plural = totalCount !== 1 ? "s" : "";
    if (initialQuery) {
      return resultsText.withQuery
        .replace("{{count}}", totalCount.toString())
        .replace("{{plural}}", plural)
        .replace("{{query}}", initialQuery);
    }

    const template =
      totalCount === 1 ? resultsText.singular : resultsText.plural;
    return template
      .replace("{{count}}", totalCount.toString())
      .replace("{{plural}}", plural);
  };

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="mb-4 space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <SearchBox
              value={initialQuery}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="flex-1 sm:max-w-md"
              debounceMs={500}
            />
            {totalCount > 0 && resultsText && (
              <div className="text-sm text-muted-foreground">
                {getResultsText()}
              </div>
            )}
          </div>

          <SortSelect
            value={initialSort}
            sortOptions={sortOptions}
            label={sortByLabel}
            onChange={handleSort}
          />
        </div>
      </div>

      {/* Grid with fixed height and scroll */}
      <div className={`scrollbar-clean overflow-y-auto ${containerClassName}`}>
        {items.length > 0 ? (
          <div className={gridClassName}>
            {items.map((item) => (
              <div key={getItemKey(item)}>{renderItem(item)}</div>
            ))}
          </div>
        ) : initialQuery ? (
          <EmptyState
            icon={noResultsIcon || emptyIcon}
            title={noResultsTitle || emptyTitle}
            description={
              noResultsDescription?.replace("{{query}}", initialQuery) ||
              emptyDescription
            }
          />
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        )}
      </div>

      {/* Pagination */}
      <DataGridPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        createPageUrl={createPageUrl}
      />
    </>
  );
}
