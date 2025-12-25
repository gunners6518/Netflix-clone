import { verifySession } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  if (!db) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  // ユーザーが存在しない場合は作成
  if (!user) {
    const newUser = await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
      })
      .returning();

    return newUser[0] || null;
  }

  return user;
}

export async function requireAuth() {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
}

