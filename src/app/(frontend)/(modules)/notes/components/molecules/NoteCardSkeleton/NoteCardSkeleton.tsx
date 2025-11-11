import {
  Card,
  CardContent,
  CardHeader,
} from "@/app/(frontend)/core/components/atoms/Card/Card";
import { Skeleton } from "@/app/(frontend)/core/components/atoms/Skeleton/Skeleton";

export default function NoteCardSkeleton() {
  return (
    <Card className="flex h-[280px] cursor-default flex-col">
      <CardHeader className="flex-shrink-0">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
