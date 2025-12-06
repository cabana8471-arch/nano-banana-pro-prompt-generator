"use client";

import { Wand2, FileText, Settings2, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
import type {
  BannerPreset,
  BannerPresetConfig,
  BannerGenerationSettings,
  BannerExportFormat,
  BannerSizeTemplate,
  UpdateBannerPresetInput,
  BannerCount,
} from "@/lib/types/banner";
import { LoadBannerPresetDropdown } from "../presets/load-banner-preset-dropdown";
import { ManageBannerPresetsModal } from "../presets/manage-banner-presets-modal";
import { SaveBannerPresetModal } from "../presets/save-banner-preset-modal";

interface BannerPreviewPanelProps {
  assembledPrompt: string;
  settings: BannerGenerationSettings;
  onSettingsChange: (settings: Partial<BannerGenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
  selectedBannerSize?: BannerSizeTemplate | undefined;
  // Preset props
  currentConfig: BannerPresetConfig;
  presets: BannerPreset[];
  presetsLoading: boolean;
  onSavePreset: (name: string, config: BannerPresetConfig) => Promise<boolean>;
  onLoadPreset: (preset: BannerPreset) => void;
  onUpdatePreset: (id: string, input: UpdateBannerPresetInput) => Promise<boolean>;
  onDeletePreset: (id: string) => Promise<boolean>;
}

export function BannerPreviewPanel({
  assembledPrompt,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
  selectedBannerSize,
  currentConfig,
  presets,
  presetsLoading,
  onSavePreset,
  onLoadPreset,
  onUpdatePreset,
  onDeletePreset,
}: BannerPreviewPanelProps) {
  const t = useTranslations("bannerGenerator");
  const tCommon = useTranslations("common");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">{t("preview.title")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("preview.description")}
            </p>
          </div>
        </div>
        {/* Preset Actions */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <LoadBannerPresetDropdown
            presets={presets}
            onLoad={onLoadPreset}
            onDelete={onDeletePreset}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
          <SaveBannerPresetModal
            config={currentConfig}
            onSave={onSavePreset}
            disabled={isGenerating || !assembledPrompt}
          />
          <ManageBannerPresetsModal
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
          {/* Banner Size Preview */}
          {selectedBannerSize && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {t("preview.bannerSize")}
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{selectedBannerSize.name}</span>
                  <span className="text-muted-foreground">
                    {selectedBannerSize.width} × {selectedBannerSize.height}px
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {selectedBannerSize.platform}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                    {selectedBannerSize.category}
                  </span>
                </div>
                {/* Visual size preview */}
                <div className="mt-3 flex justify-center">
                  <div
                    className="border-2 border-dashed border-muted-foreground/30 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground"
                    style={{
                      width: Math.min(
                        200,
                        (selectedBannerSize.width / selectedBannerSize.height) * 80
                      ),
                      height: Math.min(
                        80,
                        (selectedBannerSize.height / selectedBannerSize.width) * 200
                      ),
                      maxWidth: "100%",
                    }}
                  >
                    {selectedBannerSize.width}×{selectedBannerSize.height}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prompt Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("preview.generatedPrompt")}
            </Label>
            <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] max-h-[200px] overflow-auto">
              {assembledPrompt ? (
                <p className="text-sm whitespace-pre-wrap">{assembledPrompt}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {t("preview.promptPlaceholder")}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Generation Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              {t("preview.generationSettings")}
            </h3>

            {/* Export Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("preview.exportFormat")}</Label>
              <Select
                value={settings.format}
                onValueChange={(value) =>
                  onSettingsChange({ format: value as BannerExportFormat })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("preview.selectFormat")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Banners */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("preview.numberOfBanners")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((num) => (
                  <Button
                    key={num}
                    variant={settings.bannerCount === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ bannerCount: num as BannerCount })}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("preview.quality")} ({settings.quality}%)
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[70, 80, 90, 100].map((quality) => (
                  <Button
                    key={quality}
                    variant={settings.quality === quality ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ quality })}
                  >
                    {quality}%
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t">
        {!hasApiKey ? (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-2">
              {t("preview.addApiKeyHint")}
            </p>
            <Button variant="outline" asChild>
              <Link href="/profile">{t("preview.goToProfile")}</Link>
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
            {isGenerating ? tCommon("loading") : t("preview.generateBanner")}
          </Button>
        )}
      </div>
    </div>
  );
}
