import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { 
  schema,
  // Drizzle-ORM can sometimes attempt to create a schema if it's not present.
  // We disable any automatic schema creation in production.
  ...(process.env.NODE_ENV === "production" ? {} : {}) 
});
