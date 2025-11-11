import NoteCardSkeleton from "./components/molecules/NoteCardSkeleton/NoteCardSkeleton";
import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";

export default function NotesLoading() {
  return (
    <>
      {/* Search and Sort Controls Skeleton */}
      <div className="mb-6 space-y-4">
        {/* Results count */}
        <Skeleton className="h-5 w-24" />

        {/* Search and Sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>
      </div>

      {/* Notes Grid Skeleton */}
      <div className="scrollbar-clean max-h-[calc(100vh-250px)] overflow-y-auto">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-80" />
      </div>
    </>
  );
}
