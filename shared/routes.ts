import { z } from 'zod';
import { 
  insertUserSchema, insertContentBlockSchema, insertAlbumSchema, 
  insertTrackSchema, insertVideoSchema, insertEventSchema, 
  insertPressSchema, insertPhotoSchema, insertMessageSchema,
  users, contentBlocks, albums, tracks, videos, events, press, photos, messages 
} from './schema';

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
    list: {
      method: 'GET' as const,
      path: '/api/albums',
      responses: {
        200: z.array(z.custom<typeof albums.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/albums',
      input: insertAlbumSchema,
      responses: {
        201: z.custom<typeof albums.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/albums/:id',
      input: insertAlbumSchema,
      responses: {
        200: z.custom<typeof albums.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/albums/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  tracks: {
    list: {
      method: 'GET' as const,
      path: '/api/tracks',
      responses: {
        200: z.array(z.custom<typeof tracks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tracks',
      input: insertTrackSchema,
      responses: {
        201: z.custom<typeof tracks.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tracks/:id',
      input: insertTrackSchema,
      responses: {
        200: z.custom<typeof tracks.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tracks/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos',
      responses: {
        200: z.array(z.custom<typeof videos.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/videos',
      input: insertVideoSchema,
      responses: {
        201: z.custom<typeof videos.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/videos/:id',
      input: insertVideoSchema,
      responses: {
        200: z.custom<typeof videos.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/videos/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/events/:id',
      input: insertEventSchema,
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/events/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  press: {
    list: {
      method: 'GET' as const,
      path: '/api/press',
      responses: {
        200: z.array(z.custom<typeof press.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/press',
      input: insertPressSchema,
      responses: {
        201: z.custom<typeof press.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/press/:id',
      input: insertPressSchema,
      responses: {
        200: z.custom<typeof press.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/press/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  photos: {
    list: {
      method: 'GET' as const,
      path: '/api/photos',
      responses: {
        200: z.array(z.custom<typeof photos.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/photos',
      input: insertPhotoSchema,
      responses: {
        201: z.custom<typeof photos.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/photos/:id',
      input: insertPhotoSchema,
      responses: {
        200: z.custom<typeof photos.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/photos/:id',
      responses: {
        204: z.void(),
      },
    },
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
      path: '/api/contact',
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
