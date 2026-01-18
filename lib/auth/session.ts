// Session helper functions
// Utilities for working with NextAuth sessions

import { auth } from "./config";

/**
 * Get the current server session
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return (session?.user as { id?: string })?.id || null;
}
