"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, Trash2Icon, ToggleLeftIcon, ToggleRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvitationCode, InvitationStatus } from "@/lib/types/admin";
import { getInvitationStatus } from "@/lib/types/admin";

interface InvitationTableProps {
  invitations: InvitationCode[];
  isLoading: boolean;
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "Never";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadgeVariant(status: InvitationStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "expired":
    case "exhausted":
      return "destructive";
    default:
      return "outline";
  }
}

export function InvitationTable({
  invitations,
  isLoading,
  onToggleActive,
  onDelete,
}: InvitationTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    setActionLoading(id);
    await onToggleActive(id, !currentActive);
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    await onDelete(id);
    setActionLoading(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No invitation codes found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Creator</TableHead>
          <TableHead>Uses</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const status = getInvitationStatus(invitation);
          const isActionDisabled = actionLoading === invitation.id;

          return (
            <TableRow key={invitation.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    {invitation.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(invitation.code, invitation.id)}
                  >
                    {copiedId === invitation.id ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {invitation.creatorEmail}
              </TableCell>
              <TableCell>
                {invitation.currentUses} / {invitation.maxUses}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invitation.expiresAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggle(invitation.id, invitation.isActive)}
                    disabled={isActionDisabled}
                  >
                    {invitation.isActive ? (
                      <ToggleRightIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeftIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(invitation.id)}
                    disabled={isActionDisabled}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
