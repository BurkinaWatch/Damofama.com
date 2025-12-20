import { db } from "./db";
import {
  users, contentBlocks, albums, tracks, videos, events, press, messages,
  type User, type InsertUser, type ContentBlock, type InsertContentBlock,
  type Album, type InsertAlbum, type Track, type InsertTrack,
  type Video, type InsertVideo, type Event, type InsertEvent,
  type Press, type InsertPress, type Message, type InsertMessage
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Content Blocks
  getContentBlocks(): Promise<ContentBlock[]>;
  updateContentBlock(block: InsertContentBlock): Promise<ContentBlock>;

  // Albums & Tracks
  getAlbums(): Promise<Album[]>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  deleteAlbum(id: number): Promise<void>;
  getTracks(): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  deleteTrack(id: number): Promise<void>;

  // Videos
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  deleteVideo(id: number): Promise<void>;

  // Events
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Press
  getPress(): Promise<Press[]>;
  createPress(item: InsertPress): Promise<Press>;
  deletePress(id: number): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getContentBlocks(): Promise<ContentBlock[]> {
    return await db.select().from(contentBlocks);
  }

  async updateContentBlock(block: InsertContentBlock): Promise<ContentBlock> {
    // Upsert based on key
    const [updated] = await db
      .insert(contentBlocks)
      .values(block)
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { content: block.content },
      })
      .returning();
    return updated;
  }

  async getAlbums(): Promise<Album[]> {
    return await db.select().from(albums).orderBy(desc(albums.releaseDate));
  }

  async createAlbum(album: InsertAlbum): Promise<Album> {
    const [newAlbum] = await db.insert(albums).values(album).returning();
    return newAlbum;
  }

  async deleteAlbum(id: number): Promise<void> {
    await db.delete(albums).where(eq(albums.id, id));
  }

  async getTracks(): Promise<Track[]> {
    return await db.select().from(tracks);
  }

  async createTrack(track: InsertTrack): Promise<Track> {
    const [newTrack] = await db.insert(tracks).values(track).returning();
    return newTrack;
  }

  async deleteTrack(id: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.id));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getPress(): Promise<Press[]> {
    return await db.select().from(press).orderBy(desc(press.date));
  }

  async createPress(item: InsertPress): Promise<Press> {
    const [newPress] = await db.insert(press).values(item).returning();
    return newPress;
  }

  async deletePress(id: number): Promise<void> {
    await db.delete(press).where(eq(press.id, id));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }
}

export const storage = new DatabaseStorage();
