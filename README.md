# AI Note-Taking Application

A modern note-taking application with AI-powered chat capabilities built with Next.js 14/15 App Router.

## Technology Stack

### Core Framework

- **[Next.js 16.0.1](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Authentication & Authorization

- **[Clerk](https://clerk.com/docs/quickstarts/nextjs)** - User authentication and management
- Secure session handling with server-side validation

### Database & Storage

- **[Prisma 5.5.2](https://www.prisma.io/docs)** - Type-safe ORM for PostgreSQL
- **[Pinecone](https://app.pinecone.io)** - Vector database for semantic search
- Best practices: Singleton pattern for database connections

### AI & Machine Learning

- **[Google Gemini AI](https://ai.google.dev/)** - Chat completions with streaming
- **[Google Embeddings](https://ai.google.dev/models/gemini-embedding)** - Text embeddings (768-dimensional) for semantic search
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI streaming utilities

### UI & Styling

- **[Tailwind CSS 3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component primitives
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### State Management

- **[Zustand 5.0.8](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- LocalStorage persistence for user preferences

### Form Handling & Validation

- **[React Hook Form 7](https://react-hook-form.com/)** - Performant form library
- **[Zod 3.22.4](https://zod.dev/)** - Schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation integration

### Internationalization

- Custom i18n implementation with English/Vietnamese support
- Locale-based translations with interpolation

## Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── (backend)/              # Backend API layer (route group)
│   │   └── api/
│   │       ├── (modules)/      # Modular API endpoints (route group)
│   │       │   ├── auth/       # Authentication API
│   │       │   │   ├── auth.config.ts          # NextAuth config
│   │       │   │   ├── [...nextauth]/
│   │       │   │   │   └── route.ts            # NextAuth handler
│   │       │   │   └── signup/
│   │       │   │       └── route.ts            # Sign-up endpoint
│   │       │   ├── cron/       # Scheduled jobs & health checks
│   │       │   │   ├── cleanup/
│   │       │   │   │   ├── route.ts            # Cleanup execution
│   │       │   │   │   ├── route.services.ts   # Cleanup logic
│   │       │   │   │   └── route.types.ts      # Cleanup schemas
│   │       │   │   └── ping/
│   │       │   │       ├── route.ts            # Health check
│   │       │   │       ├── route.services.ts   # Ping services
│   │       │   │       └── route.types.ts      # Ping types
│   │       │   ├── chat/       # AI chat API (RAG)
│   │       │   │   ├── route.ts                # Stream endpoint
│   │       │   │   ├── route.services.ts       # AI logic
│   │       │   │   └── route.types.ts          # Message types
│   │       │   ├── notes/      # Notes CRUD API
│   │       │   │   ├── route.ts                # GET, POST
│   │       │   │   ├── route.services.ts       # Business logic
│   │       │   │   ├── route.types.ts          # Note types
│   │       │   │   ├── [id]/                   # Individual note
│   │       │   │   │   ├── route.ts            # PUT, DELETE
│   │       │   │   │   ├── route.services.ts
│   │       │   │   │   └── route.types.ts
│   │       │   │   └── search/                 # Search & filter
│   │       │   │       ├── route.ts            # Search endpoint
│   │       │   │       ├── route.services.ts
│   │       │   │       └── route.types.ts
│   │       │   └── trial/      # Trial mode operations
│   │       │       ├── clear/
│   │       │       │   └── route.ts            # Clear trial data
│   │       │       └── sync-pinecone/
│   │       │           ├── route.ts            # Sync notes
│   │       │           ├── [id]/
│   │       │           │   └── route.ts        # Sync single note
│   │       │           ├── route.services.ts
│   │       │           └── route.types.ts
│   │       └── core/           # Shared backend utilities
│   │           └── utils/      # Helper functions
│   │               ├── db/
│   │               │   ├── prisma.ts           # Prisma singleton
│   │               │   └── pinecone.ts         # Pinecone index
│   │               ├── validation/
│   │               │   └── note.ts             # Zod schemas
│   │               ├── auth.ts                 # Auth helpers
│   │               ├── openai.ts               # Gemini & embeddings
│   │               ├── string.ts               # Text utilities
│   │               ├── embedding.ts            # Embedding gen
│   │               ├── chat.ts                 # Chat helpers
│   │               └── trialMode.ts            # Trial utilities
│   ├── (frontend)/             # Frontend layer (route group)
│   │   ├── (modules)/          # Feature modules
│   │   │   ├── (chat-bot)/     # Chat bot module (optional)
│   │   │   │   ├── handlers/
│   │   │   │   │   └── useChatBot.ts    # Chat logic
│   │   │   │   └── components/
│   │   │   │       ├── atoms/
│   │   │   │       ├── molecules/
│   │   │   │       └── organisms/
│   │   │   ├── notes/          # Notes management
│   │   │   │   ├── page.tsx              # Notes listing
│   │   │   │   ├── layout.tsx            # Module layout
│   │   │   │   ├── loading.tsx           # Loading state
│   │   │   │   ├── components/
│   │   │   │   │   ├── atoms/
│   │   │   │   │   ├── molecules/
│   │   │   │   │   │   ├── AddNoteButton/
│   │   │   │   │   │   ├── ChatMessage/
│   │   │   │   │   │   └── NoteCardSkeleton/
│   │   │   │   │   └── organisms/
│   │   │   │   │       ├── ChatBot/
│   │   │   │   │       ├── Note/
│   │   │   │   │       └── NotesGrid/
│   │   │   │   └── stores/
│   │   │   │       ├── useChatBoxStore.ts
│   │   │   │       └── useNoteDialogStore.ts
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       └── SignInPage.tsx
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           └── SignUpPage.tsx
│   │   └── core/               # Shared frontend infrastructure
│   │       ├── components/     # Reusable UI (Atomic Design)
│   │       │   ├── atoms/      # Basic building blocks
│   │       │   │   ├── Button/
│   │       │   │   ├── Card/
│   │       │   │   ├── Dialog/
│   │       │   │   ├── EmptyState/
│   │       │   │   ├── Form/
│   │       │   │   ├── Input/
│   │       │   │   ├── Label/
│   │       │   │   ├── LoadingButton/
│   │       │   │   ├── Pagination/
│   │       │   │   ├── Select/
│   │       │   │   ├── Sheet/
│   │       │   │   ├── Skeleton/
│   │       │   │   ├── Switch/
│   │       │   │   └── Textarea/
│   │       │   ├── molecules/  # Composite components
│   │       │   │   ├── AddNoteButton/
│   │       │   │   ├── AIChatButton/
│   │       │   │   ├── BaseSheet/
│   │       │   │   ├── LanguageSwitcher/
│   │       │   │   ├── SearchBox/
│   │       │   │   ├── ThemeToggleButton/
│   │       │   │   └── TrialModeBanner/
│   │       │   └── organisms/  # Complex sections
│   │       │       ├── DataGrid/
│   │       │       └── NavBar/
│   │       ├── i18n/           # Internationalization (EN/VI)
│   │       │   ├── index.ts
│   │       │   └── locale/
│   │       │       ├── en/
│   │       │       │   └── default.ts
│   │       │       └── vi/
│   │       │           └── default.ts
│   │       ├── store/          # Global state (Zustand)
│   │       │   ├── useLanguageStore.ts
│   │       │   ├── useTrialModeStore.ts
│   │       │   └── useUserMenuStore.ts
│   │       ├── domains/        # Domain types
│   │       │   └── types/
│   │       └── utils/          # Frontend utilities
│   │           ├── analytics.ts
│   │           ├── api.ts
│   │           ├── trialMode.ts
│   │           └── utils.ts
│   ├── shared/                 # Shared assets
│   │   └── assets/
│   │       ├── logo.png
│   │       └── logo-old.png
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── SessionProvider.tsx
│   └── ThemeProvider.tsx
├── middleware.ts               # Auth & routing middleware
└── prisma/
    └── schema.prisma           # Database schema
```

### Architecture Principles

1. **Route Group Separation**: Backend (`(backend)`) and frontend (`(frontend)`) isolated using Next.js route groups
2. **Service Layer Pattern**: API routes delegate business logic to `.services.ts` files
3. **Type Safety**: Comprehensive TypeScript types in `.types.ts` files with Zod validation
4. **Component Architecture**: Atomic Design (atoms → molecules → organisms) for scalable UI
5. **Server-First**: Leverage Next.js Server Components for optimal performance
6. **Internationalization**: Full EN/VI support with custom i18n system
7. **Utility Extraction**: Shared helpers in `core/utils` for reusability

## Development Guidelines

### API Development

All API routes follow a consistent three-file structure:

- **`route.ts`** - HTTP handlers (GET, POST, PUT, DELETE)
- **`route.services.ts`** - Business logic and data operations
- **`route.types.ts`** - TypeScript interfaces and types

**API Module Organization:**

- **`/api/(modules)/auth`** - Authentication (NextAuth, signup)
- **`/api/(modules)/cron`** - Scheduled jobs (cleanup trial notes, health checks)
  - `cleanup` - POST to execute, GET for dry run
  - `ping` - GET health check for Pinecone & MongoDB
- **`/api/(modules)/chat`** - AI chat with RAG pattern
- **`/api/(modules)/notes`** - CRUD operations with semantic search
- **`/api/(modules)/trial`** - Trial mode operations (sync, cleanup)
- **`/api/core/utils`** - Shared backend utilities

**Example Structure:**

```typescript
// route.ts - HTTP layer
export async function GET(req: Request) {
  const notes = await getAllNotes(userId);
  return NextResponse.json(notes);
}

// route.services.ts - Business layer
export async function getAllNotes(userId: string): Promise<Note[]> {
  return await prisma.note.findMany({ where: { userId } });
}

// route.types.ts - Type definitions
export interface Note {
  id: string;
  title: string;
  content?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Component Standards

- **Client Components**: Use `"use client"` directive for interactivity
- **Atomic Design**: Organize by atoms → molecules → organisms
- **Co-location**: Keep related files together (components, stores, styles)
- **Clean Imports**: Export from index files for better DX
- **Styling**: Use Tailwind CSS with shadcn/ui components

### State Management

- **Zustand Stores**: Global client state (language, dialog visibility)
  - Use selector pattern for optimization
  - Persist to localStorage when needed
- **Server State**: Managed through Next.js Server Components
- **Form State**: React Hook Form with Zod validation

### Internationalization

- **Locale Files**: English (`en`) and Vietnamese (`vi`) translations
- **Translation Access**: Import from `@/app/(frontend)/core/i18n`
- **Interpolation**: Use `{{placeholder}}` syntax for dynamic values
- **Language Storage**: Persisted via Zustand to localStorage

### Data Flow

1. **Frontend → Backend**: Client components call API routes
2. **Backend Processing**: Services handle business logic, database operations
3. **Vector Search**: Semantic search via Pinecone embeddings
4. **AI Integration**: Gemini chat with context from relevant notes (RAG pattern)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local with required keys (see .env.example)

# Generate Prisma client
npm run postinstall

# Run development server
npm run dev

# Sync notes to Pinecone (after database setup)
npm run sync-pinecone
```

## Key Features

- **Note Management**: Create, read, update, delete notes with rich text
- **Semantic Search**: Find notes by meaning, not just keywords
- **AI Chat Assistant**: Ask questions about your notes with context-aware responses (RAG)
- **Dark Mode**: System-aware theme with manual toggle
- **Internationalization**: English and Vietnamese language support
- **Authentication**: Secure user authentication with Clerk
- **Trial Mode**: Non-authenticated access to test the app
- **Health Monitoring**: Automated health checks for Pinecone & MongoDB
- **Auto Cleanup**: Scheduled job to remove old trial notes (7+ days)
- **Analytics**: Google Analytics 4 tracking for user behavior insights

## API Endpoints

### Health & Monitoring

- **GET** `/api/cron/ping` - Health check (Pinecone + MongoDB)
- **GET** `/api/cron/cleanup` - Dry run (check what would be deleted)
- **POST** `/api/cron/cleanup` - Execute cleanup (delete notes 7+ days old)

### Authentication

- **POST** `/api/auth/signup` - Sign up endpoint
- **GET/POST** `/api/auth/[...nextauth]` - NextAuth authentication

### Notes Management

- **GET** `/api/notes` - List all notes
- **POST** `/api/notes` - Create note
- **PUT** `/api/notes/[id]` - Update note
- **DELETE** `/api/notes/[id]` - Delete note
- **GET** `/api/notes/search` - Search notes

### AI Chat

- **POST** `/api/chat` - Send message with streaming response

### Trial Mode

- **POST** `/api/trial/sync-pinecone` - Sync trial notes to Pinecone
- **POST** `/api/trial/sync-pinecone/[id]` - Sync single trial note
- **DELETE** `/api/trial/clear` - Clear all trial data

## Documentation

- **[Google Analytics Setup](docs/GOOGLE_ANALYTICS_SETUP.md)** - Complete guide for GA4 integration and event tracking
- **[NextAuth Migration](docs/NEXTAUTH_MIGRATION.md)** - Authentication system migration guide
