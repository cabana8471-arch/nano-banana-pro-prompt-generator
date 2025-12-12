"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { AllowlistAddDialog } from "./allowlist-add-dialog";
import { AllowlistTable } from "./allowlist-table";

export function AllowlistTab() {
  const {
    allowlist: allowlistState,
    loadAllowlist,
    addToAllowlist,
    removeFromAllowlist,
  } = useAdmin();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Load allowlist on mount
  useEffect(() => {
    loadAllowlist();
  }, [loadAllowlist]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {allowlistState.emails.length} email
          {allowlistState.emails.length !== 1 ? "s" : ""} in allowlist
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Email
        </Button>
      </div>

      {/* Error Message */}
      {allowlistState.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {allowlistState.error}
        </div>
      )}

      {/* Allowlist Table */}
      <AllowlistTable
        emails={allowlistState.emails}
        isLoading={allowlistState.isLoading}
        onDelete={removeFromAllowlist}
      />

      {/* Add Dialog */}
      <AllowlistAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addToAllowlist}
      />
    </div>
  );
}
