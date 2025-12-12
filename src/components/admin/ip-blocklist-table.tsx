"use client";

import { useState } from "react";
import { Trash2Icon, ToggleLeftIcon, ToggleRightIcon } from "lucide-react";
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
import type { BlockedIp } from "@/lib/types/admin";

interface IpBlocklistTableProps {
  blockedIps: BlockedIp[];
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

function getStatusLabel(ip: BlockedIp): { label: string; variant: "default" | "secondary" | "destructive" } {
  // Check if expired
  if (ip.expiresAt && new Date(ip.expiresAt) < new Date()) {
    return { label: "Expired", variant: "destructive" };
  }
  // Check if active
  if (ip.isActive) {
    return { label: "Active", variant: "default" };
  }
  return { label: "Inactive", variant: "secondary" };
}

export function IpBlocklistTable({
  blockedIps,
  isLoading,
  onToggleActive,
  onDelete,
}: IpBlocklistTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (blockedIps.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No blocked IPs
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Address</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Blocked By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blockedIps.map((ip) => {
          const status = getStatusLabel(ip);
          const isActionDisabled = actionLoading === ip.id;

          return (
            <TableRow key={ip.id}>
              <TableCell>
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  {ip.ipAddress}
                </code>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ip.ipType}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {ip.reason || "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ip.blockedByEmail || "Unknown"}
              </TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(ip.expiresAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggle(ip.id, ip.isActive)}
                    disabled={isActionDisabled}
                  >
                    {ip.isActive ? (
                      <ToggleRightIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeftIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(ip.id)}
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
