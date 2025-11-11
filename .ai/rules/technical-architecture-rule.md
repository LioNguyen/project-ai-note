# Technical Architecture Documentation

## 1. ⚠️ CRITICAL: Next.js 14/15 Application Architecture

**THIS REPOSITORY CONTAINS A NEXT.JS APPLICATION WITH APP ROUTER AND FULL-STACK CAPABILITIES.**

### 1.1. Architecture Scope

- **Next.js Framework**: Full-stack React framework with App Router (v16.0.1)
- **Backend Integration**: API routes with service layer pattern
- **Database Layer**: Prisma ORM with PostgreSQL, Pinecone vector database
- **Authentication**: Clerk for user management
- **AI Integration**: Google Gemini AI with RAG pattern, OpenAI embeddings

### 1.2. Technology Stack

- **Framework**: Next.js 16.0.1 with App Router
- **React**: 19.2.0 with Server Components
- **TypeScript**: 5 with strict type checking
- **Database**: Prisma 5.5.2 + PostgreSQL
- **Vector DB**: Pinecone for semantic search
- **AI Services**: Google Gemini AI (chat), OpenAI (embeddings)
- **Authentication**: Clerk 6.34.5
- **Styling**: Tailwind CSS 3 with shadcn/ui components
- **State Management**: Zustand 5.0.8
- **Form Handling**: React Hook Form 7 with Zod validation

### 1.3. Styling Standards

**ALWAYS use Tailwind CSS with shadcn/ui:**

- Tailwind CSS utility-first methodology
- shadcn/ui for accessible component primitives (Radix UI based)
- CSS variables with dark mode via next-themes
- Lucide React for icons

### 1.4. shadcn/ui Integration

- Use as foundation, customize with Tailwind utilities
- Maintain accessibility through Radix UI primitives
- Follow naming conventions and leverage variants

### 1.5. Version Compatibility

**Current Stack:** Next.js 16.0.1, React 19.2.0, Tailwind CSS 3, Radix UI packages

**Version Check:** Verify package.json → Reference docs → Check API compatibility → Follow migration guides

## 2. System Architecture

### 2.1. Project Description

AI Note-Taking Application is a full-stack Next.js application that combines note management with AI-powered chat capabilities. The system uses vector embeddings for semantic search and implements RAG (Retrieval-Augmented Generation) for contextual AI responses.

### 2.2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐         ┌──────────────────┐         │
│  │   Frontend      │         │   Backend API    │         │
│  │  (App Router)   │◄────────┤   (API Routes)   │         │
│  └─────────────────┘         └──────────────────┘         │
│         │                             │                    │
│         │                             ├─► Prisma/Postgres │
│         │                             ├─► Pinecone Vector  │
│         │                             ├─► Gemini AI       │
│         │                             └─► OpenAI          │
│         │                                                  │
│  ┌─────────────────┐                                      │
│  │  State (Zustand)│                                      │
│  │  - Language     │                                      │
│  │  - UI State     │                                      │
│  └─────────────────┘                                      │
└─────────────────────────────────────────────────────────────┘

         │                                    │
         ▼                                    ▼
   ┌──────────┐                        ┌──────────┐
   │  Clerk   │                        │ External │
   │   Auth   │                        │  APIs    │
   └──────────┘                        └──────────┘
```

### 2.3. Architecture Principles

- **Server-First**: Leverage Server Components for initial loads
- **API Layer Separation**: Route groups isolate backend from frontend
- **Service Layer**: Business logic separated from route handlers
- **Type Safety**: End-to-end TypeScript with Zod schemas
- **Atomic Design**: Scalable UI component architecture

## 3. Application Structure

### 3.1. Directory Organization

The application follows Next.js App Router conventions with route groups for clear separation of concerns:

```
src/app/
├── (backend)/                  # Backend API layer (route group)
│   └── api/
│       ├── core/utils/        # Shared backend utilities
│       │   ├── db/
│       │   │   ├── prisma.ts           # Singleton Prisma client
│       │   │   └── pinecone.ts         # Pinecone vector index
│       │   ├── validation/
│       │   │   └── note.ts             # Zod validation schemas
│       │   ├── openai.ts               # OpenAI client & embedding API
│       │   ├── string.ts               # Vietnamese text utilities
│       │   ├── embedding.ts            # Note embedding generation
│       │   └── chat.ts                 # Chat helper functions
│       ├── notes/             # Notes API
│       │   ├── route.ts                # GET all, POST create
│       │   ├── route.services.ts       # CRUD business logic
│       │   ├── route.types.ts          # Note type definitions
│       │   ├── [id]/                   # Single note operations
│       │   │   ├── route.ts            # PUT update, DELETE
│       │   │   ├── route.services.ts
│       │   │   └── route.types.ts
│       │   └── search/                 # Search & filter
│       │       ├── route.ts            # GET with query params
│       │       ├── route.services.ts   # Search logic
│       │       └── route.types.ts
│       └── chat/              # AI Chat API
│           ├── route.ts                # POST streaming response
│           ├── route.services.ts       # RAG implementation
│           └── route.types.ts          # Message types
├── (frontend)/                # Frontend layer (route group)
│   ├── (modules)/             # Feature modules
│   │   ├── notes/
│   │   │   ├── page.tsx               # Notes listing
│   │   │   ├── layout.tsx             # Module layout
│   │   │   ├── loading.tsx            # Loading state
│   │   │   ├── components/
│   │   │   │   ├── molecules/
│   │   │   │   │   ├── AddEditNoteDialog/
│   │   │   │   │   ├── ChatMessage/
│   │   │   │   │   ├── NoteCardSkeleton/
│   │   │   │   │   └── NotesSearchControls/
│   │   │   │   └── organisms/
│   │   │   │       ├── AIChatBox/
│   │   │   │       ├── Note/
│   │   │   │       └── NotesGrid/
│   │   │   └── stores/
│   │   │       ├── useChatBoxStore.ts
│   │   │       └── useNoteDialogStore.ts
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   ├── page.tsx
│   │   │   └── components/SignInPage.tsx
│   │   └── sign-up/[[...sign-up]]/
│   │       ├── page.tsx
│   │       └── components/SignUpPage.tsx
│   └── core/                  # Shared frontend infrastructure
│       ├── components/        # Atomic Design components
│       │   ├── atoms/
│       │   │   ├── Button/
│       │   │   ├── Card/
│       │   │   ├── Dialog/
│       │   │   ├── EmptyState/        # Empty state UI
│       │   │   ├── Form/
│       │   │   ├── Input/
│       │   │   ├── Label/
│       │   │   ├── LoadingButton/
│       │   │   ├── Pagination/
│       │   │   ├── Select/
│       │   │   ├── Sheet/
│       │   │   ├── Skeleton/
│       │   │   ├── Switch/            # Custom switch
│       │   │   └── Textarea/
│       │   ├── molecules/
│       │   │   ├── AIChatButton/
│       │   │   ├── BaseSheet/
│       │   │   ├── LanguageSwitcher/  # EN/VI toggle
│       │   │   ├── SearchBox/
│       │   │   └── ThemeToggleButton/
│       │   └── organisms/
│       │       └── NavBar/
│       ├── i18n/              # Internationalization
│       │   ├── index.ts
│       │   └── locale/
│       │       ├── en/default.ts      # English translations
│       │       └── vi/default.ts      # Vietnamese translations
│       ├── store/             # Global Zustand stores
│       │   └── useLanguageStore.ts
│       └── utils/             # Frontend utilities
│           ├── api.ts
│           └── utils.ts
├── shared/assets/             # Shared static assets
│   └── logo.png
├── globals.css
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
└── ThemeProvider.tsx

src/middleware.ts              # Auth & routing middleware

prisma/schema.prisma          # Database schema

scripts/                       # Utility scripts
├── check-notes.ts
├── create-random-notes.ts
├── reset-vietnamese-notes.ts
├── sync-pinecone.ts
└── update-user-id.ts
```

### 3.2. API Route Pattern

**Three-file structure for maintainability:**

- `route.ts` - HTTP handlers (GET, POST, PUT, DELETE)
- `route.services.ts` - Business logic, database operations
- `route.types.ts` - TypeScript interfaces and DTOs

**Example:**

```typescript
// route.types.ts
export interface Note {
  id: string;
  title: string;
  content?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
}

// route.services.ts
import prisma from "@/app/(backend)/api/core/utils/db/prisma";
import { getEmbeddingForNote } from "@/app/(backend)/api/core/utils/embedding";

export async function createNote(
  userId: string,
  data: CreateNoteRequest,
): Promise<Note> {
  const embedding = await getEmbeddingForNote(data.title, data.content);

  const note = await prisma.note.create({
    data: { ...data, userId },
  });

  await notesIndex.upsert([
    {
      id: note.id,
      values: embedding,
      metadata: { userId },
    },
  ]);

  return note;
}

// route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createNote } from "./route.services";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const note = await createNote(userId, body);
  return NextResponse.json(note, { status: 201 });
}
```

**Benefits:** Separation of concerns, testability, reusability, type safety

### 3.3. Component Organization

**Atomic Design Hierarchy:**

- **Atoms**: Button, Input, Card, EmptyState, Switch
- **Molecules**: SearchBox, LanguageSwitcher, AIChatButton
- **Organisms**: NavBar, AIChatBox, NotesGrid

**Structure:** `ComponentName/ComponentName.tsx` + optional index.ts

**Examples:**

```typescript
// Atom: EmptyState
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-dashed p-8">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

// Molecule: LanguageSwitcher
"use client";
export default function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const isVietnamese = locale === "vi";

  return (
    <button role="switch" aria-checked={isVietnamese}
      onClick={() => setLocale(isVietnamese ? "en" : "vi")}
      className={cn("relative inline-flex h-7 w-14 items-center rounded-full",
        isVietnamese ? "bg-primary" : "bg-input")}>
      <span className={cn("flex h-6 w-6 rounded-full bg-background",
        isVietnamese ? "translate-x-7" : "translate-x-0")}>
        {isVietnamese ? "VI" : "EN"}
      </span>
    </button>
  );
}
```

**Best Practices:** Use `"use client"` only when needed, single responsibility, TypeScript interfaces for props

### 3.4. Backend Utility Structure

**Location:** `src/app/(backend)/api/core/utils/`

**Database (`utils/db/`):**

```typescript
// prisma.ts - Singleton pattern
const prisma = globalThis.prismaGlobal ?? new PrismaClient();
export default prisma;

// pinecone.ts
export const notesIndex = pinecone.Index("nextjs-note-ai");
```

**AI & Embeddings:**

```typescript
// embedding.ts
export async function getEmbeddingForNote(
  title: string,
  content?: string,
): Promise<number[]> {
  return getEmbedding(title + "\n\n" + (content ?? ""));
}

// chat.ts - Helper functions
export function convertToGeminiFormat(messages: ChatMessage[]): GeminiMessage[];
export async function getRelevantNotes(
  userId: string,
  embedding: number[],
): Promise<Note[]>;
```

**String & Validation:**

```typescript
// string.ts - Vietnamese normalization
export function normalizeVietnamese(text: string): string;
export function containsSearch(text: string, query: string): boolean;

// validation/note.ts - Zod schemas
export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});
```

### 3.5. Internationalization (i18n) System

**Structure:** `src/app/(frontend)/core/i18n/` with EN/VI locale files

**Implementation:**

```typescript
// locale/en/default.ts & locale/vi/default.ts
export default {
  navbar: { appName: "Smart Notes", addNote: "Add Note" },
  notes: {
    search: { placeholder: "Search notes...", sortBy: "Sort by" },
    empty: { noNotes: "No notes yet", createFirst: "Create your first note" }
  }
};

// index.ts
import en from "./locale/en/default";
import vi from "./locale/vi/default";
export const locales = { en, vi };

// store/useLanguageStore.ts - Zustand with persistence
export const useLanguageStore = create<LanguageState>()(
  persist((set) => ({
    locale: "en",
    setLocale: (locale) => set({ locale }),
  }), { name: "language-storage" })
);

// Selectors for optimization
export const useLocale = () => useLanguageStore((state) => state.locale);
export const useSetLocale = () => useLanguageStore((state) => state.setLocale);

// Usage in components
const locale = useLocale();
const t = locales[locale];
return <h1>{t.navbar.appName}</h1>;
```

## 4. Component & Code Standards

### 4.1. Next.js Component Patterns

```typescript
// Client Component - use "use client" for interactivity
"use client";
import { useState } from "react";

export default function NoteForm({ onSubmit, initialData }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  return <form onSubmit={handleSubmit}>...</form>;
}

// Server Component - default, no directive needed
export default async function NotesPage({ searchParams }: NotesPageProps) {
  const notes = await prisma.note.findMany({ where: { /* filters */ } });
  return <div>{/* render */}</div>;
}
```

### 4.2. Import Organization

```typescript
// External packages first
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

// Internal imports with @ alias
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
```

### 4.3. State Management with Zustand

```typescript
// Store with persistence and selectors
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "language-storage" },
  ),
);

// Selector pattern for optimization
export const useLocale = () => useLanguageStore((state) => state.locale);
export const useSetLocale = () => useLanguageStore((state) => state.setLocale);
```

### 4.4. Form Handling with React Hook Form & Zod

```typescript
const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function NoteDialog() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<NoteFormData>({ resolver: zodResolver(noteSchema) });

  const onSubmit = async (data: NoteFormData) => {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit" disabled={isSubmitting}>Save</button>
    </form>
  );
}
```
