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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IpType } from "@/lib/types/admin";

interface IpBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlock: (options: {
    ipAddress: string;
    ipType?: IpType;
    reason?: string;
    expiresAt?: Date | null;
  }) => Promise<boolean>;
}

export function IpBlockDialog({
  open,
  onOpenChange,
  onBlock,
}: IpBlockDialogProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [ipType, setIpType] = useState<IpType>("single");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlock = async () => {
    setError(null);

    // Validate IP address
    const trimmedIp = ipAddress.trim();
    if (!trimmedIp) {
      setError("IP address is required");
      return;
    }

    // Basic validation based on type
    if (ipType === "single") {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(trimmedIp)) {
        setError("Invalid IP address format (e.g., 192.168.1.1)");
        return;
      }
    } else {
      const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      if (!cidrRegex.test(trimmedIp)) {
        setError("Invalid CIDR notation (e.g., 192.168.1.0/24)");
        return;
      }
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

    setIsBlocking(true);
    const trimmedReason = reason.trim();
    const options = {
      ipAddress: trimmedIp,
      ipType,
      expiresAt: expiresAtDate,
      ...(trimmedReason && { reason: trimmedReason }),
    };
    const success = await onBlock(options);
    setIsBlocking(false);

    if (success) {
      // Reset form and close
      setIpAddress("");
      setIpType("single");
      setReason("");
      setExpiresAt("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIpAddress("");
      setIpType("single");
      setReason("");
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
          <DialogTitle>Block IP Address</DialogTitle>
          <DialogDescription>
            Block an IP address or range from accessing the application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ipType">Block Type</Label>
            <Select value={ipType} onValueChange={(v) => setIpType(v as IpType)}>
              <SelectTrigger id="ipType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single IP</SelectItem>
                <SelectItem value="range">IP Range (CIDR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder={ipType === "single" ? "192.168.1.1" : "192.168.1.0/24"}
            />
            <p className="text-xs text-muted-foreground">
              {ipType === "single"
                ? "Enter a single IP address"
                : "Enter an IP range in CIDR notation"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why this IP is being blocked..."
              rows={3}
            />
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
              Leave empty for permanent block
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
          <Button onClick={handleBlock} disabled={isBlocking}>
            {isBlocking ? "Blocking..." : "Block IP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
