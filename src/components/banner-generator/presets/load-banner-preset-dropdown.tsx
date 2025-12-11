"use client";

import { useState } from "react";
import { FolderOpen, Loader2, ChevronDown, ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BannerPreset, BannerPresetConfig } from "@/lib/types/banner";
import { PartialLoadModal } from "./partial-load-modal";
import { PresetSectionSummary, getTotalConfiguredFields } from "./shared/preset-section-summary";

interface LoadBannerPresetDropdownProps {
  presets: BannerPreset[];
  onLoad: (preset: BannerPreset) => void;
  onPartialLoad: (config: Partial<BannerPresetConfig>) => void;
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate?: (id: string, newName?: string) => Promise<boolean>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function LoadBannerPresetDropdown({
  presets,
  onLoad,
  onPartialLoad,
  onDelete: _onDelete,
  onDuplicate: _onDuplicate,
  isLoading = false,
  disabled = false,
}: LoadBannerPresetDropdownProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [partialLoadPreset, setPartialLoadPreset] = useState<BannerPreset | null>(null);

  const handleLoad = (preset: BannerPreset) => {
    onLoad(preset);
  };

  const handlePartialLoad = (preset: BannerPreset) => {
    setPartialLoadPreset(preset);
  };

  const handleApplyPartialLoad = (config: Partial<BannerPresetConfig>) => {
    onPartialLoad(config);
    setPartialLoadPreset(null);
  };

  // Suppress unused variable warnings
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
    <>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              <FolderOpen className="h-4 w-4 mr-2" />
              {t("loadPreset")}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel>{t("savedPresets")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-[400px]">
              {presets.map((preset) => {
                const fieldCount = getTotalConfiguredFields(preset.config);

                return (
                  <DropdownMenuSub key={preset.id}>
                    <DropdownMenuSubTrigger className="cursor-pointer py-2">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span className="truncate flex-1 font-medium">{preset.name}</span>
                        <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                          {fieldCount} {t("fields")}
                        </Badge>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-80 p-0" sideOffset={8}>
                      {/* Preview Header */}
                      <div className="px-4 py-3 border-b bg-muted/30">
                        <p className="font-semibold text-sm">{preset.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("fieldsConfigured", { count: fieldCount })}
                        </p>
                      </div>

                      {/* Preview Content */}
                      <ScrollArea className="max-h-[300px]">
                        <div className="p-3 space-y-2">
                          <PresetSectionSummary section="basicConfig" config={preset.config} />
                          <PresetSectionSummary section="visualStyle" config={preset.config} />
                          <PresetSectionSummary section="visualElements" config={preset.config} />
                          <PresetSectionSummary section="layoutTypography" config={preset.config} />
                          <PresetSectionSummary section="textContent" config={preset.config} />
                          <PresetSectionSummary section="customPrompt" config={preset.config} />
                        </div>
                      </ScrollArea>

                      {/* Actions */}
                      <div className="p-3 border-t bg-muted/20 flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleLoad(preset)}
                        >
                          {t("loadAll")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handlePartialLoad(preset)}
                        >
                          <ListFilter className="h-3 w-3 mr-1" />
                          {t("loadPartial")}
                        </Button>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Partial Load Modal */}
      <PartialLoadModal
        preset={partialLoadPreset}
        open={!!partialLoadPreset}
        onOpenChange={(open) => !open && setPartialLoadPreset(null)}
        onApply={handleApplyPartialLoad}
      />
    </>
  );
}
