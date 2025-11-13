import NextAuth, { DefaultSession } from "next-auth";

/**
 * Module augmentation for NextAuth types
 * Extends the default session to include user ID
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
