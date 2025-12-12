"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvitationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (options: { maxUses?: number; expiresAt?: Date | null }) => Promise<{ code: string; id: string } | null>;
}

export function InvitationCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: InvitationCreateDialogProps) {
  const [maxUses, setMaxUses] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);

    // Validate maxUses
    const maxUsesNum = parseInt(maxUses, 10);
    if (isNaN(maxUsesNum) || maxUsesNum < 1 || maxUsesNum > 1000) {
      setError("Max uses must be between 1 and 1000");
      return;
    }

    // Parse expiration date
    let expiresAtDate: Date | null = null;
    if (expiresAt) {
      expiresAtDate = new Date(expiresAt);
      if (isNaN(expiresAtDate.getTime())) {
        setError("Invalid expiration date");
        return;
      }
      if (expiresAtDate <= new Date()) {
        setError("Expiration date must be in the future");
        return;
      }
    }

    setIsCreating(true);
    const result = await onCreate({
      maxUses: maxUsesNum,
      expiresAt: expiresAtDate,
    });
    setIsCreating(false);

    if (result) {
      // Reset form and close
      setMaxUses("1");
      setExpiresAt("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMaxUses("1");
      setExpiresAt("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  // Calculate min date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Invitation Code</DialogTitle>
          <DialogDescription>
            Generate a new invitation code for users to join
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="maxUses">Maximum Uses</Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              max="1000"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="1"
            />
            <p className="text-xs text-muted-foreground">
              How many times this code can be used (1-1000)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={minDateStr}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for no expiration
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Code"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
