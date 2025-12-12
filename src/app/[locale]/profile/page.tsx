"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, User, Shield, ArrowLeft, Lock, Smartphone, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ApiKeyForm } from "@/components/profile/api-key-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [emailPrefsOpen, setEmailPrefsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/check");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch {
        // Default to non-admin on error
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>{t("common.loading")}</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const user = session.user;
  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleEditProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    toast.info("Profile updates require backend implementation");
    setEditProfileOpen(false);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <h1 className="text-3xl font-bold">{t("profile.title")}</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-lg">
                  {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                  {user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {t("profile.verified")}
                    </Badge>
                  )}
                </div>
                {createdDate && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{t("profile.memberSince", { date: createdDate })}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.accountInformation")}</CardTitle>
            <CardDescription>{t("profile.accountDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("profile.fullName")}
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {user.name || t("common.notProvided")}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("profile.emailAddress")}
                </label>
                <div className="p-3 border rounded-md bg-muted/10 flex items-center justify-between">
                  <span>{user.email}</span>
                  {user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {t("profile.verified")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("profile.accountStatus")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{t("profile.emailVerification")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("profile.emailVerificationDescription")}
                    </p>
                  </div>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? t("profile.verified") : t("profile.unverified")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{t("profile.accountType")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("profile.accountTypeDescription")}
                    </p>
                  </div>
                  <Badge variant={isAdmin ? "default" : "outline"}>
                    {isAdmin ? t("common.admin") : t("profile.standard")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <ApiKeyForm />

        {/* Language Settings */}
        <LanguageSwitcher />

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.recentActivity")}</CardTitle>
            <CardDescription>
              {t("profile.recentActivityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{t("profile.currentSession")}</p>
                    <p className="text-sm text-muted-foreground">{t("profile.activeNow")}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  {t("profile.active")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.quickActions")}</CardTitle>
            <CardDescription>
              {t("profile.quickActionsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => setEditProfileOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{t("profile.editProfile.title")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("profile.editProfile.buttonDescription")}
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => setSecurityOpen(true)}
              >
                <Shield className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{t("profile.security.title")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("profile.security.buttonDescription")}
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => setEmailPrefsOpen(true)}
              >
                <Mail className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{t("profile.email.title")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("profile.email.buttonDescription")}
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("profile.editProfile.title")}</DialogTitle>
            <DialogDescription>
              {t("profile.editProfile.description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.fullName")}</Label>
              <Input
                id="name"
                defaultValue={user.name || ""}
                placeholder={t("profile.editProfile.enterName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.emailAddress")}</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                {t("profile.editProfile.emailCannotChange")}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditProfileOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("common.saveChanges")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("profile.security.title")}</DialogTitle>
            <DialogDescription>
              {t("profile.security.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("profile.security.password")}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email?.includes("@gmail")
                      ? t("profile.security.managedByGoogle")
                      : t("profile.security.setPassword")}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {user.email?.includes("@gmail") ? t("profile.security.oauth") : t("profile.security.notSet")}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("profile.security.twoFactor")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("profile.security.twoFactorGoogleManaged")}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  {t("profile.security.manageInGoogle")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t("profile.security.activeSessions")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("profile.security.activeSessionsDescription")}
                  </p>
                </div>
              </div>
              <Badge variant="default">{t("profile.security.oneActive")}</Badge>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setSecurityOpen(false)}>
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preferences Dialog */}
      <Dialog open={emailPrefsOpen} onOpenChange={setEmailPrefsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("profile.email.title")}</DialogTitle>
            <DialogDescription>
              {t("profile.email.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t("profile.email.marketing")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("profile.email.marketingDescription")}
                </p>
              </div>
              <Badge variant="secondary">{t("common.comingSoon")}</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t("profile.email.securityAlerts")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("profile.email.securityAlertsDescription")}
                </p>
              </div>
              <Badge variant="default">{t("profile.email.alwaysOn")}</Badge>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setEmailPrefsOpen(false)}>
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
