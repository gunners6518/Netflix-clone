import { Header } from "./components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { RowSkeleton } from "./components/RowSkeleton";

export default function Loading() {
  return (
    <div className="App">
      <Header />
      {/* Banner Skeleton */}
      <div className="h-screen w-full bg-black">
        <div className="ml-8 pt-36">
          <Skeleton className="h-16 w-96 mb-4" />
          <Skeleton className="h-20 w-[45rem] max-w-[360px]" />
        </div>
      </div>
      {/* Row Skeletons */}
      {Array.from({ length: 7 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}

