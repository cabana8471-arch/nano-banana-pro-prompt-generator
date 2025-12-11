"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banana, Ticket, LogOut, Loader2, Mail, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "@/lib/auth-client";

interface UnauthorizedClientProps {
  userEmail: string;
  userName: string;
}

export function UnauthorizedClient({ userEmail, userName }: UnauthorizedClientProps) {
  const router = useRouter();
  const t = useTranslations("unauthorized");
  const tBrand = useTranslations("brand");
  const tAuth = useTranslations("auth");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/authorization/redeem-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("error.generic"));
        return;
      }

      setSuccess(t("success.codeRedeemed"));
      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  };

  // Format code as user types (uppercase, max 8 chars)
  const handleCodeChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    setCode(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/20">
              <Banana className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">
              <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {tBrand("name")}
              </span>
            </CardTitle>
            <CardDescription className="mt-2">
              {t("description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current user info */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {t("signedInAs")}
            </div>
            <div className="font-medium">{userName}</div>
            <div className="text-sm text-muted-foreground">{userEmail}</div>
          </div>

          {/* Alert about access */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("accessDenied")}
            </AlertDescription>
          </Alert>

          {/* Invitation code form */}
          <form onSubmit={handleRedeemCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                {t("invitationCodeLabel")}
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={t("invitationCodePlaceholder")}
                disabled={isLoading}
                className="font-mono text-center text-lg tracking-wider"
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground">
                {t("invitationCodeHelp")}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || code.length !== 8}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("redeeming")}
                </>
              ) : (
                t("redeemCode")
              )}
            </Button>
          </form>

          {/* Contact admin section */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center">
              {t("contactAdmin")}
            </p>
          </div>

          {/* Sign out button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tAuth("loggingOut")}
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                {t("signOutAndTryAnother")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
