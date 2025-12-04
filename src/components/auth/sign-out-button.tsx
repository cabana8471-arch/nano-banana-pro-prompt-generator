"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function SignOutButton() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <Button disabled>{tCommon("loading")}</Button>;
  }

  if (!session) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      {t("logOut")}
    </Button>
  );
}
