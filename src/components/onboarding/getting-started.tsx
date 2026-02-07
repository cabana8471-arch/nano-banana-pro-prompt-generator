"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Key, ImageIcon, Camera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OnboardingStatus } from "@/hooks/use-onboarding";

interface GettingStartedProps {
  status: OnboardingStatus;
  onDismiss: () => void;
}

export function GettingStarted({ status, onDismiss }: GettingStartedProps) {
  const t = useTranslations("onboarding");

  const steps = [
    {
      key: "apiKey",
      done: status.hasApiKey,
      icon: Key,
      title: t("steps.apiKey.title"),
      description: t("steps.apiKey.description"),
      href: "/profile",
    },
    {
      key: "avatar",
      done: status.hasAvatar,
      icon: ImageIcon,
      title: t("steps.avatar.title"),
      description: t("steps.avatar.description"),
      href: "/references",
    },
    {
      key: "generate",
      done: status.hasGeneration,
      icon: Camera,
      title: t("steps.generate.title"),
      description: t("steps.generate.description"),
      href: "/photo-generator",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t("title")}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDismiss}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("dismiss")}</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("progress", { completed: completedCount, total: steps.length })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <Link
              key={step.key}
              href={step.href}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                step.done
                  ? "bg-muted/50 opacity-60"
                  : "bg-background hover:bg-muted/50"
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? "line-through" : ""}`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              <step.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
