"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/hooks/use-admin";
import type { AdminUser, UserRole } from "@/lib/types/admin";
import { UserEditDialog } from "./user-edit-dialog";
import { UserTable } from "./user-table";

export function UsersTab() {
  const {
    users: usersState,
    loadUsers,
    updateUserRole,
    setUserBlocked,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "blocked" | "all">("all");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load users on mount and when filters change
  useEffect(() => {
    const params = {
      page: usersState.pagination.page,
      pageSize: usersState.pagination.pageSize,
      role: roleFilter,
      status: statusFilter,
      ...(search && { search }),
    };
    loadUsers(params);
  }, [loadUsers, search, roleFilter, statusFilter, usersState.pagination.page, usersState.pagination.pageSize]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    const params = {
      page: newPage,
      pageSize: usersState.pagination.pageSize,
      role: roleFilter,
      status: statusFilter,
      ...(search && { search }),
    };
    loadUsers(params);
  };

  const handleSaveUser = async (
    userId: string,
    updates: { role?: UserRole; isBlocked?: boolean }
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      let success = true;

      if (updates.role !== undefined) {
        success = await updateUserRole(userId, updates.role);
      }

      if (success && updates.isBlocked !== undefined) {
        success = await setUserBlocked(userId, updates.isBlocked);
      }

      return success;
    } finally {
      setIsSaving(false);
    }
  };

  const { pagination } = usersState;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | "all")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "active" | "blocked" | "all")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {usersState.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {usersState.error}
        </div>
      )}

      {/* User Table */}
      <UserTable
        users={usersState.users}
        isLoading={usersState.isLoading}
        onEditUser={setEditingUser}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <UserEditDialog
        user={editingUser}
        open={editingUser !== null}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSave={handleSaveUser}
        isSaving={isSaving}
      />
    </div>
  );
}
