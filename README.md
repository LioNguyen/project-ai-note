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
- **[OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)** - Text embeddings for semantic search
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
│   │       ├── core/           # Shared backend utilities
│   │       │   └── utils/      # Helper functions
│   │       │       ├── db/     # Database connections
│   │       │       │   ├── prisma.ts    # Prisma singleton
│   │       │       │   └── pinecone.ts  # Pinecone index
│   │       │       ├── validation/
│   │       │       │   └── note.ts      # Zod schemas
│   │       │       ├── openai.ts        # OpenAI client & embeddings
│   │       │       ├── string.ts        # Vietnamese text utilities
│   │       │       ├── embedding.ts     # Note embedding generation
│   │       │       └── chat.ts          # Chat helper functions
│   │       ├── notes/          # Notes CRUD API
│   │       │   ├── route.ts             # GET (all), POST (create)
│   │       │   ├── route.services.ts    # Business logic
│   │       │   ├── route.types.ts       # TypeScript types
│   │       │   ├── [id]/                # Individual note operations
│   │       │   │   ├── route.ts         # PUT (update), DELETE
│   │       │   │   ├── route.services.ts
│   │       │   │   └── route.types.ts
│   │       │   └── search/              # Search & filtering
│   │       │       ├── route.ts         # GET with query params
│   │       │       ├── route.services.ts
│   │       │       └── route.types.ts
│   │       └── chat/           # AI chat API (RAG pattern)
│   │           ├── route.ts             # POST (streaming response)
│   │           ├── route.services.ts    # AI logic & context building
│   │           └── route.types.ts       # Message types
│   ├── (frontend)/             # Frontend layer (route group)
│   │   ├── (modules)/          # Feature modules
│   │   │   ├── chat/           # Chat module (placeholder)
│   │   │   ├── notes/          # Notes management
│   │   │   │   ├── page.tsx           # Notes listing page
│   │   │   │   ├── layout.tsx         # Notes layout wrapper
│   │   │   │   ├── loading.tsx        # Loading state
│   │   │   │   ├── components/
│   │   │   │   │   ├── molecules/
│   │   │   │   │   │   ├── AddEditNoteDialog/
│   │   │   │   │   │   ├── ChatMessage/
│   │   │   │   │   │   └── NoteCardSkeleton/
│   │   │   │   │   └── organisms/
│   │   │   │   │       ├── AIChatBox/
│   │   │   │   │       ├── Note/
│   │   │   │   │       └── NotesGrid/
│   │   │   │   └── stores/
│   │   │   │       ├── useChatBoxStore.ts    # Chat UI state
│   │   │   │       └── useNoteDialogStore.ts # Dialog state
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
│   │       │   │   ├── EmptyState/      # Empty state component
│   │       │   │   ├── Form/
│   │       │   │   ├── Input/
│   │       │   │   ├── Label/
│   │       │   │   ├── LoadingButton/
│   │       │   │   ├── Pagination/
│   │       │   │   ├── Select/
│   │       │   │   ├── Sheet/
│   │       │   │   ├── Skeleton/
│   │       │   │   ├── Switch/          # Custom switch component
│   │       │   │   └── Textarea/
│   │       │   ├── molecules/  # Composite components
│   │       │   │   ├── AIChatButton/
│   │       │   │   ├── BaseSheet/
│   │       │   │   ├── LanguageSwitcher/ # EN/VI toggle
│   │       │   │   ├── SearchBox/
│   │       │   │   └── ThemeToggleButton/
│   │       │   └── organisms/  # Complex UI sections
│   │       │       ├── DataGrid/        # Reusable data grid
│   │       │       └── NavBar/
│   │       ├── i18n/           # Internationalization (EN/VI)
│   │       │   ├── index.ts    # Locale exports
│   │       │   └── locale/
│   │       │       ├── en/
│   │       │       │   └── default.ts   # English translations
│   │       │       └── vi/
│   │       │           └── default.ts   # Vietnamese translations
│   │       ├── store/          # Global state (Zustand)
│   │       │   └── useLanguageStore.ts  # Language preference
│   │       └── utils/          # Frontend utilities
│   │           ├── api.ts      # API client helpers
│   │           └── utils.ts    # General utilities (cn, etc.)
│   ├── shared/                 # Shared assets
│   │   └── assets/
│   │       └── logo.png
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── ThemeProvider.tsx       # Theme context provider
├── middleware.ts               # Next.js middleware (auth routing)
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
- **AI Chat Assistant**: Ask questions about your notes with context-aware responses
- **Dark Mode**: System-aware theme with manual toggle
- **Internationalization**: English and Vietnamese language support
- **Authentication**: Secure user authentication with Clerk
