"use client";

import Image from "next/image";
import { Trash2, ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  poseTemplates,
  actionTemplates,
  clothingTemplates,
  expressionTemplates,
} from "@/lib/data/templates";
import type { SubjectConfig } from "@/lib/types/generation";
import { TemplateSelector } from "./template-selector";

interface SubjectCardProps {
  subject: SubjectConfig;
  index: number;
  onUpdate: (updates: Partial<SubjectConfig>) => void;
  onRemove: () => void;
  onSelectAvatar: () => void;
}

export function SubjectCard({
  subject,
  index,
  onUpdate,
  onRemove,
  onSelectAvatar,
}: SubjectCardProps) {
  const t = useTranslations("subjectCard");
  const tCommon = useTranslations("common");

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {t("subjectNumber", { number: index + 1 })}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label={t("deleteSubject")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteSubjectTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteSubjectDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onRemove}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {tCommon("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Avatar Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("referenceAvatar")}</Label>
          <button
            type="button"
            onClick={onSelectAvatar}
            className="w-full p-3 border rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors"
          >
            {subject.avatarImageUrl ? (
              <>
                <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                  <Image
                    src={subject.avatarImageUrl}
                    alt={subject.avatarName || "Avatar"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{subject.avatarName}</div>
                  <div className="text-xs text-muted-foreground">{t("clickToChange")}</div>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{t("noAvatarSelected")}</div>
                  <div className="text-xs text-muted-foreground">{t("clickToSelect")}</div>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Pose */}
        <TemplateSelector
          label={t("pose")}
          templates={poseTemplates}
          value={subject.pose || ""}
          onChange={(value) => onUpdate({ pose: value })}
          placeholder={t("posePlaceholder")}
          category="pose"
        />

        {/* Action */}
        <TemplateSelector
          label={t("action")}
          templates={actionTemplates}
          value={subject.action || ""}
          onChange={(value) => onUpdate({ action: value })}
          placeholder={t("actionPlaceholder")}
          category="action"
        />

        {/* Clothing */}
        <TemplateSelector
          label={t("clothing")}
          templates={clothingTemplates}
          value={subject.clothing || ""}
          onChange={(value) => onUpdate({ clothing: value })}
          placeholder={t("clothingPlaceholder")}
          category="clothing"
        />

        {/* Expression */}
        <TemplateSelector
          label={t("expression")}
          templates={expressionTemplates}
          value={subject.expression || ""}
          onChange={(value) => onUpdate({ expression: value })}
          placeholder={t("expressionPlaceholder")}
          category="expression"
        />

        {/* Hair */}
        <div className="space-y-2">
          <Label htmlFor={`hair-${index}`} className="text-sm font-medium">{t("hair")}</Label>
          <Input
            id={`hair-${index}`}
            value={subject.hair || ""}
            onChange={(e) => onUpdate({ hair: e.target.value })}
            placeholder={t("hairPlaceholder")}
          />
        </div>

        {/* Makeup */}
        <div className="space-y-2">
          <Label htmlFor={`makeup-${index}`} className="text-sm font-medium">{t("makeup")}</Label>
          <Input
            id={`makeup-${index}`}
            value={subject.makeup || ""}
            onChange={(e) => onUpdate({ makeup: e.target.value })}
            placeholder={t("makeupPlaceholder")}
          />
        </div>

        {/* Custom Description */}
        <div className="space-y-2">
          <Label htmlFor={`custom-description-${index}`} className="text-sm font-medium">{t("customDescription")}</Label>
          <Input
            id={`custom-description-${index}`}
            value={subject.customDescription || ""}
            onChange={(e) => onUpdate({ customDescription: e.target.value })}
            placeholder={t("customDescriptionPlaceholder")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
