import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === USERS (ADMIN) ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === CONTENT BLOCKS (For multilingual static text like Bio) ===
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'bio_en', 'bio_fr', 'hero_title_en'
  content: text("content").notNull(),
  section: text("section").notNull(), // 'home', 'about', 'contact'
});

// === ALBUMS ===
export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  coverImage: text("cover_image").notNull(),
  releaseDate: timestamp("release_date"),
  spotifyUrl: text("spotify_url"),
  appleMusicUrl: text("apple_music_url"),
  description: text("description"),
  hidden: boolean("hidden").default(false),
});

// === TRACKS ===
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").references(() => albums.id),
  title: text("title").notNull(),
  audioUrl: text("audio_url").notNull(),
  photoUrl: text("photo_url"),
  duration: text("duration"),
  isSingle: boolean("is_single").default(false),
  isFeatured: boolean("is_featured").default(false),
  hidden: boolean("hidden").default(false),
});

// === VIDEOS ===
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").default("music_video"),
  isFeatured: boolean("is_featured").default(false),
  hidden: boolean("hidden").default(false),
});

// === EVENTS (Tour / Concerts) ===
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  venue: text("venue"),
  ticketUrl: text("ticket_url"),
  type: text("type").default("concert"),
  hidden: boolean("hidden").default(false),
});

// === PRESS ===
export const press = pgTable("press", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  snippet: text("snippet"),
  date: timestamp("date"),
  hidden: boolean("hidden").default(false),
});

// === PHOTOS (Gallery) ===
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  category: text("category").default("concert"),
  displayOrder: integer("display_order").default(0),
  hidden: boolean("hidden").default(false),
});

// === MESSAGES (Contact) ===
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertContentBlockSchema = createInsertSchema(contentBlocks).omit({ id: true });
export const insertAlbumSchema = createInsertSchema(albums).omit({ id: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertPressSchema = createInsertSchema(press).omit({ id: true });
export const insertPhotoSchema = createInsertSchema(photos).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, read: true, createdAt: true });

// === TYPES ===
export type User = typeof users.$inferSelect;
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type Album = typeof albums.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Press = typeof press.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertPress = z.infer<typeof insertPressSchema>;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
