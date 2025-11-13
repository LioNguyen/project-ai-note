"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Client-side wrapper for NextAuth SessionProvider
 * This component must be a client component as SessionProvider uses React Context
 *
 * Note: refetchOnWindowFocus is set to false to prevent unnecessary refetches
 * and avoid potential redirect loops during trial mode
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </NextAuthSessionProvider>
  );
}
