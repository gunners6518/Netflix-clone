import { Skeleton } from "@/components/ui/skeleton";

export function RowSkeleton() {
  return (
    <div className="ml-5 text-white">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="flex overflow-y-hidden overflow-x-scroll p-5 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-40 flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

