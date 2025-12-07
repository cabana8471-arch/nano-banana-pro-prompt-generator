"use client";

import { useState } from "react";
import { FolderOpen, Loader2, ChevronDown, ChevronRight, ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { BannerPreset, BannerPresetConfig } from "@/lib/types/banner";
import { BannerPresetList } from "./banner-preset-list";
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
  onDelete,
  onDuplicate,
  isLoading = false,
  disabled = false,
}: LoadBannerPresetDropdownProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [partialLoadPreset, setPartialLoadPreset] = useState<BannerPreset | null>(null);

  const handleLoad = (preset: BannerPreset) => {
    onLoad(preset);
    setSheetOpen(false);
  };

  const handlePartialLoad = (preset: BannerPreset) => {
    setPartialLoadPreset(preset);
  };

  const handleApplyPartialLoad = (config: Partial<BannerPresetConfig>) => {
    onPartialLoad(config);
    setPartialLoadPreset(null);
  };

  // Show up to 5 recent presets in dropdown, rest in sheet
  const recentPresets = presets.slice(0, 5);
  const hasMorePresets = presets.length > 5;

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
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>{t("recentPresets")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentPresets.map((preset) => {
              const fieldCount = getTotalConfiguredFields(preset.config);

              return (
                <DropdownMenuSub key={preset.id}>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="truncate flex-1">{preset.name}</span>
                      <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                        {fieldCount}
                      </Badge>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-64 p-0">
                    {/* Preview Header */}
                    <div className="px-3 py-2 border-b bg-muted/30">
                      <p className="font-medium text-sm">{preset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("fieldsConfigured", { count: fieldCount })}
                      </p>
                    </div>

                    {/* Preview Content */}
                    <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                      <PresetSectionSummary section="basicConfig" config={preset.config} compact />
                      <PresetSectionSummary section="visualStyle" config={preset.config} compact />
                      <PresetSectionSummary section="visualElements" config={preset.config} compact />
                      <PresetSectionSummary section="layoutTypography" config={preset.config} compact />
                      <PresetSectionSummary section="textContent" config={preset.config} compact />
                      <PresetSectionSummary section="customPrompt" config={preset.config} compact />
                    </div>

                    {/* Actions */}
                    <div className="p-2 border-t bg-muted/20 flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1 h-8"
                        onClick={() => handleLoad(preset)}
                      >
                        {t("loadAll")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8"
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
            {hasMorePresets && (
              <>
                <DropdownMenuSeparator />
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      {t("viewAll")} ({presets.length})
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>{t("allPresets")}</SheetTitle>
                      <SheetDescription>{t("selectPreset")}</SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
                      <BannerPresetList
                        presets={presets}
                        onLoad={handleLoad}
                        onPartialLoad={handlePartialLoad}
                        onDelete={onDelete}
                        {...(onDuplicate && { onDuplicate })}
                        isLoading={isLoading}
                      />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </>
            )}
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
