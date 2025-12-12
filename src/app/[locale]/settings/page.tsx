"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Users, TicketIcon, MailIcon, ShieldIcon } from "lucide-react";
import { AllowlistTab } from "@/components/admin/allowlist-tab";
import { InvitationsTab } from "@/components/admin/invitations-tab";
import { SecurityTab } from "@/components/admin/security-tab";
import { UsersTab } from "@/components/admin/users-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Admin Settings</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            <TicketIcon className="h-4 w-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="allowlist" className="gap-2">
            <MailIcon className="h-4 w-4" />
            Allowlist
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldIcon className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="invitations">
          <InvitationsTab />
        </TabsContent>

        <TabsContent value="allowlist">
          <AllowlistTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
