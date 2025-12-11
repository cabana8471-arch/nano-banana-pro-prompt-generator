import { db } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import {
  allowedEmails,
  invitationCodes,
  userAccessStatus,
  user,
} from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * Get the list of admin emails from environment variable
 */
export function getAdminEmails(): string[] {
  try {
    const env = getServerEnv();
    if (!env.ADMIN_EMAILS) {
      return [];
    }
    return env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase());
  } catch {
    return [];
  }
}

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Check if an email is in the allowlist table
 */
export async function isEmailAllowed(email: string): Promise<boolean> {
  const result = await db
    .select({ id: allowedEmails.id })
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email.toLowerCase()))
    .limit(1);

  return result.length > 0;
}

/**
 * Check if a user is authorized (has access status record with isAuthorized = true)
 */
export async function isUserAuthorized(userId: string): Promise<boolean> {
  const result = await db
    .select({ isAuthorized: userAccessStatus.isAuthorized })
    .from(userAccessStatus)
    .where(eq(userAccessStatus.userId, userId))
    .limit(1);

  const firstResult = result[0];
  return result.length > 0 && firstResult !== undefined && firstResult.isAuthorized;
}

/**
 * Get user authorization status with details
 */
export async function getUserAuthorizationStatus(userId: string): Promise<{
  isAuthorized: boolean;
  authorizedVia: string | null;
  authorizedAt: Date | null;
} | null> {
  const result = await db
    .select({
      isAuthorized: userAccessStatus.isAuthorized,
      authorizedVia: userAccessStatus.authorizedVia,
      authorizedAt: userAccessStatus.authorizedAt,
    })
    .from(userAccessStatus)
    .where(eq(userAccessStatus.userId, userId))
    .limit(1);

  const firstResult = result[0];
  return firstResult ?? null;
}

/**
 * Authorize a user via the allowlist (auto-authorization for users on the list)
 * Returns true if the user was authorized, false if they're not on the list
 */
export async function authorizeUserViaAllowlist(userId: string): Promise<boolean> {
  // First, get the user's email
  const userResult = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  const firstUser = userResult[0];
  if (!firstUser) {
    return false;
  }

  const userEmail = firstUser.email;

  // Check if email is in allowlist
  const isAllowed = await isEmailAllowed(userEmail);

  if (!isAllowed) {
    return false;
  }

  // Create or update user access status
  const existingStatus = await db
    .select({ id: userAccessStatus.id })
    .from(userAccessStatus)
    .where(eq(userAccessStatus.userId, userId))
    .limit(1);

  if (existingStatus.length > 0) {
    await db
      .update(userAccessStatus)
      .set({
        isAuthorized: true,
        authorizedVia: "allowlist",
        authorizedAt: new Date(),
      })
      .where(eq(userAccessStatus.userId, userId));
  } else {
    await db.insert(userAccessStatus).values({
      userId,
      isAuthorized: true,
      authorizedVia: "allowlist",
      authorizedAt: new Date(),
    });
  }

  return true;
}

/**
 * Generate a unique 8-character invitation code
 */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding I, O, 0, 1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Options for generating an invitation code
 */
export interface GenerateCodeOptions {
  maxUses?: number;
  expiresAt?: Date | null;
}

/**
 * Generate a new invitation code
 */
export async function generateInvitationCode(
  createdBy: string,
  options: GenerateCodeOptions = {}
): Promise<{
  code: string;
  id: string;
  maxUses: number;
  expiresAt: Date | null;
}> {
  const { maxUses = 1, expiresAt = null } = options;

  // Generate a unique code (retry if collision)
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateCode();
    const existing = await db
      .select({ id: invitationCodes.id })
      .from(invitationCodes)
      .where(eq(invitationCodes.code, code))
      .limit(1);

    if (existing.length === 0) {
      break;
    }

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique invitation code");
    }
  } while (true);

  const result = await db
    .insert(invitationCodes)
    .values({
      code,
      createdBy,
      maxUses,
      expiresAt,
    })
    .returning({
      id: invitationCodes.id,
      code: invitationCodes.code,
      maxUses: invitationCodes.maxUses,
      expiresAt: invitationCodes.expiresAt,
    });

  const inserted = result[0];
  if (!inserted) {
    throw new Error("Failed to insert invitation code");
  }

  return inserted;
}

/**
 * Redeem an invitation code for a user
 * Returns success status and error message if failed
 */
export async function redeemInvitationCode(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  // Normalize code
  const normalizedCode = code.toUpperCase().trim();

  // Find the invitation code
  const codeResult = await db
    .select({
      id: invitationCodes.id,
      maxUses: invitationCodes.maxUses,
      currentUses: invitationCodes.currentUses,
      isActive: invitationCodes.isActive,
      expiresAt: invitationCodes.expiresAt,
    })
    .from(invitationCodes)
    .where(eq(invitationCodes.code, normalizedCode))
    .limit(1);

  const invCode = codeResult[0];
  if (!invCode) {
    return { success: false, error: "Invalid invitation code" };
  }

  // Check if code is active
  if (!invCode.isActive) {
    return { success: false, error: "This invitation code has been deactivated" };
  }

  // Check if code is expired
  if (invCode.expiresAt && invCode.expiresAt < new Date()) {
    return { success: false, error: "This invitation code has expired" };
  }

  // Check if code has remaining uses
  if (invCode.currentUses >= invCode.maxUses) {
    return { success: false, error: "This invitation code has reached its maximum uses" };
  }

  // Check if user is already authorized
  const existingAuth = await isUserAuthorized(userId);
  if (existingAuth) {
    return { success: false, error: "You are already authorized" };
  }

  // Increment code usage
  await db
    .update(invitationCodes)
    .set({
      currentUses: invCode.currentUses + 1,
      redeemedBy: userId,
      redeemedAt: new Date(),
    })
    .where(eq(invitationCodes.id, invCode.id));

  // Create or update user access status
  const existingStatus = await db
    .select({ id: userAccessStatus.id })
    .from(userAccessStatus)
    .where(eq(userAccessStatus.userId, userId))
    .limit(1);

  if (existingStatus.length > 0) {
    await db
      .update(userAccessStatus)
      .set({
        isAuthorized: true,
        authorizedVia: "invitation_code",
        invitationCodeId: invCode.id,
        authorizedAt: new Date(),
      })
      .where(eq(userAccessStatus.userId, userId));
  } else {
    await db.insert(userAccessStatus).values({
      userId,
      isAuthorized: true,
      authorizedVia: "invitation_code",
      invitationCodeId: invCode.id,
      authorizedAt: new Date(),
    });
  }

  return { success: true };
}

/**
 * Get all invitation codes for admin management
 */
export async function getAllInvitationCodes(): Promise<
  {
    id: string;
    code: string;
    createdBy: string;
    creatorEmail: string;
    maxUses: number;
    currentUses: number;
    isActive: boolean;
    expiresAt: Date | null;
    createdAt: Date;
  }[]
> {
  const result = await db
    .select({
      id: invitationCodes.id,
      code: invitationCodes.code,
      createdBy: invitationCodes.createdBy,
      creatorEmail: user.email,
      maxUses: invitationCodes.maxUses,
      currentUses: invitationCodes.currentUses,
      isActive: invitationCodes.isActive,
      expiresAt: invitationCodes.expiresAt,
      createdAt: invitationCodes.createdAt,
    })
    .from(invitationCodes)
    .leftJoin(user, eq(invitationCodes.createdBy, user.id))
    .orderBy(invitationCodes.createdAt);

  return result.map((row) => ({
    ...row,
    creatorEmail: row.creatorEmail || "Unknown",
  }));
}

/**
 * Get all allowed emails for admin management
 */
export async function getAllAllowedEmails(): Promise<
  {
    id: string;
    email: string;
    addedBy: string | null;
    adderEmail: string | null;
    note: string | null;
    createdAt: Date;
  }[]
> {
  const result = await db
    .select({
      id: allowedEmails.id,
      email: allowedEmails.email,
      addedBy: allowedEmails.addedBy,
      adderEmail: user.email,
      note: allowedEmails.note,
      createdAt: allowedEmails.createdAt,
    })
    .from(allowedEmails)
    .leftJoin(user, eq(allowedEmails.addedBy, user.id))
    .orderBy(allowedEmails.createdAt);

  return result;
}

/**
 * Add an email to the allowlist
 */
export async function addEmailToAllowlist(
  email: string,
  addedBy: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already exists
  const existing = await db
    .select({ id: allowedEmails.id })
    .from(allowedEmails)
    .where(eq(allowedEmails.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "Email is already in the allowlist" };
  }

  await db.insert(allowedEmails).values({
    email: normalizedEmail,
    addedBy,
    note: note || null,
  });

  return { success: true };
}

/**
 * Remove an email from the allowlist
 */
export async function removeEmailFromAllowlist(
  emailId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .delete(allowedEmails)
    .where(eq(allowedEmails.id, emailId))
    .returning({ id: allowedEmails.id });

  if (result.length === 0) {
    return { success: false, error: "Email not found in allowlist" };
  }

  return { success: true };
}

/**
 * Activate or deactivate an invitation code
 */
export async function setInvitationCodeActive(
  codeId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .update(invitationCodes)
    .set({ isActive })
    .where(eq(invitationCodes.id, codeId))
    .returning({ id: invitationCodes.id });

  if (result.length === 0) {
    return { success: false, error: "Invitation code not found" };
  }

  return { success: true };
}
