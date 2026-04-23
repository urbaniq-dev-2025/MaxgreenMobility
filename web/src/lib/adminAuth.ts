import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "mg_admin";

// Hardcoded credentials (as requested).
// If you later want this configurable, we can switch to env vars.
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "maxgreen123";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === "1";
}

