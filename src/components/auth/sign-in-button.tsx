"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth-client";

export function SignInButton() {
  const { data: session, isPending } = useSession();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  if (isPending) {
    return <Button disabled>{tCommon("loading")}</Button>;
  }

  if (session) {
    return null;
  }

  return (
    <Button
      onClick={async () => {
        await signIn.social({
          provider: "google",
          callbackURL: "/generate",
        });
      }}
    >
      {t("signIn")}
    </Button>
  );
}
