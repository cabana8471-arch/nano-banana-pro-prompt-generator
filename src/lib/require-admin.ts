import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/authorization";

type RequireAdminResult =
  | { error: string; status: number; session: null }
  | { error: null; status: null; session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> };

/**
 * Check if the current user is an admin.
 * Shared utility for all admin API routes.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401, session: null };
  }

  const isAdmin = isAdminEmail(session.user.email);
  if (!isAdmin) {
    return { error: "Forbidden: Admin access required", status: 403, session: null };
  }

  return { error: null, status: null, session };
}
