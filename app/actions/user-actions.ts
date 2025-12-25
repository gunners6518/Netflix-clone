"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { myList } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "@/lib/dal/user";

if (!db) {
  console.warn("Database is not configured. My list features will not work.");
}

export async function addToMyList(movieId: string) {
  // 認証チェック（DALパターン）
  const user = await requireAuth();

  if (!db) {
    throw new Error("Database is not configured");
  }

  // 既にマイリストに追加されているかチェック
  const existingItem = await db.query.myList.findFirst({
    where: and(
      eq(myList.userId, user.id),
      eq(myList.movieId, movieId)
    ),
  });

  if (existingItem) {
    return { success: true, message: "Already in my list" };
  }

  // マイリストに追加
  await db.insert(myList).values({
    id: `${user.id}-${movieId}`,
    userId: user.id,
    movieId: movieId,
  });

  // キャッシュを更新
  revalidatePath("/");
  revalidatePath(`/movie/${movieId}`);

  return { success: true, message: "Added to my list" };
}

export async function removeFromMyList(movieId: string) {
  // 認証チェック（DALパターン）
  const user = await requireAuth();

  if (!db) {
    throw new Error("Database is not configured");
  }

  // マイリストから削除
  await db
    .delete(myList)
    .where(
      and(
        eq(myList.userId, user.id),
        eq(myList.movieId, movieId)
      )
    );

  // キャッシュを更新
  revalidatePath("/");
  revalidatePath(`/movie/${movieId}`);

  return { success: true, message: "Removed from my list" };
}

export async function toggleMyList(movieId: string) {
  // 認証チェック（DALパターン）
  const user = await requireAuth();

  // 既にマイリストに追加されているかチェック
  const existingItem = await db.query.myList.findFirst({
    where: and(
      eq(myList.userId, user.id),
      eq(myList.movieId, movieId)
    ),
  });

  if (existingItem) {
    await removeFromMyList(movieId);
    return { success: true, isInList: false };
  } else {
    await addToMyList(movieId);
    return { success: true, isInList: true };
  }
}

export async function isInMyList(movieId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !db) {
    return false;
  }

  const existingItem = await db.query.myList.findFirst({
    where: and(
      eq(myList.userId, user.id),
      eq(myList.movieId, movieId)
    ),
  });

  return !!existingItem;
}

