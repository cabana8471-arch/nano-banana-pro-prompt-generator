"use client";

import { Wand2, FileText, Settings2, FolderOpen, Square, RectangleHorizontal, RectangleVertical, Hexagon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import type {
  LogoPreset,
  LogoPresetConfig,
  LogoGenerationSettings,
  UpdateLogoPresetInput,
  LogoCount,
  LogoResolution,
} from "@/lib/types/logo";
import type { Project, CreateProjectInput } from "@/lib/types/project";
import { LoadLogoPresetDropdown } from "../presets/load-logo-preset-dropdown";
import { ManageLogoPresetsModal } from "../presets/manage-logo-presets-modal";
import { SaveLogoPresetModal } from "../presets/save-logo-preset-modal";
import { ProjectSelector } from "@/components/banner-generator/projects/project-selector";

interface LogoPreviewPanelProps {
  assembledPrompt: string;
  settings: LogoGenerationSettings;
  onSettingsChange: (settings: Partial<LogoGenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
  selectedLogoFormat?: string;
  // Preset props
  currentConfig: LogoPresetConfig;
  presets: LogoPreset[];
  presetsLoading: boolean;
  onSavePreset: (name: string, config: LogoPresetConfig) => Promise<boolean>;
  onLoadPreset: (preset: LogoPreset) => void;
  onPartialLoadPreset: (config: Partial<LogoPresetConfig>) => void;
  onUpdatePreset: (id: string, input: UpdateLogoPresetInput) => Promise<boolean>;
  onDeletePreset: (id: string) => Promise<boolean>;
  onDuplicatePreset: (id: string, newName?: string) => Promise<boolean>;
  onEditPreset: (preset: LogoPreset) => void;
  onComparePresets: () => void;
  // Project props
  projects: Project[];
  projectsLoading: boolean;
  selectedProjectId: string | null;
  onProjectChange: (projectId: string | null) => void;
  onCreateProject: (input: CreateProjectInput) => Promise<Project | null>;
}

// Logo format icons
const logoFormatIcons: Record<string, React.ReactNode> = {
  "format-horizontal": <RectangleHorizontal className="h-4 w-4" />,
  "format-vertical": <RectangleVertical className="h-4 w-4" />,
  "format-icon-only": <Hexagon className="h-4 w-4" />,
  "format-text-only": <FileText className="h-4 w-4" />,
  "format-square": <Square className="h-4 w-4" />,
  "format-circular": <Hexagon className="h-4 w-4" />,
};

export function LogoPreviewPanel({
  assembledPrompt,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
  selectedLogoFormat,
  currentConfig,
  presets,
  presetsLoading,
  onSavePreset,
  onLoadPreset,
  onPartialLoadPreset,
  onUpdatePreset,
  onDeletePreset,
  onDuplicatePreset,
  onEditPreset,
  onComparePresets,
  projects,
  projectsLoading,
  selectedProjectId,
  onProjectChange,
  onCreateProject,
}: LogoPreviewPanelProps) {
  const t = useTranslations("logoGenerator");
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
          <LoadLogoPresetDropdown
            presets={presets}
            onLoad={onLoadPreset}
            onPartialLoad={onPartialLoadPreset}
            onDelete={onDeletePreset}
            onDuplicate={onDuplicatePreset}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
          <SaveLogoPresetModal
            config={currentConfig}
            onSave={onSavePreset}
            onUpdate={onUpdatePreset}
            existingPresets={presets}
            disabled={isGenerating || !assembledPrompt}
          />
          <ManageLogoPresetsModal
            presets={presets}
            onUpdate={onUpdatePreset}
            onDelete={onDeletePreset}
            onDuplicate={onDuplicatePreset}
            onEdit={onEditPreset}
            onCompare={onComparePresets}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Logo Format Preview */}
          {selectedLogoFormat && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                {logoFormatIcons[selectedLogoFormat] || <Square className="h-4 w-4" />}
                {t("preview.logoFormat")}
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t(`formats.${selectedLogoFormat}`)}</span>
                </div>
                {/* Visual format preview */}
                <div className="mt-3 flex justify-center">
                  <div
                    className="border-2 border-dashed border-muted-foreground/30 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground"
                    style={{
                      width: selectedLogoFormat === "format-horizontal" ? 160 :
                             selectedLogoFormat === "format-vertical" ? 80 : 100,
                      height: selectedLogoFormat === "format-vertical" ? 120 :
                              selectedLogoFormat === "format-horizontal" ? 60 : 100,
                      borderRadius: selectedLogoFormat === "format-circular" ? "50%" : "0.375rem",
                    }}
                  >
                    {t("preview.logoPreview")}
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

            {/* Number of Logos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("preview.numberOfLogos")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((num) => (
                  <Button
                    key={num}
                    variant={settings.logoCount === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ logoCount: num as LogoCount })}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("preview.resolution")}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["1K", "2K", "4K"] as const).map((res) => (
                  <Button
                    key={res}
                    variant={settings.resolution === res ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ resolution: res as LogoResolution })}
                  >
                    {res}
                  </Button>
                ))}
              </div>
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {t("projects.title")}
                <span className="text-destructive">*</span>
              </Label>
              <ProjectSelector
                projects={projects}
                isLoading={projectsLoading}
                selectedId={selectedProjectId}
                onSelect={onProjectChange}
                onCreateProject={onCreateProject}
                disabled={isGenerating}
              />
              {!selectedProjectId && (
                <p className="text-xs text-muted-foreground">
                  {t("projects.required")}
                </p>
              )}
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
            disabled={isGenerating || !assembledPrompt || !selectedProjectId}
          >
            <Wand2 className="h-5 w-5 mr-2" />
            {isGenerating ? tCommon("loading") : t("preview.generateLogo")}
          </Button>
        )}
      </div>
    </div>
  );
}
