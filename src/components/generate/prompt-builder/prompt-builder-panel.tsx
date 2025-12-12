"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  lightingTemplates,
  cameraTemplates,
  styleTemplates,
  locationTemplates,
} from "@/lib/data/templates";
import type { SubjectConfig, Avatar } from "@/lib/types/generation";
import { SubjectManager } from "./subject-manager";
import { TemplateSelector } from "./template-selector";

interface PromptBuilderPanelProps {
  // Scene settings
  location: string;
  lighting: string;
  camera: string;
  style: string;
  customPrompt: string;

  // Setters
  onLocationChange: (value: string) => void;
  onLightingChange: (value: string) => void;
  onCameraChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onCustomPromptChange: (value: string) => void;

  // Subject management
  subjects: SubjectConfig[];
  onAddSubject: () => void;
  onRemoveSubject: (id: string) => void;
  onUpdateSubject: (id: string, updates: Partial<SubjectConfig>) => void;
  onLinkAvatarToSubject: (subjectId: string, avatar: Avatar | null) => void;
}

export function PromptBuilderPanel({
  location,
  lighting,
  camera,
  style,
  customPrompt,
  onLocationChange,
  onLightingChange,
  onCameraChange,
  onStyleChange,
  onCustomPromptChange,
  subjects,
  onAddSubject,
  onRemoveSubject,
  onUpdateSubject,
  onLinkAvatarToSubject,
}: PromptBuilderPanelProps) {
  const t = useTranslations("promptBuilder");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Scene Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {t("sceneSettings")}
            </h3>

            {/* Style */}
            <TemplateSelector
              label={t("style")}
              templates={styleTemplates}
              value={style}
              onChange={onStyleChange}
              placeholder={t("stylePlaceholder")}
              category="style"
            />

            {/* Location */}
            <TemplateSelector
              label={t("location")}
              templates={locationTemplates}
              value={location}
              onChange={onLocationChange}
              placeholder={t("locationPlaceholder")}
              category="location"
            />

            {/* Lighting */}
            <TemplateSelector
              label={t("lighting")}
              templates={lightingTemplates}
              value={lighting}
              onChange={onLightingChange}
              placeholder={t("lightingPlaceholder")}
              category="lighting"
            />

            {/* Camera */}
            <TemplateSelector
              label={t("camera")}
              templates={cameraTemplates}
              value={camera}
              onChange={onCameraChange}
              placeholder={t("cameraPlaceholder")}
              category="camera"
            />
          </div>

          <Separator />

          {/* Subjects */}
          <SubjectManager
            subjects={subjects}
            onAdd={onAddSubject}
            onRemove={onRemoveSubject}
            onUpdate={onUpdateSubject}
            onLinkAvatar={onLinkAvatarToSubject}
          />

          <Separator />

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label htmlFor="custom-prompt" className="text-sm font-medium">
              {t("additionalInstructions")}
            </Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder={t("additionalPlaceholder")}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t("additionalHint")}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
