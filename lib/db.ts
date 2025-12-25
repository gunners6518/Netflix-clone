import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

let db: ReturnType<typeof drizzle> | null = null;

if (process.env.SUPABASE_DATABASE_URL) {
  const connectionString = process.env.SUPABASE_DATABASE_URL;
  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
}

export { db };

