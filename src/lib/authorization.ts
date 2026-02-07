import { randomBytes } from "crypto";
import { eq, and, or, ilike, sql, desc, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import {
  allowedEmails,
  invitationCodes,
  userAccessStatus,
  user,
  userLoginHistory,
  blockedIps,
} from "@/lib/schema";
import type {
  AdminUser,
  GetUsersParams,
  UsersResponse,
  UserRole,
} from "@/lib/types/admin";
import { escapeLikePattern } from "@/lib/utils";

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
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i]! % chars.length];
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

  return db.transaction(async (tx) => {
    // Find the invitation code
    const codeResult = await tx
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

    // Check if user is already authorized
    const existingAuth = await tx
      .select({ isAuthorized: userAccessStatus.isAuthorized })
      .from(userAccessStatus)
      .where(eq(userAccessStatus.userId, userId))
      .limit(1);

    if (existingAuth[0]?.isAuthorized) {
      return { success: false, error: "You are already authorized" };
    }

    const updated = await tx
      .update(invitationCodes)
      .set({
        currentUses: sql`${invitationCodes.currentUses} + 1`,
        redeemedBy: userId,
        redeemedAt: new Date(),
      })
      .where(
        and(
          eq(invitationCodes.id, invCode.id),
          eq(invitationCodes.isActive, true),
          lt(invitationCodes.currentUses, invitationCodes.maxUses)
        )
      )
      .returning({ id: invitationCodes.id });

    if (updated.length === 0) {
      return { success: false, error: "This invitation code has reached its maximum uses" };
    }

    // Create or update user access status
    const existingStatus = await tx
      .select({ id: userAccessStatus.id })
      .from(userAccessStatus)
      .where(eq(userAccessStatus.userId, userId))
      .limit(1);

    if (existingStatus.length > 0) {
      await tx
        .update(userAccessStatus)
        .set({
          isAuthorized: true,
          authorizedVia: "invitation_code",
          invitationCodeId: invCode.id,
          authorizedAt: new Date(),
        })
        .where(eq(userAccessStatus.userId, userId));
    } else {
      await tx.insert(userAccessStatus).values({
        userId,
        isAuthorized: true,
        authorizedVia: "invitation_code",
        invitationCodeId: invCode.id,
        authorizedAt: new Date(),
      });
    }

    return { success: true };
  });
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

// ==========================================
// User Management Functions
// ==========================================

/**
 * Get all users with pagination, search, and filtering
 */
export async function getAllUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const { page = 1, pageSize = 20, search, role, status } = params;
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(user.name, `%${escapeLikePattern(search)}%`),
        ilike(user.email, `%${escapeLikePattern(search)}%`)
      )
    );
  }

  if (role && role !== "all") {
    conditions.push(eq(user.role, role));
  }

  if (status && status !== "all") {
    conditions.push(eq(user.isBlocked, status === "blocked"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(whereClause);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Get users with last login info
  const usersResult = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(pageSize)
    .offset(offset);

  // Get last login for each user
  const userIds = usersResult.map((u) => u.id);
  const lastLogins = userIds.length > 0
    ? await db
        .select({
          userId: userLoginHistory.userId,
          loginAt: userLoginHistory.loginAt,
          ipAddress: userLoginHistory.ipAddress,
        })
        .from(userLoginHistory)
        .where(
          sql`${userLoginHistory.userId} IN ${userIds} AND ${userLoginHistory.loginAt} = (
            SELECT MAX(login_at) FROM user_login_history WHERE user_id = ${userLoginHistory.userId}
          )`
        )
    : [];

  // Map last logins by userId
  const lastLoginMap = new Map(
    lastLogins.map((l) => [l.userId, { loginAt: l.loginAt, ipAddress: l.ipAddress }])
  );

  // Build admin users response
  const users: AdminUser[] = usersResult.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    role: u.role as UserRole,
    isBlocked: u.isBlocked,
    createdAt: u.createdAt,
    lastLogin: lastLoginMap.get(u.id) ?? null,
  }));

  return {
    users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Update a user's role
 * Note: This should NOT be used to grant admin - that's controlled by ADMIN_EMAILS
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; error?: string }> {
  // Check if user exists
  const existingUser = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    return { success: false, error: "User not found" };
  }

  const userEmail = existingUser[0]?.email;

  // Prevent changing admin status for users in ADMIN_EMAILS
  if (userEmail && isAdminEmail(userEmail)) {
    if (role !== "admin") {
      return { success: false, error: "Cannot change role for admin email users" };
    }
    // Already an admin, no change needed
    return { success: true };
  }

  // Update the role
  await db
    .update(user)
    .set({ role })
    .where(eq(user.id, userId));

  return { success: true };
}

/**
 * Block or unblock a user
 */
export async function setUserBlocked(
  userId: string,
  isBlocked: boolean
): Promise<{ success: boolean; error?: string }> {
  // Check if user exists
  const existingUser = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    return { success: false, error: "User not found" };
  }

  const userEmail = existingUser[0]?.email;

  // Prevent blocking users in ADMIN_EMAILS
  if (userEmail && isAdminEmail(userEmail) && isBlocked) {
    return { success: false, error: "Cannot block admin email users" };
  }

  // Update the blocked status
  await db
    .update(user)
    .set({ isBlocked })
    .where(eq(user.id, userId));

  return { success: true };
}

/**
 * Sync user role with ADMIN_EMAILS on login
 * Called during the login process to ensure DB role matches env var
 */
export async function syncUserRoleWithAdminEmails(
  userId: string,
  email: string
): Promise<void> {
  const shouldBeAdmin = isAdminEmail(email);
  const newRole: UserRole = shouldBeAdmin ? "admin" : "user";

  await db
    .update(user)
    .set({ role: newRole })
    .where(eq(user.id, userId));
}

// ==========================================
// Login Tracking Functions
// ==========================================

/**
 * Record a login event for a user
 */
export async function recordLoginEvent(
  userId: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<void> {
  await db.insert(userLoginHistory).values({
    userId,
    ipAddress,
    userAgent,
  });
}

/**
 * Get the last login info for a user
 */
export async function getLastLogin(userId: string): Promise<{
  loginAt: Date;
  ipAddress: string | null;
} | null> {
  const result = await db
    .select({
      loginAt: userLoginHistory.loginAt,
      ipAddress: userLoginHistory.ipAddress,
    })
    .from(userLoginHistory)
    .where(eq(userLoginHistory.userId, userId))
    .orderBy(desc(userLoginHistory.loginAt))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Get login history for a user with pagination
 */
export async function getUserLoginHistory(
  userId: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<{
  entries: {
    id: string;
    userId: string;
    ipAddress: string | null;
    userAgent: string | null;
    loginAt: Date;
  }[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {
  const { page = 1, pageSize = 20 } = params;
  const offset = (page - 1) * pageSize;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(userLoginHistory)
    .where(eq(userLoginHistory.userId, userId));

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // Get login history entries
  const entries = await db
    .select({
      id: userLoginHistory.id,
      userId: userLoginHistory.userId,
      ipAddress: userLoginHistory.ipAddress,
      userAgent: userLoginHistory.userAgent,
      loginAt: userLoginHistory.loginAt,
    })
    .from(userLoginHistory)
    .where(eq(userLoginHistory.userId, userId))
    .orderBy(desc(userLoginHistory.loginAt))
    .limit(pageSize)
    .offset(offset);

  return {
    entries,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

// ==========================================
// IP Blocking Functions
// ==========================================

/**
 * Check if an IP is within a CIDR range
 */
function isIpInRange(ip: string, cidr: string): boolean {
  // Parse IP address to number
  const ipToNumber = (ipAddr: string): number => {
    const parts = ipAddr.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return -1;
    }
    return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
  };

  // Parse CIDR notation (e.g., "192.168.1.0/24")
  const [rangeIp, prefixStr] = cidr.split("/");
  if (!rangeIp || !prefixStr) {
    return false;
  }

  const prefix = parseInt(prefixStr, 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return false;
  }

  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(rangeIp);

  if (ipNum === -1 || rangeNum === -1) {
    return false;
  }

  // Create mask from prefix
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;

  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Check if an IP address is blocked
 */
export async function isIpBlocked(ipAddress: string): Promise<{
  isBlocked: boolean;
  reason?: string;
}> {
  // Get all active blocked IPs (not expired)
  const blockedList = await db
    .select({
      ipAddress: blockedIps.ipAddress,
      ipType: blockedIps.ipType,
      reason: blockedIps.reason,
      expiresAt: blockedIps.expiresAt,
    })
    .from(blockedIps)
    .where(eq(blockedIps.isActive, true));

  const now = new Date();

  for (const blocked of blockedList) {
    // Skip expired blocks
    if (blocked.expiresAt && blocked.expiresAt < now) {
      continue;
    }

    if (blocked.ipType === "single") {
      // Exact match
      if (blocked.ipAddress === ipAddress) {
        return blocked.reason
          ? { isBlocked: true, reason: blocked.reason }
          : { isBlocked: true };
      }
    } else if (blocked.ipType === "range") {
      // CIDR range match
      if (isIpInRange(ipAddress, blocked.ipAddress)) {
        return blocked.reason
          ? { isBlocked: true, reason: blocked.reason }
          : { isBlocked: true };
      }
    }
  }

  return { isBlocked: false };
}

/**
 * Block an IP address
 */
export async function blockIp(
  ipAddress: string,
  blockedBy: string,
  options: {
    ipType?: "single" | "range";
    reason?: string;
    expiresAt?: Date | null;
  } = {}
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { ipType = "single", reason, expiresAt } = options;

  // Validate IP format
  if (ipType === "single") {
    const parts = ipAddress.split(".");
    if (parts.length !== 4 || parts.some((p) => isNaN(Number(p)) || Number(p) < 0 || Number(p) > 255)) {
      return { success: false, error: "Invalid IP address format" };
    }
  } else if (ipType === "range") {
    // Validate CIDR notation
    const [ip, prefix] = ipAddress.split("/");
    if (!ip || !prefix) {
      return { success: false, error: "Invalid CIDR notation. Use format: 192.168.1.0/24" };
    }
    const parts = ip.split(".");
    const prefixNum = parseInt(prefix, 10);
    if (
      parts.length !== 4 ||
      parts.some((p) => isNaN(Number(p)) || Number(p) < 0 || Number(p) > 255) ||
      isNaN(prefixNum) ||
      prefixNum < 0 ||
      prefixNum > 32
    ) {
      return { success: false, error: "Invalid CIDR notation" };
    }
  }

  // Check if IP is already blocked
  const existing = await db
    .select({ id: blockedIps.id })
    .from(blockedIps)
    .where(eq(blockedIps.ipAddress, ipAddress))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "This IP is already in the blocklist" };
  }

  const result = await db
    .insert(blockedIps)
    .values({
      ipAddress,
      ipType,
      reason: reason ?? null,
      blockedBy,
      expiresAt: expiresAt ?? null,
    })
    .returning({ id: blockedIps.id });

  const inserted = result[0];
  if (!inserted) {
    return { success: false, error: "Failed to block IP" };
  }

  return { success: true, id: inserted.id };
}

/**
 * Remove an IP block
 */
export async function unblockIp(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .delete(blockedIps)
    .where(eq(blockedIps.id, id))
    .returning({ id: blockedIps.id });

  if (result.length === 0) {
    return { success: false, error: "Blocked IP not found" };
  }

  return { success: true };
}

/**
 * Activate or deactivate an IP block
 */
export async function setIpBlockActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .update(blockedIps)
    .set({ isActive })
    .where(eq(blockedIps.id, id))
    .returning({ id: blockedIps.id });

  if (result.length === 0) {
    return { success: false, error: "Blocked IP not found" };
  }

  return { success: true };
}

/**
 * Get all blocked IPs for admin management
 */
export async function getAllBlockedIps(): Promise<
  {
    id: string;
    ipAddress: string;
    ipType: string;
    reason: string | null;
    blockedBy: string | null;
    blockedByEmail: string | null;
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date | null;
  }[]
> {
  const result = await db
    .select({
      id: blockedIps.id,
      ipAddress: blockedIps.ipAddress,
      ipType: blockedIps.ipType,
      reason: blockedIps.reason,
      blockedBy: blockedIps.blockedBy,
      blockedByEmail: user.email,
      isActive: blockedIps.isActive,
      createdAt: blockedIps.createdAt,
      expiresAt: blockedIps.expiresAt,
    })
    .from(blockedIps)
    .leftJoin(user, eq(blockedIps.blockedBy, user.id))
    .orderBy(desc(blockedIps.createdAt));

  return result;
}

// ==========================================
// Invitation Code Management
// ==========================================

/**
 * Delete an invitation code
 */
export async function deleteInvitationCode(
  codeId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await db
    .delete(invitationCodes)
    .where(eq(invitationCodes.id, codeId))
    .returning({ id: invitationCodes.id });

  if (result.length === 0) {
    return { success: false, error: "Invitation code not found" };
  }

  return { success: true };
}
