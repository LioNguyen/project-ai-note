import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the current authenticated user's session
 * This is a server-side utility function
 *
 * @returns The session object with user information or null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current authenticated user's ID
 * This is a convenience function that extracts just the user ID
 *
 * @returns The user ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id || null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes and server components that require auth
 *
 * @returns The user ID
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<string> {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
