import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const isLocalDb =
  databaseUrl.includes("127.0.0.1") || databaseUrl.includes("localhost");

const globalForDb = globalThis as typeof globalThis & {
  __bfixPool?: Pool;
};

export const pool =
  globalForDb.__bfixPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__bfixPool = pool;
}

export const db = drizzle(pool, { schema });
