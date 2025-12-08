"use client";

import { FolderOpen, Loader2, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { LogoPreset, LogoPresetConfig } from "@/lib/types/logo";

interface LoadLogoPresetDropdownProps {
  presets: LogoPreset[];
  onLoad: (preset: LogoPreset) => void;
  onPartialLoad: (config: Partial<LogoPresetConfig>) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate?: (id: string, newName?: string) => Promise<boolean>;
  isLoading?: boolean;
  disabled?: boolean;
}

function countConfiguredFields(config: LogoPresetConfig): number {
  let count = 0;
  if (config.logoType) count++;
  if (config.industry) count++;
  if (config.logoFormat) count++;
  if (config.designStyle) count++;
  if (config.colorSchemeType) count++;
  if (config.mood) count++;
  if (config.iconStyle) count++;
  if (config.symbolElements && config.symbolElements.length > 0) count++;
  if (config.fontCategory) count++;
  if (config.typographyTreatment) count++;
  if (config.specialEffects) count++;
  if (config.backgroundStyle) count++;
  if (config.textContent?.companyName) count++;
  if (config.textContent?.tagline) count++;
  if (config.textContent?.abbreviation) count++;
  if (config.primaryColor) count++;
  if (config.secondaryColor) count++;
  if (config.accentColor) count++;
  if (config.customPrompt) count++;
  return count;
}

export function LoadLogoPresetDropdown({
  presets,
  onLoad,
  onPartialLoad: _onPartialLoad,
  onDelete: _onDelete,
  onDuplicate: _onDuplicate,
  isLoading = false,
  disabled = false,
}: LoadLogoPresetDropdownProps) {
  const t = useTranslations("logoGenerator.presets");
  const tCommon = useTranslations("common");

  // Suppress unused variable warnings
  void _onPartialLoad;
  void _onDelete;
  void _onDuplicate;

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        {tCommon("loading")}
      </Button>
    );
  }

  if (presets.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <FolderOpen className="h-4 w-4 mr-2" />
        {t("noPresets")}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <FolderOpen className="h-4 w-4 mr-2" />
          {t("loadPreset")}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{t("savedPresets")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[300px]">
          {presets.map((preset) => {
            const fieldCount = countConfiguredFields(preset.config);
            return (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => onLoad(preset)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="truncate flex-1 font-medium">{preset.name}</span>
                <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                  {fieldCount} {t("fields")}
                </Badge>
              </DropdownMenuItem>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
