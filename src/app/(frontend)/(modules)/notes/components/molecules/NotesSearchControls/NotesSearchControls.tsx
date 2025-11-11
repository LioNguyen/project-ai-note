"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import SearchBox from "@/app/(frontend)/core/components/molecules/SearchBox/SearchBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(frontend)/core/components/atoms/Select/Select";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";

type SortOption = "updated-desc" | "updated-asc" | "title-asc" | "title-desc";

interface NotesSearchControlsProps {
  initialQuery?: string;
  initialSort?: string;
  totalCount: number;
}

export default function NotesSearchControls({
  initialQuery = "",
  initialSort = "updated-desc",
  totalCount,
}: NotesSearchControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = locales[locale];

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

  // Format results count text
  const getResultsText = () => {
    if (totalCount === 0) return null;

    const plural = totalCount !== 1 ? "s" : "";
    if (initialQuery) {
      return t.notes.found
        .replace("{{count}}", totalCount.toString())
        .replace("{{plural}}", plural)
        .replace("{{query}}", initialQuery);
    }
    return t.notes.total
      .replace("{{count}}", totalCount.toString())
      .replace("{{plural}}", plural);
  };

  return (
    <div className="mb-4 space-y-2">
      {/* Results count + Search and Sort Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SearchBox
            value={initialQuery}
            onChange={handleSearch}
            placeholder={t.notes.searchPlaceholder}
            className="flex-1 sm:max-w-md"
            debounceMs={500}
          />
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {getResultsText()}
            </div>
          )}
        </div>

        <Select value={initialSort} onValueChange={handleSort}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t.notes.sortBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">
              {t.notes.sortUpdatedDesc}
            </SelectItem>
            <SelectItem value="updated-asc">
              {t.notes.sortUpdatedAsc}
            </SelectItem>
            <SelectItem value="title-asc">{t.notes.sortTitleAsc}</SelectItem>
            <SelectItem value="title-desc">{t.notes.sortTitleDesc}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
