# Damo Fama Artist Website

## Overview

This is a multilingual, immersive web application for the artist DAMO FAMA (Damofama.com). The project is designed as a high-end artist portfolio and brand website featuring cinematic, afro-contemporary aesthetics. It includes public-facing pages for music, events, gallery, press, and contact, along with a protected admin panel for content management.

The application follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter for client-side routing with animated page transitions
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with custom CSS variables for the dark, cinematic theme (gold/bronze primary, deep blacks/earth tones)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and scroll reveals
- **Typography**: Playfair Display (serif headings) and DM Sans (body text)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with typed routes defined in `shared/routes.ts`
- **Authentication**: Passport.js with local strategy, session-based auth using express-session with memory store
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build System**: esbuild for server bundling, Vite for client bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - defines tables for users, content blocks, albums, tracks, videos, events, press, and messages
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` folder are used by both client and server
- **Storage Abstraction**: `server/storage.ts` provides an interface for all database operations
- **API Type Safety**: Zod schemas for request/response validation, shared between frontend and backend
- **Component Architecture**: Reusable UI components in `client/src/components/ui/`, page-specific components alongside pages

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # UI and layout components
│       ├── hooks/       # Custom React hooks for auth and content
│       ├── pages/       # Route page components
│       └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   ├── auth.ts       # Authentication setup
│   └── db.ts         # Database connection
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod
└── migrations/       # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for TypeScript with PostgreSQL driver (`pg`)

### Authentication
- **Passport.js**: Authentication middleware with local strategy
- **express-session**: Session management with memory store (consider connect-pg-simple for production)

### Frontend Libraries
- **Radix UI**: Accessible UI primitives for shadcn/ui components
- **Framer Motion**: Animation library for page transitions
- **TanStack React Query**: Server state management and caching
- **react-hook-form**: Form state management with Zod resolver

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **Drizzle Kit**: Database migration tooling

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption (optional, has default for development)