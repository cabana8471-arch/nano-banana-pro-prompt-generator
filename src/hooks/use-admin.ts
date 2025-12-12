"use client";

import { useState, useCallback } from "react";
import type {
  AdminUser,
  UserPagination,
  UserRole,
  InvitationCode,
  AllowedEmail,
  BlockedIp,
  IpType,
} from "@/lib/types/admin";

// ==========================================
// Types
// ==========================================

interface UsersState {
  users: AdminUser[];
  pagination: UserPagination;
  isLoading: boolean;
  error: string | null;
}

interface InvitationsState {
  invitations: InvitationCode[];
  isLoading: boolean;
  error: string | null;
}

interface AllowlistState {
  emails: AllowedEmail[];
  isLoading: boolean;
  error: string | null;
}

interface BlockedIpsState {
  blockedIps: BlockedIp[];
  isLoading: boolean;
  error: string | null;
}

interface LoadUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "all";
  status?: "active" | "blocked" | "all";
}

interface CreateInvitationOptions {
  maxUses?: number;
  expiresAt?: Date | null;
}

interface BlockIpOptions {
  ipAddress: string;
  ipType?: IpType;
  reason?: string;
  expiresAt?: Date | null;
}

interface UseAdminReturn {
  // Users
  users: UsersState;
  loadUsers: (params?: LoadUsersParams) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  setUserBlocked: (userId: string, isBlocked: boolean) => Promise<boolean>;

  // Invitations
  invitations: InvitationsState;
  loadInvitations: () => Promise<void>;
  createInvitation: (options?: CreateInvitationOptions) => Promise<{ code: string; id: string } | null>;
  toggleInvitationActive: (id: string, isActive: boolean) => Promise<boolean>;
  deleteInvitation: (id: string) => Promise<boolean>;

  // Allowlist
  allowlist: AllowlistState;
  loadAllowlist: () => Promise<void>;
  addToAllowlist: (email: string, note?: string) => Promise<boolean>;
  removeFromAllowlist: (id: string) => Promise<boolean>;

  // Blocked IPs
  blockedIps: BlockedIpsState;
  loadBlockedIps: () => Promise<void>;
  blockIp: (options: BlockIpOptions) => Promise<boolean>;
  toggleIpBlockActive: (id: string, isActive: boolean) => Promise<boolean>;
  removeIpBlock: (id: string) => Promise<boolean>;

  // Utilities
  clearErrors: () => void;
}

// ==========================================
// Hook
// ==========================================

export function useAdmin(): UseAdminReturn {
  // Users state
  const [usersState, setUsersState] = useState<UsersState>({
    users: [],
    pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
    isLoading: false,
    error: null,
  });

  // Invitations state
  const [invitationsState, setInvitationsState] = useState<InvitationsState>({
    invitations: [],
    isLoading: false,
    error: null,
  });

  // Allowlist state
  const [allowlistState, setAllowlistState] = useState<AllowlistState>({
    emails: [],
    isLoading: false,
    error: null,
  });

  // Blocked IPs state
  const [blockedIpsState, setBlockedIpsState] = useState<BlockedIpsState>({
    blockedIps: [],
    isLoading: false,
    error: null,
  });

  // ==========================================
  // User Management Actions
  // ==========================================

  const loadUsers = useCallback(async (params: LoadUsersParams = {}) => {
    try {
      setUsersState((prev) => ({ ...prev, isLoading: true, error: null }));

      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());
      if (params.search) searchParams.set("search", params.search);
      if (params.role) searchParams.set("role", params.role);
      if (params.status) searchParams.set("status", params.status);

      const response = await fetch(`/api/admin/users?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsersState((prev) => ({
        ...prev,
        users: data.users,
        pagination: data.pagination,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch users";
      setUsersState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      setUsersState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role");
      }

      // Update user in state
      setUsersState((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === userId ? { ...user, role } : user
        ),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user role";
      setUsersState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  const setUserBlocked = useCallback(async (userId: string, isBlocked: boolean): Promise<boolean> => {
    try {
      setUsersState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isBlocked }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user blocked status");
      }

      // Update user in state
      setUsersState((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === userId ? { ...user, isBlocked } : user
        ),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user blocked status";
      setUsersState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  // ==========================================
  // Invitation Management Actions
  // ==========================================

  const loadInvitations = useCallback(async () => {
    try {
      setInvitationsState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/admin/invitation-codes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch invitations");
      }

      setInvitationsState({
        invitations: data.codes,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch invitations";
      setInvitationsState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const createInvitation = useCallback(
    async (options: CreateInvitationOptions = {}): Promise<{ code: string; id: string } | null> => {
      try {
        setInvitationsState((prev) => ({ ...prev, error: null }));

        const body: Record<string, unknown> = {};
        if (options.maxUses !== undefined) body.maxUses = options.maxUses;
        if (options.expiresAt) body.expiresAt = options.expiresAt.toISOString();

        const response = await fetch("/api/admin/invitation-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create invitation");
        }

        // Reload invitations to get the full list
        await loadInvitations();

        return { code: data.code, id: data.id };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create invitation";
        setInvitationsState((prev) => ({ ...prev, error: message }));
        return null;
      }
    },
    [loadInvitations]
  );

  const toggleInvitationActive = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setInvitationsState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/invitation-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update invitation");
      }

      // Update invitation in state
      setInvitationsState((prev) => ({
        ...prev,
        invitations: prev.invitations.map((inv) =>
          inv.id === id ? { ...inv, isActive } : inv
        ),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update invitation";
      setInvitationsState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  const deleteInvitation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setInvitationsState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/invitation-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete invitation");
      }

      // Remove invitation from state
      setInvitationsState((prev) => ({
        ...prev,
        invitations: prev.invitations.filter((inv) => inv.id !== id),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete invitation";
      setInvitationsState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  // ==========================================
  // Allowlist Management Actions
  // ==========================================

  const loadAllowlist = useCallback(async () => {
    try {
      setAllowlistState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/admin/allowlist");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch allowlist");
      }

      setAllowlistState({
        emails: data.emails,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch allowlist";
      setAllowlistState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const addToAllowlist = useCallback(
    async (email: string, note?: string): Promise<boolean> => {
      try {
        setAllowlistState((prev) => ({ ...prev, error: null }));

        const body: Record<string, string> = { email };
        if (note) body.note = note;

        const response = await fetch("/api/admin/allowlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to add email to allowlist");
        }

        // Reload allowlist to get the full entry with creator info
        await loadAllowlist();

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add email to allowlist";
        setAllowlistState((prev) => ({ ...prev, error: message }));
        return false;
      }
    },
    [loadAllowlist]
  );

  const removeFromAllowlist = useCallback(async (id: string): Promise<boolean> => {
    try {
      setAllowlistState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/allowlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove email from allowlist");
      }

      // Remove email from state
      setAllowlistState((prev) => ({
        ...prev,
        emails: prev.emails.filter((e) => e.id !== id),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove email from allowlist";
      setAllowlistState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  // ==========================================
  // IP Blocking Actions
  // ==========================================

  const loadBlockedIps = useCallback(async () => {
    try {
      setBlockedIpsState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/admin/blocked-ips");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blocked IPs");
      }

      setBlockedIpsState({
        blockedIps: data.blockedIps,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch blocked IPs";
      setBlockedIpsState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const blockIp = useCallback(
    async (options: BlockIpOptions): Promise<boolean> => {
      try {
        setBlockedIpsState((prev) => ({ ...prev, error: null }));

        const body: Record<string, unknown> = {
          ipAddress: options.ipAddress,
        };
        if (options.ipType) body.ipType = options.ipType;
        if (options.reason) body.reason = options.reason;
        if (options.expiresAt) body.expiresAt = options.expiresAt.toISOString();

        const response = await fetch("/api/admin/blocked-ips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to block IP");
        }

        // Reload blocked IPs to get the full entry
        await loadBlockedIps();

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to block IP";
        setBlockedIpsState((prev) => ({ ...prev, error: message }));
        return false;
      }
    },
    [loadBlockedIps]
  );

  const toggleIpBlockActive = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setBlockedIpsState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/blocked-ips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update IP block");
      }

      // Update blocked IP in state
      setBlockedIpsState((prev) => ({
        ...prev,
        blockedIps: prev.blockedIps.map((ip) =>
          ip.id === id ? { ...ip, isActive } : ip
        ),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update IP block";
      setBlockedIpsState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  const removeIpBlock = useCallback(async (id: string): Promise<boolean> => {
    try {
      setBlockedIpsState((prev) => ({ ...prev, error: null }));

      const response = await fetch("/api/admin/blocked-ips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove IP block");
      }

      // Remove blocked IP from state
      setBlockedIpsState((prev) => ({
        ...prev,
        blockedIps: prev.blockedIps.filter((ip) => ip.id !== id),
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove IP block";
      setBlockedIpsState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  // ==========================================
  // Utilities
  // ==========================================

  const clearErrors = useCallback(() => {
    setUsersState((prev) => ({ ...prev, error: null }));
    setInvitationsState((prev) => ({ ...prev, error: null }));
    setAllowlistState((prev) => ({ ...prev, error: null }));
    setBlockedIpsState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Users
    users: usersState,
    loadUsers,
    updateUserRole,
    setUserBlocked,

    // Invitations
    invitations: invitationsState,
    loadInvitations,
    createInvitation,
    toggleInvitationActive,
    deleteInvitation,

    // Allowlist
    allowlist: allowlistState,
    loadAllowlist,
    addToAllowlist,
    removeFromAllowlist,

    // Blocked IPs
    blockedIps: blockedIpsState,
    loadBlockedIps,
    blockIp,
    toggleIpBlockActive,
    removeIpBlock,

    // Utilities
    clearErrors,
  };
}
