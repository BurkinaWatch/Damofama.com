import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication first
  setupAuth(app);

  // === PUBLIC API ===

  app.get(api.content.list.path, async (req, res) => {
    const content = await storage.getContentBlocks();
    res.json(content);
  });

  app.get(api.albums.list.path, async (req, res) => {
    const albums = await storage.getAlbums();
    res.json(albums);
  });

  app.get(api.tracks.list.path, async (req, res) => {
    const tracks = await storage.getTracks();
    res.json(tracks);
  });

  app.get(api.videos.list.path, async (req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });

  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.press.list.path, async (req, res) => {
    const press = await storage.getPress();
    res.json(press);
  });

  app.post(api.contact.send.path, async (req, res) => {
    const input = api.contact.send.input.parse(req.body);
    const message = await storage.createMessage(input);
    res.status(201).json(message);
  });

  // === PROTECTED ADMIN API ===

  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  app.post(api.content.update.path, requireAuth, async (req, res) => {
    const input = api.content.update.input.parse(req.body);
    const updated = await storage.updateContentBlock(input);
    res.json(updated);
  });

  app.post(api.albums.create.path, requireAuth, async (req, res) => {
    const input = api.albums.create.input.parse(req.body);
    const album = await storage.createAlbum(input);
    res.status(201).json(album);
  });

  app.delete(api.albums.delete.path, requireAuth, async (req, res) => {
    await storage.deleteAlbum(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.tracks.create.path, requireAuth, async (req, res) => {
    const input = api.tracks.create.input.parse(req.body);
    const track = await storage.createTrack(input);
    res.status(201).json(track);
  });

  app.delete(api.tracks.delete.path, requireAuth, async (req, res) => {
    await storage.deleteTrack(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.videos.create.path, requireAuth, async (req, res) => {
    const input = api.videos.create.input.parse(req.body);
    const video = await storage.createVideo(input);
    res.status(201).json(video);
  });

  app.delete(api.videos.delete.path, requireAuth, async (req, res) => {
    await storage.deleteVideo(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.events.create.path, requireAuth, async (req, res) => {
    const input = api.events.create.input.extend({
      date: z.coerce.date(),
    }).parse(req.body);
    const event = await storage.createEvent(input);
    res.status(201).json(event);
  });

  app.delete(api.events.delete.path, requireAuth, async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.press.create.path, requireAuth, async (req, res) => {
    const input = api.press.create.input.extend({
      date: z.coerce.date(),
    }).parse(req.body);
    const item = await storage.createPress(input);
    res.status(201).json(item);
  });

  app.delete(api.press.delete.path, requireAuth, async (req, res) => {
    await storage.deletePress(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.contact.list.path, requireAuth, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getAlbums();
  if (existing.length === 0) {
    const album = await storage.createAlbum({
      title: "ECHOES OF ANCESTORS",
      coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=3000&auto=format&fit=crop",
      releaseDate: new Date("2024-01-01"),
      description: "A journey through time and sound, blending traditional rhythms with modern synths.",
    });

    await storage.createTrack({
      albumId: album.id,
      title: "Midnight in Dakar",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder
      duration: "3:45",
    });

    await storage.createTrack({
      albumId: album.id,
      title: "Desert Winds",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "4:12",
    });

    await storage.createVideo({
      title: "Midnight in Dakar (Official Video)",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=3000&auto=format&fit=crop",
      category: "music_video",
      isFeatured: true,
    });

    await storage.createEvent({
      title: "Afro Nation Festival",
      date: new Date("2024-06-15"),
      location: "Portimão, Portugal",
      type: "festival",
      ticketUrl: "#",
    });

    await storage.createPress({
      title: "Damo Fama redefines the genre",
      source: "Rolling Stone",
      url: "#",
      date: new Date("2024-02-10"),
      snippet: "An electrifying debut that bridges continents and eras...",
    });

    // Seed Admin
    const admin = await storage.getUserByUsername("admin");
    if (!admin) {
      // In a real app, hash this password!
      await storage.createUser({
        username: "admin",
        password: "password123", // Default admin password
        role: "admin",
      });
    }
  }
}
