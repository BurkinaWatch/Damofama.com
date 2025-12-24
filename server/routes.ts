import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { randomUUID } from "crypto";

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
    try {
      const input = api.albums.create.input.parse(req.body);
      const album = await storage.createAlbum(input);
      res.status(201).json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      throw error;
    }
  });

  app.patch(api.albums.update.path, requireAuth, async (req, res) => {
    const input = api.albums.update.input.parse(req.body);
    const album = await storage.updateAlbum(Number(req.params.id), input);
    res.json(album);
  });

  app.delete(api.albums.delete.path, requireAuth, async (req, res) => {
    await storage.deleteAlbum(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.tracks.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.tracks.create.input.parse(req.body);
      const track = await storage.createTrack(input);
      res.status(201).json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      throw error;
    }
  });

  app.patch(api.tracks.update.path, requireAuth, async (req, res) => {
    const input = api.tracks.update.input.parse(req.body);
    const track = await storage.updateTrack(Number(req.params.id), input);
    res.json(track);
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

  app.patch(api.videos.update.path, requireAuth, async (req, res) => {
    const input = api.videos.update.input.parse(req.body);
    const video = await storage.updateVideo(Number(req.params.id), input);
    res.json(video);
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

  app.patch(api.events.update.path, requireAuth, async (req, res) => {
    const input = api.events.update.input.extend({
      date: z.coerce.date(),
    }).parse(req.body);
    const event = await storage.updateEvent(Number(req.params.id), input);
    res.json(event);
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

  app.patch(api.press.update.path, requireAuth, async (req, res) => {
    const input = api.press.update.input.extend({
      date: z.coerce.date(),
    }).parse(req.body);
    const item = await storage.updatePress(Number(req.params.id), input);
    res.json(item);
  });

  app.delete(api.press.delete.path, requireAuth, async (req, res) => {
    await storage.deletePress(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.contact.list.path, requireAuth, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  // Upload URL endpoint (local storage)
  app.post("/api/uploads/request-url", requireAuth, async (req, res) => {
    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      const fileId = randomUUID();
      // Construct absolute URL for Uppy's upload plugin
      // Always use the current request's host/protocol for correct CORS and accessibility
      const protocol = req.protocol || 'https';
      const host = req.get('host') || 'localhost:5000';
      const uploadURL = `${protocol}://${host}/api/uploads/${fileId}`;
      const objectPath = `/uploads/${fileId}`;

      res.json({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Handle OPTIONS requests for CORS preflight
  app.options("/api/uploads/:fileId", (req, res) => {
    const origin = req.get('origin') || "*";
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "3600");
    res.sendStatus(204);
  });

  // Handle file uploads to presigned URL
  app.put("/api/uploads/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const fs = await import("fs");
      const path = await import("path");

      // Set CORS headers for file uploads
      const origin = req.get('origin') || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");

      // Store in public/uploads directory
      const uploadsDir = path.default.join(process.cwd(), "public", "uploads");

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.default.join(uploadsDir, fileId);

      // Pipe request directly to file
      const writeStream = fs.createWriteStream(filePath);

      req.pipe(writeStream);

      writeStream.on("finish", () => {
        res.status(200).json({
          success: true,
          objectPath: `/uploads/${fileId}`,
          fileId,
        });
      });

      writeStream.on("error", (error: any) => {
        console.error("Error writing file:", error);
        res.status(500).json({ error: "Failed to save file" });
      });

      req.on("error", (error: any) => {
        console.error("Error receiving file:", error);
        writeStream.destroy();
        res.status(500).json({ error: "Failed to receive file" });
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "Failed to process upload" });
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getAlbums();
  if (existing.length === 0) {
    // Add bio content
    await storage.updateContentBlock({
      key: "bio_fr",
      content: "La voix de l’artiste s’habille de l’instant, du présent et de l’antan.\n\nAdama DIABATÉ, autrement DAMO FAMA, africain d’origine Burkinabè et surtout citoyen du monde, est un artiste-musicien, auteur-compositeur, instrumentiste, interprète, une lyre noire à la conséquente profondeur.\n\nTombant de l’arbre d’une famille où la musique a toujours fait ses quartiers en forgeant l’identité depuis des générations, il n’eut le choix que d’être digne de ces gènes artistiques. Ainsi, en 2006, il s’y lance en amateur pour véritablement embrasser ensuite une carrière professionnelle à partir de 2010. Bravant difficultés et incertitudes, il se fera sa voix, ses doigts à la guitare à travers apprentissages, écoutes, formations et expériences en groupe, pour se constituer une voix qui se distingue parmi mille, une voix qui rassure. Ainsi avec son groupe KILÉ, trois albums sortirent. Ceux-ci convainquirent du talent flamboyant dont il fait montre.\n\nPorteur d’une musique qui ruisselle de ses convictions et cousue aux fils de l’espoir, de l’amour, de la vie dans ses compartiments heureux et gris, DAMO ne peut être qu’un artiste arc-en-ciel ancrée dans sa tradition dans le rythmes et le dire mais avec le regard rivé vers le monde. La musique AFRO-FUSION qui y accouche épouse une cause, un besoin, un devoir : celui de tenir par la main les cœurs. Du reste, Géographe de formation, son art est une boussole qui s’arrange à ce que les cœurs ne se perdent pas. En terre fertile, un arbre produit nécessairement des fruits. DAMO offre aux grâces des oreilles un E.P de 4 titres intitulé \"SISSAN\" en 2021 puis le single \"TOUNGANATA\" en 2024.",
      section: "about",
    });

    await storage.updateContentBlock({
      key: "bio_en",
      content: "The artist's voice is dressed in the moment, the present, and the past.\n\nAdama DIABATÉ, also known as DAMO FAMA, a Burkinabè African and above all a citizen of the world, is a musician, songwriter, instrumentalist, and performer—a black lyre of significant depth.\n\nBorn into a family where music has always been a way of life, forging identity for generations, he had no choice but to be worthy of these artistic genes. Thus, in 2006, he began as an amateur before truly embracing a professional career in 2010. Braving difficulties and uncertainties, he developed his voice and guitar skills through learning, listening, training, and group experiences, creating a voice that stands out among a thousand—a voice that reassures. With his group KILÉ, three albums were released, proving his flamboyant talent.\n\nBearer of a music that flows from his convictions and is sewn with the threads of hope, love, and life in its happy and gray moments, DAMO is a rainbow artist rooted in his tradition through rhythms and storytelling, but with his eyes fixed on the world. The AFRO-FUSION music he creates serves a cause, a need, a duty: to hold hearts by the hand. Moreover, as a geographer by training, his art is a compass that ensures hearts do not lose their way. In fertile soil, a tree necessarily produces fruit. DAMO offers an EP of 4 tracks entitled \"SISSAN\" in 2021, followed by the single \"TOUNGANATA\" in 2024.",
      section: "about",
    });

    const sissanEP = await storage.createAlbum({
      title: "SISSAN",
      coverImage: "/images/LS2C6652_1766230961644.jpg",
      releaseDate: new Date("2021-01-01"),
      description: "SISSAN (Maintenant en Dioula) - E.P de 4 titres dont :\n\n-Ma raison : L'amour fait marcher le cœur et maintient en vie. Cette chanson traite de l'amour à l'endroit d'une femme et le bonheur qui en découle.\n\n-Elle : La mère est le socle du fils et de la fille. Elle forge et forme la vie. La chanter, la célébrer, c'est saluer la vie en la replaçant sur son trône de reine. Cette chanson rend allègrement hommage à la mère, à la femme.\n\n-Bam'ba : L'espoir fait vivre. L'espoir apporte de rire. Il est le carburant qui fait tenir sur la grande route de la vie. Il ne faut jamais perdre la flamme de l'espoir.\n\n-Barka : La bénédiction éclaire le chemin et est absolument nécessaire pour grandir l'humain, faciliter son existence et aide à surmonter les obstacles, éviter les chutes qui auraient pu avoir des conséquences fâcheuses. Il faut travailler à avoir des bénédictions des parents, d'autrui à travers des actions bienveillantes.",
    });

    await storage.createTrack({
      albumId: sissanEP.id,
      title: "Ma raison",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "3:45",
    });

    await storage.createTrack({
      albumId: sissanEP.id,
      title: "Elle",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "4:12",
    });

    await storage.createTrack({
      albumId: sissanEP.id,
      title: "Bam'ba",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "3:58",
    });

    await storage.createTrack({
      albumId: sissanEP.id,
      title: "Barka",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "4:05",
    });

    const tounganata = await storage.createAlbum({
      title: "TOUNGANATA",
      coverImage: "/images/LS2C6668_1766230961644.jpg",
      releaseDate: new Date("2024-07-01"),
      description: "Tounganata traite de l'immigration. La quête d'un lendemain qui chante pousse nombre de jeunes africains surtout, à opter pour le départ de chez eux à destination d'un éventuel eldorado qui parfois se révèle être un mirage. Ils laissent les gens qui les aiment dans le tourment, les incertitudes et l'angoisse. Au-delà, cette chanson interpelle et meuble les esprits dans le sens où il est préférable de créer son paradis chez soi au lieu de l'espérer dans un quelconque ailleurs.",
    });

    await storage.createTrack({
      albumId: tounganata.id,
      title: "Tounganata",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "4:19",
      isSingle: true,
    });

    // Group Discography (KILÉ)
    await storage.createAlbum({
      title: "Dembé",
      coverImage: "/images/LS2C6667_1766230961644.jpg",
      releaseDate: new Date("2010-01-01"),
      description: "Album de 10 titres avec le groupe KILÉ.",
    });

    await storage.createAlbum({
      title: "Un jour viendra",
      coverImage: "/images/LS2C6669_1766230961645.jpg",
      releaseDate: new Date("2013-01-01"),
      description: "Album de 13 titres avec le groupe KILÉ.",
    });

    await storage.createAlbum({
      title: "Biko",
      coverImage: "/images/LS2C6649_1766230961643.jpg",
      releaseDate: new Date("2018-01-01"),
      description: "Album de 8 titres avec le groupe KILÉ.",
    });

    await storage.createVideo({
      title: "Midnight in Dakar (Official Video)",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl: "/images/LS2C6649_1766230961643.jpg",
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
      await storage.createUser({
        username: "admin",
        password: "password123",
        role: "admin",
      });
    }
  }
}
