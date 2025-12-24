import { z } from 'zod';
import {
  insertUserSchema, insertContentBlockSchema, insertAlbumSchema,
  insertTrackSchema, insertVideoSchema, insertEventSchema,
  insertPressSchema, insertMessageSchema,
  users, contentBlocks, albums, tracks, videos, events, press, messages
} from './schema';

// Placeholder for endpoint definition, assuming it exists elsewhere
const endpoint = (config: any) => config;
// Placeholder for select schema definitions, assuming they exist elsewhere
const selectAlbumSchema = z.any();
const selectTrackSchema = z.any();
const selectVideoSchema = z.any();
const selectEventSchema = z.any();
const selectPressSchema = z.any();

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  content: {
    list: {
      method: 'GET' as const,
      path: '/api/content',
      responses: {
        200: z.array(z.custom<typeof contentBlocks.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/content',
      input: insertContentBlockSchema,
      responses: {
        200: z.custom<typeof contentBlocks.$inferSelect>(),
        201: z.custom<typeof contentBlocks.$inferSelect>(),
      },
    },
  },
  albums: {
    list: endpoint({
      method: "GET",
      path: "/api/albums",
      responses: {
        200: z.array(selectAlbumSchema),
      },
    }),
    create: endpoint({
      method: "POST",
      path: "/api/albums",
      input: insertAlbumSchema,
      responses: {
        201: selectAlbumSchema,
      },
    }),
    update: endpoint({
      method: "PATCH",
      path: "/api/albums/:id",
      input: insertAlbumSchema,
      responses: {
        200: selectAlbumSchema,
      },
    }),
    delete: endpoint({
      method: "DELETE",
      path: "/api/albums/:id",
      responses: {
        204: z.void(),
      },
    }),
    reorder: endpoint({
      method: "POST",
      path: "/api/albums/reorder",
      input: z.object({
        id: z.number(),
        direction: z.enum(["up", "down"]),
      }),
      responses: {
        200: z.array(selectAlbumSchema),
      },
    }),
  },
  tracks: {
    list: endpoint({
      method: "GET",
      path: "/api/tracks",
      responses: {
        200: z.array(selectTrackSchema),
      },
    }),
    create: endpoint({
      method: "POST",
      path: "/api/tracks",
      input: insertTrackSchema,
      responses: {
        201: selectTrackSchema,
      },
    }),
    update: endpoint({
      method: "PATCH",
      path: "/api/tracks/:id",
      input: insertTrackSchema,
      responses: {
        200: selectTrackSchema,
      },
    }),
    delete: endpoint({
      method: "DELETE",
      path: "/api/tracks/:id",
      responses: {
        204: z.void(),
      },
    }),
    reorder: endpoint({
      method: "POST",
      path: "/api/tracks/reorder",
      input: z.object({
        id: z.number(),
        direction: z.enum(["up", "down"]),
      }),
      responses: {
        200: z.array(selectTrackSchema),
      },
    }),
  },
  videos: {
    list: endpoint({
      method: "GET",
      path: "/api/videos",
      responses: {
        200: z.array(selectVideoSchema),
      },
    }),
    create: endpoint({
      method: "POST",
      path: "/api/videos",
      input: insertVideoSchema,
      responses: {
        201: selectVideoSchema,
      },
    }),
    update: endpoint({
      method: "PATCH",
      path: "/api/videos/:id",
      input: insertVideoSchema,
      responses: {
        200: selectVideoSchema,
      },
    }),
    delete: endpoint({
      method: "DELETE",
      path: "/api/videos/:id",
      responses: {
        204: z.void(),
      },
    }),
    reorder: endpoint({
      method: "POST",
      path: "/api/videos/reorder",
      input: z.object({
        id: z.number(),
        direction: z.enum(["up", "down"]),
      }),
      responses: {
        200: z.array(selectVideoSchema),
      },
    }),
  },
  events: {
    list: endpoint({
      method: "GET",
      path: "/api/events",
      responses: {
        200: z.array(selectEventSchema),
      },
    }),
    create: endpoint({
      method: "POST",
      path: "/api/events",
      input: insertEventSchema,
      responses: {
        201: selectEventSchema,
      },
    }),
    update: endpoint({
      method: "PATCH",
      path: "/api/events/:id",
      input: insertEventSchema,
      responses: {
        200: selectEventSchema,
      },
    }),
    delete: endpoint({
      method: "DELETE",
      path: "/api/events/:id",
      responses: {
        204: z.void(),
      },
    }),
    reorder: endpoint({
      method: "POST",
      path: "/api/events/reorder",
      input: z.object({
        id: z.number(),
        direction: z.enum(["up", "down"]),
      }),
      responses: {
        200: z.array(selectEventSchema),
      },
    }),
  },
  press: {
    list: endpoint({
      method: "GET",
      path: "/api/press",
      responses: {
        200: z.array(selectPressSchema),
      },
    }),
    create: endpoint({
      method: "POST",
      path: "/api/press",
      input: insertPressSchema,
      responses: {
        201: selectPressSchema,
      },
    }),
    update: endpoint({
      method: "PATCH",
      path: "/api/press/:id",
      input: insertPressSchema,
      responses: {
        200: selectPressSchema,
      },
    }),
    delete: endpoint({
      method: "DELETE",
      path: "/api/press/:id",
      responses: {
        204: z.void(),
      },
    }),
    reorder: endpoint({
      method: "POST",
      path: "/api/press/reorder",
      input: z.object({
        id: z.number(),
        direction: z.enum(["up", "down"]),
      }),
      responses: {
        200: z.array(selectPressSchema),
      },
    }),
  },
  contact: {
    send: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/contact', // Admin only
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}