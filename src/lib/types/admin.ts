// ==========================================
// Admin Settings - TypeScript Types
// ==========================================

// User Role Types
export type UserRole = "admin" | "user";

// User Status Types
export type UserStatus = "active" | "blocked";

// IP Type for blocked IPs
export type IpType = "single" | "range";

// Invitation Status
export type InvitationStatus = "active" | "inactive" | "expired" | "exhausted";

// Authorization Via
export type AuthorizedVia = "allowlist" | "invitation_code";

// ==========================================
// Admin User Types
// ==========================================

/**
 * Admin user with role, block status, and login info
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  isBlocked: boolean;
  createdAt: Date;
  lastLogin: {
    loginAt: Date;
    ipAddress: string | null;
  } | null;
}

/**
 * Pagination metadata for user listing
 */
export interface UserPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated users response
 */
export interface UsersResponse {
  users: AdminUser[];
  pagination: UserPagination;
}

/**
 * Parameters for fetching users
 */
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
}

/**
 * Parameters for updating a user
 */
export interface UpdateUserParams {
  userId: string;
  role?: UserRole;
  isBlocked?: boolean;
}

// ==========================================
// Login History Types
// ==========================================

/**
 * Login history entry
 */
export interface LoginHistoryEntry {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  loginAt: Date;
}

/**
 * Paginated login history response
 */
export interface LoginHistoryResponse {
  entries: LoginHistoryEntry[];
  pagination: UserPagination;
}

/**
 * Parameters for fetching login history
 */
export interface GetLoginHistoryParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

// ==========================================
// Blocked IP Types
// ==========================================

/**
 * Blocked IP entry
 */
export interface BlockedIp {
  id: string;
  ipAddress: string;
  ipType: IpType;
  reason: string | null;
  blockedBy: string | null;
  blockedByEmail: string | null;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

/**
 * Options for blocking an IP
 */
export interface BlockIpOptions {
  ipAddress: string;
  ipType?: IpType;
  reason?: string;
  expiresAt?: Date | null;
}

/**
 * Response for blocked IPs listing
 */
export interface BlockedIpsResponse {
  blockedIps: BlockedIp[];
}

// ==========================================
// Invitation Code Types
// ==========================================

/**
 * Invitation code with creator info
 */
export interface InvitationCode {
  id: string;
  code: string;
  createdBy: string;
  creatorEmail: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

/**
 * Computed invitation status
 */
export function getInvitationStatus(invitation: InvitationCode): InvitationStatus {
  if (!invitation.isActive) {
    return "inactive";
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return "expired";
  }
  if (invitation.currentUses >= invitation.maxUses) {
    return "exhausted";
  }
  return "active";
}

/**
 * Options for creating an invitation code
 */
export interface CreateInvitationOptions {
  maxUses?: number;
  expiresAt?: Date | null;
}

/**
 * Response for invitation codes listing
 */
export interface InvitationCodesResponse {
  invitations: InvitationCode[];
}

// ==========================================
// Allowed Email Types
// ==========================================

/**
 * Allowed email entry
 */
export interface AllowedEmail {
  id: string;
  email: string;
  addedBy: string | null;
  adderEmail: string | null;
  note: string | null;
  createdAt: Date;
}

/**
 * Options for adding an email to allowlist
 */
export interface AddAllowedEmailOptions {
  email: string;
  note?: string;
}

/**
 * Response for allowlist
 */
export interface AllowlistResponse {
  emails: AllowedEmail[];
}

// ==========================================
// Admin API Response Types
// ==========================================

/**
 * Generic success/error response
 */
export interface AdminActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Admin check response
 */
export interface AdminCheckResponse {
  isAdmin: boolean;
}

/**
 * IP check response
 */
export interface IpCheckResponse {
  isBlocked: boolean;
  reason?: string;
}
