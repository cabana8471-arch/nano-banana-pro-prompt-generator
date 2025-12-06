"use client";

import { Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LoadPresetDropdown } from "@/components/presets/load-preset-dropdown";
import { ManagePresetsModal } from "@/components/presets/manage-presets-modal";
import { SavePresetModal } from "@/components/presets/save-preset-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import type { GenerationSettings, Preset, PresetConfig, UpdatePresetInput } from "@/lib/types/generation";

interface PreviewPanelProps {
  assembledPrompt: string;
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
  // Preset props
  currentConfig: PresetConfig;
  presets: Preset[];
  presetsLoading: boolean;
  onSavePreset: (name: string, config: PresetConfig) => Promise<boolean>;
  onLoadPreset: (preset: Preset) => void;
  onUpdatePreset: (id: string, input: UpdatePresetInput) => Promise<boolean>;
  onDeletePreset: (id: string) => Promise<boolean>;
}

export function PreviewPanel({
  assembledPrompt,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
  currentConfig,
  presets,
  presetsLoading,
  onSavePreset,
  onLoadPreset,
  onUpdatePreset,
  onDeletePreset,
}: PreviewPanelProps) {
  const t = useTranslations("generate");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">{t("previewAndGenerate")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("reviewPrompt")}
            </p>
          </div>
        </div>
        {/* Preset Actions */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <LoadPresetDropdown
            presets={presets}
            onLoad={onLoadPreset}
            onDelete={onDeletePreset}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
          <SavePresetModal
            config={currentConfig}
            onSave={onSavePreset}
            disabled={isGenerating || !assembledPrompt}
          />
          <ManagePresetsModal
            presets={presets}
            onUpdate={onUpdatePreset}
            onDelete={onDeletePreset}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Prompt Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("generatedPrompt")}</Label>
            <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
              {assembledPrompt ? (
                <p className="text-sm whitespace-pre-wrap">{assembledPrompt}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {t("promptPlaceholder")}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {t("generationSettings")}
            </h3>

            {/* Number of Images */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("numberOfImages")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((num) => (
                  <Button
                    key={num}
                    variant={settings.imageCount === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ imageCount: num })}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("resolution")}</Label>
              <Select
                value={settings.resolution}
                onValueChange={(value) =>
                  onSettingsChange({ resolution: value as GenerationSettings["resolution"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectResolution")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1K">{t("resolutions.1K")}</SelectItem>
                  <SelectItem value="2K">{t("resolutions.2K")}</SelectItem>
                  <SelectItem value="4K">{t("resolutions.4K")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("aspectRatio")}</Label>
              <Select
                value={settings.aspectRatio}
                onValueChange={(value) =>
                  onSettingsChange({ aspectRatio: value as GenerationSettings["aspectRatio"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectAspectRatio")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">{t("aspectRatios.1:1")}</SelectItem>
                  <SelectItem value="16:9">{t("aspectRatios.16:9")}</SelectItem>
                  <SelectItem value="9:16">{t("aspectRatios.9:16")}</SelectItem>
                  <SelectItem value="4:3">{t("aspectRatios.4:3")}</SelectItem>
                  <SelectItem value="3:4">{t("aspectRatios.3:4")}</SelectItem>
                  <SelectItem value="21:9">{t("aspectRatios.21:9")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t">
        {!hasApiKey ? (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-2">
              {t("addApiKeyHint")}
            </p>
            <Button variant="outline" asChild>
              <Link href="/profile">{t("goToProfile")}</Link>
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={onGenerate}
            disabled={isGenerating || !assembledPrompt}
          >
            <Wand2 className="h-5 w-5 mr-2" />
            {isGenerating ? t("generating") : t("generateImages")}
          </Button>
        )}
      </div>
    </div>
  );
}
