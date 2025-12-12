"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { InvitationCreateDialog } from "./invitation-create-dialog";
import { InvitationTable } from "./invitation-table";

export function InvitationsTab() {
  const {
    invitations: invitationsState,
    loadInvitations,
    createInvitation,
    toggleInvitationActive,
    deleteInvitation,
  } = useAdmin();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load invitations on mount
  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {invitationsState.invitations.length} invitation code
          {invitationsState.invitations.length !== 1 ? "s" : ""}
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Code
        </Button>
      </div>

      {/* Error Message */}
      {invitationsState.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {invitationsState.error}
        </div>
      )}

      {/* Invitations Table */}
      <InvitationTable
        invitations={invitationsState.invitations}
        isLoading={invitationsState.isLoading}
        onToggleActive={toggleInvitationActive}
        onDelete={deleteInvitation}
      />

      {/* Create Dialog */}
      <InvitationCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={createInvitation}
      />
    </div>
  );
}
