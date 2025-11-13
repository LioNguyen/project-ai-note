import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";

/**
 * ContentSkeleton Component
 * Loading skeleton for note content with multiple line placeholders
 */
export default function ContentSkeleton() {
  return (
    <div className="space-y-2 rounded-md border p-4">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/6" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
