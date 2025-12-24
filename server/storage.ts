import { db } from "./db";
import {
  users, contentBlocks, albums, tracks, videos, events, press, photos, messages,
  type User, type InsertUser, type ContentBlock, type InsertContentBlock,
  type Album, type InsertAlbum, type Track, type InsertTrack,
  type Video, type InsertVideo, type Event, type InsertEvent,
  type Press, type InsertPress, type Photo, type InsertPhoto,
  type Message, type InsertMessage
} from "@shared/schema";
import { eq, desc, asc } from "drizzle-orm";

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
  updateAlbum(id: number, album: InsertAlbum): Promise<Album>;
  deleteAlbum(id: number): Promise<void>;
  getTracks(): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  updateTrack(id: number, track: InsertTrack): Promise<Track>;
  deleteTrack(id: number): Promise<void>;

  // Videos
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: InsertVideo): Promise<Video>;
  deleteVideo(id: number): Promise<void>;

  // Events
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Press
  getPress(): Promise<Press[]>;
  createPress(item: InsertPress): Promise<Press>;
  updatePress(id: number, item: InsertPress): Promise<Press>;
  deletePress(id: number): Promise<void>;

  // Photos
  getPhotos(): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;

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

  async updateAlbum(id: number, album: InsertAlbum): Promise<Album> {
    const [updated] = await db.update(albums).set(album).where(eq(albums.id, id)).returning();
    return updated;
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

  async updateTrack(id: number, track: InsertTrack): Promise<Track> {
    const [updated] = await db.update(tracks).set(track).where(eq(tracks.id, id)).returning();
    return updated;
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

  async updateVideo(id: number, video: InsertVideo): Promise<Video> {
    const [updated] = await db.update(videos).set(video).where(eq(videos.id, id)).returning();
    return updated;
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

  async updateEvent(id: number, event: InsertEvent): Promise<Event> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
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

  async updatePress(id: number, item: InsertPress): Promise<Press> {
    const [updated] = await db.update(press).set(item).where(eq(press.id, id)).returning();
    return updated;
  }

  async deletePress(id: number): Promise<void> {
    await db.delete(press).where(eq(press.id, id));
  }

  async getPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(asc(photos.displayOrder));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(id: number, photo: InsertPhoto): Promise<Photo> {
    const [updated] = await db.update(photos).set(photo).where(eq(photos.id, id)).returning();
    return updated;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
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
