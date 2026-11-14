import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

export const isNeonConfigured = Boolean(databaseUrl && !databaseUrl.includes("endpoint-pooler.neon.tech"));

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!isNeonConfigured) {
    return null;
  }
  if (!dbInstance) {
    try {
      const sql = neon(databaseUrl!);
      dbInstance = drizzle(sql, { schema });
    } catch (err) {
      console.warn("Failed to initialize Neon client:", err);
      return null;
    }
  }
  return dbInstance;
}
