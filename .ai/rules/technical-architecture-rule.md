# Technical Architecture Rules

**CRITICAL**: This is a Next.js 15 application with App Router, Server Components, and full-stack capabilities.

## 1. Reference & Technology Stack

For development principles and code quality standards, refer to `.github/copilot-instructions.md`.

**Stack Overview:**

- **Framework**: Next.js 15.0.3 (App Router, Server Components)
- **React**: 18.3.1 with RSC
- **Language**: TypeScript 5 (strict)
- **Database**: Prisma 5.5.2 ORM + MongoDB
- **Auth**: NextAuth 4.24.13 (Google OAuth + Credentials) + bcryptjs
- **Vector DB**: Pinecone (semantic search, embeddings)
- **AI**: Google Gemini (chat), Google Text Embeddings (text-embedding-004, 768-dim)
- **UI**: Tailwind CSS 3 + shadcn/ui (Radix UI) + Lucide React
- **State**: Zustand 5.0.8 (client-side)
- **Forms**: React Hook Form 7 + Zod validation
- **i18n**: i18next + react-i18next (EN, VI)
- **HTTP Client**: Axios
- **Scheduling**: GitHub Actions cron
- **Package Manager**: Bun

**Style Standards**: Use Tailwind CSS + shadcn/ui ONLY. Never use plain CSS or other frameworks.

**Key Constraints**:

- Server Components by default; "use client" only when necessary
- End-to-end TypeScript (no implicit `any`)
- API routes: strict three-file pattern (route.ts, route.services.ts, route.types.ts)
- Zod validation for all API inputs and critical logic
- Prisma migrations required for schema changes

## 2. System Overview

**AI Note-Taking Application**: Full-stack Next.js app combining note management with AI-powered chat. Uses vector embeddings for semantic search and RAG pattern for contextual AI responses.

**Core Features**: Note CRUD, AI chat, semantic search, trial mode, multi-language (EN, VI), dark/light theme, Google OAuth + Email/Password auth.

**Architecture Layers**:

```
Frontend (App Router)
  ↓
Zustand Store (client state)
  ↓
NextAuth Session Management
  ↓
API Routes (validation, services)
  ↓
Prisma ORM ← MongoDB
Pinecone Vector DB
External APIs (Gemini, Google OAuth)
```

## 3. Project Structure

**Directory Organization** (App Router with route groups):

```
src/app/
├── api/
│   ├── (modules)/
│   │   ├── auth/ → auth.config.ts (NextAuth config), [...nextauth]/route.ts, signup/route.ts
│   │   ├── chat/ → route.ts (POST streaming) + route.services.ts + route.types.ts
│   │   ├── cron/ → cleanup/route.ts, ping/route.ts (with .services.ts/.types.ts)
│   │   ├── notes/ → route.ts, [id]/route.ts, search/route.ts + .services.ts/.types.ts
│   │   └── trial/ → clear/route.ts, sync-pinecone/ + route.ts + .services.ts/.types.ts
│   └── core/
│       ├── config/ → index.ts (env variables, secrets)
│       └── utils/
│           ├── db/ → prisma.ts (Singleton), pinecone.ts
│           ├── auth.ts, embedding.ts, chat.ts, string.ts
│           └── validation/ → note.ts (Zod schemas)
├── (frontend)/
│   ├── core/
│   │   ├── components/ → atoms/, molecules/, organisms/ (Atomic Design)
│   │   ├── config/ → i18next config
│   │   ├── domains/ → types/ (TypeScript types, interfaces)
│   │   └── utils/ → api.ts, helpers
│   └── (modules)/ → feature-specific modules (notes, sign-in, sign-up, etc.)
├── shared/
│   └── assets/ → logo.png, images
├── layout.tsx, page.tsx, globals.css, ThemeProvider.tsx, SessionProvider.tsx
└── middleware.ts (auth middleware)

prisma/schema.prisma (MongoDB schema with NextAuth models)
```

**Three-file structure:** `route.ts` (HTTP handler) + `route.services.ts` (business logic) + `route.types.ts` (types/schemas)

**Module organization:**

- `/api/(modules)/auth/` → NextAuth config (Google OAuth + Credentials), signup (email/password registration)
- `/api/(modules)/cron/` → cleanup (trial notes), ping (health checks)
- `/api/(modules)/chat/` → AI chat (RAG pattern, streaming)
- `/api/(modules)/notes/` → CRUD, [id], search endpoints
- `/api/(modules)/trial/` → data sync, cleanup
- `/api/core/` → config (env variables), utils (db, validation, AI)

**API Pattern:**

```typescript
// route.types.ts
export const CreateNoteSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});
export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;

// route.services.ts
export async function createNote(
  userId: string,
  data: CreateNoteRequest,
): Promise<Note> {
  const embedding = await getEmbeddingForNote(data.title);
  const note = await prisma.note.create({ data: { ...data, userId } });
  await notesIndex.upsert([
    { id: note.id, values: embedding, metadata: { userId } },
  ]);
  return note;
}

// route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = CreateNoteSchema.parse(await req.json());
  const note = await createNote(userId, body);
  return NextResponse.json(note, { status: 201 });
}
```

### 3.3. Component Organization

**Atomic Design:** Atoms (Button, Input, Card) → Molecules (SearchBox, LanguageSwitcher) → Organisms (NavBar, ChatBot)

**Structure:** `ComponentName/ComponentName.tsx` + index.ts

**Locations:**

- **Core Components** (`(frontend)/core/components/`): Reusable base components (Atoms, Molecules, Organisms)
- **Module Components** (`(modules)/{module}/components/`): Feature-specific components for that module

**Layer Isolation Rules** (CRITICAL):

```
Atoms:        Can import → shadcn/ui, Lucide, utils
Molecules:    Can import → Atoms only (same layer + parent layers)
Organisms:    Can import → Atoms, Molecules (same layer + parent layers)

Core Layer:   core/atoms → core/molecules → core/organisms
Feature Layer: modules/*/atoms → modules/*/molecules → modules/*/organisms

FORBIDDEN Cross-Layer Imports:
❌ Atoms importing Molecules/Organisms (same or any layer)
❌ Molecules importing Molecules (same layer)
❌ Molecules importing Organisms (same or any layer)
❌ Organisms importing Organisms (same layer)

ALLOWED Cross-Folder Imports:
✅ modules/*/molecules CAN import core/molecules
✅ modules/*/organisms CAN import core/molecules, core/organisms
✅ Any layer in modules/feature can import from core/
```

**Key Rules:**

- Use `"use client"` only when necessary (state, effects, event handlers)
- Props are TypeScript interfaces
- Tailwind CSS + shadcn/ui components only
- Single responsibility per component

### 3.4. Backend Utilities

**Location:** `src/app/api/core/utils/`

- **db/prisma.ts** → Singleton Prisma client (globalThis pattern, MongoDB connection)
- **db/pinecone.ts** → Vector search index initialization
- **embedding.ts** → Generate embeddings for notes + retrieve relevant context
- **chat.ts** → Gemini format conversion, context building for RAG
- **string.ts** → Vietnamese text normalization, search matching
- **validation/note.ts** → Zod schemas for all note operations

### 3.5. Authentication (NextAuth)

**Configuration Location:** `src/app/api/(modules)/auth/auth.config.ts`

**Features:**

- **Google OAuth**: Automatic user creation/linking via PrismaAdapter
- **Credentials (Email/Password)**: Manual signup → bcryptjs hashing → login with email + password
- **Session Strategy**: JWT (30-day expiry)
- **User Model**: MongoDB-backed (Prisma adapter)

**Auth Flow:**

1. User signs up (email/password) → password hashed with bcryptjs → stored in DB
2. User logs in → credentials validated → NextAuth JWT session created
3. API routes access session via `getServerSession(authOptions)`
4. Frontend accesses `useSession()` (client-side)

**Protected Routes:**

```typescript
// API route example
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(modules)/auth/auth.config";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // User is authenticated
}

// Client component example
"use client";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Loading />;
  if (!session) return <Redirect to="/sign-in" />;
  return <h1>Welcome {session.user.name}</h1>;
}
```

### 3.6. Internationalization (i18next)

**Structure:** `src/app/(frontend)/core/config/i18next.config.ts` + locale files

**Implementation:**

```typescript
// config/i18next.config.ts (Initialization)
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/translation.json";
import vi from "@/locales/vi/translation.json";

i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

// locales/en/translation.json
{ "navbar": { "appName": "Smart Notes" }, "notes": { "empty": "No notes yet" } }
```

**Usage in Components:**

```typescript
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1>{t("navbar.appName")}</h1>
      <button onClick={() => i18n.changeLanguage("vi")}>Tiếng Việt</button>
    </div>
  );
}
```

**How it works:**

- `useTranslation()` hook provides `t()` function to access translations
- `i18n.changeLanguage()` switches language → all components re-render
- Translation keys are nested objects: `t("navbar.appName")`

## 4. Code Standards

### 4.1. Next.js Components

**Server Components (default):**

```typescript
export default async function NotesPage() {
  const notes = await prisma.note.findMany();
  return <div>{notes}</div>;
}
```

**Client Components (use "use client" only when needed):**

```typescript
"use client";
import { useState } from "react";
export default function NoteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Import Ordering (CRITICAL):**

```typescript
// 1. Third-party packages (React, Next.js, external libraries)
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

// 2. Custom imports from repo (alphabetically by path)
import { Button } from "@/app/(frontend)/core/components/atoms/Button";
import { useLanguageStore } from "@/app/(frontend)/core/store/useLanguageStore";
import { apiClient } from "@/app/(frontend)/core/utils/api";
import type { Note } from "@/types/note";
```

**Key Rules:**

- Third-party packages → Custom imports
- Custom imports alphabetically by full path
- Group `import type` with other imports but after values
- Use `@/` alias for all repo imports (never relative paths)

### 4.2. State Management (Zustand)

```typescript
export const useLanguageStore = create<State>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (l) => set({ locale: l }),
    }),
    { name: "language-storage" },
  ),
);
export const useLocale = () => useLanguageStore((s) => s.locale);
```

### 4.3. Forms (React Hook Form + Zod)

```typescript
const schema = z.object({ title: z.string().min(1) });
type FormData = z.infer<typeof schema>;

export default function NoteForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit" disabled={isSubmitting}>Save</button>
    </form>
  );
}
```
