"use client";

import { useEffect, useState } from "react";
import { ShieldBanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { IpBlockDialog } from "./ip-block-dialog";
import { IpBlocklistTable } from "./ip-blocklist-table";

export function SecurityTab() {
  const {
    blockedIps: blockedIpsState,
    loadBlockedIps,
    blockIp,
    toggleIpBlockActive,
    removeIpBlock,
  } = useAdmin();

  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  // Load blocked IPs on mount
  useEffect(() => {
    loadBlockedIps();
  }, [loadBlockedIps]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {blockedIpsState.blockedIps.length} blocked IP
          {blockedIpsState.blockedIps.length !== 1 ? "s" : ""}
        </div>
        <Button onClick={() => setIsBlockDialogOpen(true)}>
          <ShieldBanIcon className="mr-2 h-4 w-4" />
          Block IP
        </Button>
      </div>

      {/* Error Message */}
      {blockedIpsState.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {blockedIpsState.error}
        </div>
      )}

      {/* IP Blocklist Table */}
      <IpBlocklistTable
        blockedIps={blockedIpsState.blockedIps}
        isLoading={blockedIpsState.isLoading}
        onToggleActive={toggleIpBlockActive}
        onDelete={removeIpBlock}
      />

      {/* Block Dialog */}
      <IpBlockDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        onBlock={blockIp}
      />
    </div>
  );
}
