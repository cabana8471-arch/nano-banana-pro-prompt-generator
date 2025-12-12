import { headers } from "next/headers";
import { ShieldBan } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: "Access Blocked",
    description: "Your access to this application has been blocked",
  };
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();

  // Try various headers that might contain the client IP
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, the first one is the client
    return forwardedFor.split(",")[0]?.trim() || "Unknown";
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "Unknown";
}

export default async function BlockedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const clientIp = await getClientIp();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldBan className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Blocked</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your access to this application has been blocked. This may be due to security concerns or policy violations.
          </p>

          <div className="rounded-md bg-muted p-3 text-center">
            <p className="text-sm text-muted-foreground">Your IP address:</p>
            <p className="font-mono text-sm font-medium">{clientIp}</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            If you believe this is a mistake, please contact the administrator with your IP address for assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
