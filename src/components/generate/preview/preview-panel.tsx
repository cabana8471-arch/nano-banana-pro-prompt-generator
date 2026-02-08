"use client";

import { FolderOpen, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectSelector } from "@/components/banner-generator/projects/project-selector";
import { PromptHistoryDropdown } from "@/components/generate/prompt-history-dropdown";
import { RateLimitIndicator } from "@/components/generate/rate-limit-indicator";
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
import type { PromptHistoryEntry } from "@/hooks/use-prompt-history";
import { Link } from "@/i18n/routing";
import type { GenerationSettings, GenerationType, Preset, PresetConfig, UpdatePresetInput } from "@/lib/types/generation";
import type { Project, CreateProjectInput } from "@/lib/types/project";

interface PreviewPanelProps {
  assembledPrompt: string;
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
  // Rate limit
  rateLimit?: { current: number; limit: number; remaining: number; resetInMs: number } | null;
  // Prompt history
  promptHistory?: PromptHistoryEntry[];
  onSelectHistoryPrompt?: (prompt: string) => void;
  onRemoveHistoryEntry?: (timestamp: number) => void;
  onClearHistory?: () => void;
  historyFilterType?: GenerationType;
  // Preset props
  currentConfig: PresetConfig;
  presets: Preset[];
  presetsLoading: boolean;
  onSavePreset: (name: string, config: PresetConfig) => Promise<boolean>;
  onLoadPreset: (preset: Preset) => void;
  onUpdatePreset: (id: string, input: UpdatePresetInput) => Promise<boolean>;
  onDeletePreset: (id: string) => Promise<boolean>;
  // Project props
  projects?: Project[];
  projectsLoading?: boolean;
  selectedProjectId?: string | null;
  onProjectChange?: (projectId: string | null) => void;
  onCreateProject?: (input: CreateProjectInput) => Promise<Project | null>;
}

export function PreviewPanel({
  assembledPrompt,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
  rateLimit,
  promptHistory,
  onSelectHistoryPrompt,
  onRemoveHistoryEntry,
  onClearHistory,
  historyFilterType,
  currentConfig,
  presets,
  presetsLoading,
  onSavePreset,
  onLoadPreset,
  onUpdatePreset,
  onDeletePreset,
  projects,
  projectsLoading,
  selectedProjectId,
  onProjectChange,
  onCreateProject,
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
          {promptHistory && onSelectHistoryPrompt && onRemoveHistoryEntry && onClearHistory && (
            <PromptHistoryDropdown
              history={promptHistory}
              onSelect={onSelectHistoryPrompt}
              onRemove={onRemoveHistoryEntry}
              onClear={onClearHistory}
              filterType={historyFilterType}
              disabled={isGenerating}
            />
          )}
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
              <Label htmlFor="resolution-select" className="text-sm font-medium">{t("resolution")}</Label>
              <Select
                value={settings.resolution}
                onValueChange={(value) =>
                  onSettingsChange({ resolution: value as GenerationSettings["resolution"] })
                }
              >
                <SelectTrigger id="resolution-select">
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
              <Label htmlFor="aspect-ratio-select" className="text-sm font-medium">{t("aspectRatio")}</Label>
              <Select
                value={settings.aspectRatio}
                onValueChange={(value) =>
                  onSettingsChange({ aspectRatio: value as GenerationSettings["aspectRatio"] })
                }
              >
                <SelectTrigger id="aspect-ratio-select">
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

            {/* Project Selection */}
            {projects && onProjectChange && onCreateProject && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  {t("project")}
                  <span className="text-destructive">*</span>
                </Label>
                <ProjectSelector
                  projects={projects}
                  isLoading={projectsLoading ?? false}
                  selectedId={selectedProjectId ?? null}
                  onSelect={onProjectChange}
                  onCreateProject={onCreateProject}
                  disabled={isGenerating}
                />
                {!selectedProjectId && (
                  <p className="text-xs text-muted-foreground">
                    {t("projectRequired")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t space-y-2">
        {rateLimit && (
          <RateLimitIndicator
            current={rateLimit.current}
            limit={rateLimit.limit}
            remaining={rateLimit.remaining}
            resetInMs={rateLimit.resetInMs}
          />
        )}
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
            disabled={isGenerating || !assembledPrompt || (rateLimit?.remaining === 0) || (projects !== undefined && !selectedProjectId)}
          >
            <Wand2 className="h-5 w-5 mr-2" />
            {isGenerating ? t("generating") : t("generateImages")}
          </Button>
        )}
      </div>
    </div>
  );
}
