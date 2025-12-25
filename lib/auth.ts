import { cookies } from "next/headers";
import { db } from "./db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "user-id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user || null;
}

export async function setCurrentUser(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearCurrentUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// 開発用: デフォルトユーザーを作成・取得
export async function getOrCreateDefaultUser() {
  const existingUser = await getCurrentUser();
  if (existingUser) {
    return existingUser;
  }

  // 既存のデフォルトユーザーをチェック
  const defaultUserId = "default-user";
  const existingDefaultUser = await db.query.users.findFirst({
    where: eq(users.id, defaultUserId),
  });

  if (existingDefaultUser) {
    await setCurrentUser(existingDefaultUser.id);
    return existingDefaultUser;
  }

  // デフォルトユーザーを作成
  try {
    const defaultUser = await db
      .insert(users)
      .values({
        id: defaultUserId,
        email: "user@example.com",
        name: "Default User",
      })
      .returning();

    if (defaultUser[0]) {
      await setCurrentUser(defaultUser[0].id);
      return defaultUser[0];
    }
  } catch (error) {
    // 既に存在する場合は取得
    const user = await db.query.users.findFirst({
      where: eq(users.id, defaultUserId),
    });
    if (user) {
      await setCurrentUser(user.id);
      return user;
    }
  }

  return null;
}

