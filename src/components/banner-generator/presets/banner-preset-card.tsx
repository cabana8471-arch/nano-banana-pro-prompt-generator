"use client";

import { useState } from "react";
import { MoreVertical, ChevronDown, ChevronUp, Pencil, Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { BannerPreset, BannerSection } from "@/lib/types/banner";
import { PresetSectionSummary, getTotalConfiguredFields } from "./shared/preset-section-summary";

interface BannerPresetCardProps {
  preset: BannerPreset;
  onLoad: (preset: BannerPreset) => void;
  onEdit?: (preset: BannerPreset) => void;
  onDuplicate?: (preset: BannerPreset) => void;
  onDelete?: (preset: BannerPreset) => void;
  onPartialLoad?: (preset: BannerPreset) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function BannerPresetCard({
  preset,
  onLoad,
  onEdit,
  onDuplicate,
  onDelete,
  onPartialLoad,
  showActions = true,
  compact = false,
}: BannerPresetCardProps) {
  const t = useTranslations("bannerGenerator.presets");
  const tCommon = useTranslations("common");
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalFields = getTotalConfiguredFields(preset.config);
  const sections: Array<BannerSection | "textContent" | "customPrompt"> = [
    "basicConfig",
    "visualStyle",
    "visualElements",
    "layoutTypography",
    "textContent",
    "customPrompt",
  ];

  const sectionLabels: Record<string, string> = {
    basicConfig: t("sectionBasicConfig"),
    visualStyle: t("sectionVisualStyle"),
    visualElements: t("sectionVisualElements"),
    layoutTypography: t("sectionLayoutTypography"),
    textContent: t("sectionTextContent"),
    customPrompt: t("sectionCustomPrompt"),
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => onLoad(preset)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{preset.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(preset.createdAt)} • {t("fieldsConfigured", { count: totalFields })}
          </p>
        </div>
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLoad(preset)}>
                {t("loadPreset")}
              </DropdownMenuItem>
              {onPartialLoad && (
                <DropdownMenuItem onClick={() => onPartialLoad(preset)}>
                  {t("loadPartial")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(preset)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("edit")}
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(preset)}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t("duplicate")}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(preset)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => onLoad(preset)}
            >
              <CardTitle className="text-base truncate">{preset.name}</CardTitle>
              <CardDescription className="text-xs flex items-center gap-2">
                {formatDate(preset.createdAt)}
                <Badge variant="secondary" className="text-xs">
                  {t("fieldsConfigured", { count: totalFields })}
                </Badge>
              </CardDescription>
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onLoad(preset)}>
                    {t("loadAll")}
                  </DropdownMenuItem>
                  {onPartialLoad && (
                    <DropdownMenuItem onClick={() => onPartialLoad(preset)}>
                      {t("loadPartial")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(preset)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                  )}
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(preset)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {t("duplicate")}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(preset)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {tCommon("delete")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Compact Summary */}
          <div className="space-y-1 mb-2">
            <PresetSectionSummary section="basicConfig" config={preset.config} compact />
            <PresetSectionSummary section="visualStyle" config={preset.config} compact />
          </div>

          {/* Expand/Collapse */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-xs"
            >
              {expanded ? (
                <>
                  {t("collapseDetails")}
                  <ChevronUp className="h-3 w-3 ml-1" />
                </>
              ) : (
                <>
                  {t("expandDetails")}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <Separator className="my-3" />
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {sectionLabels[section]}
                  </p>
                  <PresetSectionSummary
                    section={section}
                    config={preset.config}
                    showEmpty
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <Separator className="my-3" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={() => onLoad(preset)}
              >
                {t("loadAll")}
              </Button>
              {onPartialLoad && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onPartialLoad(preset)}
                >
                  {t("loadPartial")}
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}
