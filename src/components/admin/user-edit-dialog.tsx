"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AdminUser, UserRole } from "@/lib/types/admin";

interface UserEditDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, updates: { role?: UserRole; isBlocked?: boolean }) => Promise<boolean>;
  isSaving: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: UserEditDialogProps) {
  const [role, setRole] = useState<UserRole>("user");
  const [isBlocked, setIsBlocked] = useState(false);

  // Update local state when user changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && user) {
      setRole(user.role);
      setIsBlocked(user.isBlocked);
    }
    onOpenChange(newOpen);
  };

  const handleSave = async () => {
    if (!user) return;

    const updates: { role?: UserRole; isBlocked?: boolean } = {};

    if (role !== user.role) {
      updates.role = role;
    }

    if (isBlocked !== user.isBlocked) {
      updates.isBlocked = isBlocked;
    }

    if (Object.keys(updates).length === 0) {
      onOpenChange(false);
      return;
    }

    const success = await onSave(user.id, updates);
    if (success) {
      onOpenChange(false);
    }
  };

  if (!user) return null;

  // Users with admin role are protected (role synced from ADMIN_EMAILS on login)
  // The backend will reject attempts to change these users anyway
  const isProtectedAdmin = user.role === "admin";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user role and status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <Label>Role</Label>
            {isProtectedAdmin ? (
              <div className="flex items-center gap-2">
                <Badge>admin</Badge>
                <span className="text-xs text-muted-foreground">
                  (Protected by ADMIN_EMAILS)
                </span>
              </div>
            ) : (
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Block Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block User</Label>
              <div className="text-xs text-muted-foreground">
                Blocked users cannot access the application
              </div>
            </div>
            <Switch
              checked={isBlocked}
              onCheckedChange={setIsBlocked}
              disabled={isProtectedAdmin}
            />
          </div>

          {isProtectedAdmin && isBlocked && (
            <p className="text-xs text-destructive">
              Admin email users cannot be blocked
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
