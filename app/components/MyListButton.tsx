"use client";

import { useOptimistic, startTransition } from "react";
import { Heart } from "lucide-react";
import { toggleMyList } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MyListButtonProps = {
  movieId: string;
  initialIsInList: boolean;
};

export function MyListButton({
  movieId,
  initialIsInList,
}: MyListButtonProps) {
  const [optimisticState, addOptimistic] = useOptimistic(
    initialIsInList,
    (currentState, optimisticValue: boolean) => optimisticValue
  );

  const handleClick = () => {
    startTransition(async () => {
      // 楽観的更新: サーバーレスポンスを待たずにUIを更新
      addOptimistic(!optimisticState);

      try {
        await toggleMyList(movieId);
      } catch (error) {
        // エラーが発生した場合は元の状態に戻す
        addOptimistic(optimisticState);
        console.error("Failed to toggle my list:", error);
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full",
        optimisticState
          ? "text-netflix-red hover:text-netflix-red"
          : "text-white hover:text-netflix-red"
      )}
      aria-label={optimisticState ? "Remove from my list" : "Add to my list"}
    >
      <Heart
        className={cn(
          "h-6 w-6 transition-all",
          optimisticState ? "fill-current" : "fill-none"
        )}
      />
    </Button>
  );
}

