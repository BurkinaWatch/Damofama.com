import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});
export const db = drizzle(pool, { 
  schema,
  // Drizzle-ORM can sometimes attempt to create a schema if it's not present.
  // We disable any automatic schema creation in production.
  ...(process.env.NODE_ENV === "production" ? {} : {}) 
});

// Safe table initialization for Railway
export async function initDatabase() {
  try {
    // Only create tables if they don't exist. We avoid CREATE SCHEMA.
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS content_blocks (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        section TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        release_date TIMESTAMP,
        spotify_url TEXT,
        apple_music_url TEXT,
        description TEXT,
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS tracks (
        id SERIAL PRIMARY KEY,
        album_id INTEGER REFERENCES albums(id),
        title TEXT NOT NULL,
        audio_url TEXT NOT NULL,
        photo_url TEXT,
        duration TEXT,
        is_single BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        youtube_url TEXT NOT NULL,
        thumbnail_url TEXT,
        category TEXT DEFAULT 'music_video',
        is_featured BOOLEAN DEFAULT FALSE,
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        location TEXT NOT NULL,
        venue TEXT,
        ticket_url TEXT,
        type TEXT DEFAULT 'concert',
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS press (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        url TEXT NOT NULL,
        snippet TEXT,
        date TIMESTAMP,
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'concert',
        display_order INTEGER DEFAULT 0,
        hidden BOOLEAN DEFAULT FALSE
      );
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Database tables verified/created successfully.");
  } catch (error) {
    console.error("Database initialization warning:", error instanceof Error ? error.message : String(error));
    // We don't throw here to allow the server to start even if DB is partially unavailable
  }
}
