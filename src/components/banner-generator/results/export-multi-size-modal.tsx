"use client";

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Globe,
  Mail,
  Download,
  Loader2,
  Check,
  Youtube,
  Pin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBannerResize } from "@/hooks/use-banner-resize";
import {
  PLATFORM_PRESETS,
  type PlatformSizePreset,
  type BannerExportFormat,
} from "@/lib/types/banner";

// Platform icons mapping
const PlatformIcon = ({ icon }: { icon: string }) => {
  const iconClass = "h-4 w-4";

  switch (icon) {
    case "google":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "pin":
      return <Pin className={iconClass} />;
    case "youtube":
      return <Youtube className={iconClass} />;
    case "tiktok":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "mail":
      return <Mail className={iconClass} />;
    case "globe":
      return <Globe className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
  }
};

interface SelectedSize {
  platformId: string;
  platformName: string;
  size: PlatformSizePreset;
}

interface ExportMultiSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageIndex: number;
  exportFormat: BannerExportFormat;
}

export function ExportMultiSizeModal({
  open,
  onOpenChange,
  imageUrl,
  imageIndex,
  exportFormat,
}: ExportMultiSizeModalProps) {
  const t = useTranslations("bannerGenerator.multiSizeExport");
  const { resizeImage } = useBannerResize();

  const [selectedSizes, setSelectedSizes] = useState<SelectedSize[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentExportItem, setCurrentExportItem] = useState("");

  const toggleSize = useCallback(
    (platformId: string, platformName: string, size: PlatformSizePreset) => {
      setSelectedSizes((prev) => {
        const exists = prev.some(
          (s) =>
            s.platformId === platformId &&
            s.size.width === size.width &&
            s.size.height === size.height
        );

        if (exists) {
          return prev.filter(
            (s) =>
              !(
                s.platformId === platformId &&
                s.size.width === size.width &&
                s.size.height === size.height
              )
          );
        } else {
          return [...prev, { platformId, platformName, size }];
        }
      });
    },
    []
  );

  const togglePlatform = useCallback((platformId: string) => {
    const platform = PLATFORM_PRESETS.find((p) => p.id === platformId);
    if (!platform) return;

    setSelectedSizes((prev) => {
      const platformSizes = prev.filter((s) => s.platformId === platformId);
      const allSelected = platformSizes.length === platform.sizes.length;

      if (allSelected) {
        // Deselect all from this platform
        return prev.filter((s) => s.platformId !== platformId);
      } else {
        // Select all from this platform
        const otherPlatforms = prev.filter((s) => s.platformId !== platformId);
        const allPlatformSizes = platform.sizes.map((size) => ({
          platformId,
          platformName: platform.name,
          size,
        }));
        return [...otherPlatforms, ...allPlatformSizes];
      }
    });
  }, []);

  const selectAll = useCallback(() => {
    const allSizes: SelectedSize[] = [];
    for (const platform of PLATFORM_PRESETS) {
      for (const size of platform.sizes) {
        allSizes.push({
          platformId: platform.id,
          platformName: platform.name,
          size,
        });
      }
    }
    setSelectedSizes(allSizes);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedSizes([]);
  }, []);

  const isSizeSelected = useCallback(
    (platformId: string, size: PlatformSizePreset) => {
      return selectedSizes.some(
        (s) =>
          s.platformId === platformId &&
          s.size.width === size.width &&
          s.size.height === size.height
      );
    },
    [selectedSizes]
  );

  const getPlatformSelectionState = useCallback(
    (platformId: string) => {
      const platform = PLATFORM_PRESETS.find((p) => p.id === platformId);
      if (!platform) return "none";

      const selectedCount = selectedSizes.filter(
        (s) => s.platformId === platformId
      ).length;

      if (selectedCount === 0) return "none";
      if (selectedCount === platform.sizes.length) return "all";
      return "partial";
    },
    [selectedSizes]
  );

  const handleExport = useCallback(async () => {
    if (selectedSizes.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();
      const totalItems = selectedSizes.length;

      for (let i = 0; i < selectedSizes.length; i++) {
        const item = selectedSizes[i];
        if (!item) continue;

        const folderName = item.platformName.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${item.size.name.replace(/[^a-zA-Z0-9]/g, "_")}_${item.size.width}x${item.size.height}.${exportFormat}`;

        setCurrentExportItem(`${item.platformName} - ${item.size.name}`);

        // Resize image to target dimensions
        const blob = await resizeImage(imageUrl, {
          targetWidth: item.size.width,
          targetHeight: item.size.height,
          mode: "cover",
          format: exportFormat,
          quality: 0.92,
        });

        // Add to zip
        const folder = zip.folder(folderName);
        folder?.file(fileName, blob);

        setExportProgress(((i + 1) / totalItems) * 100);
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      const timestamp = new Date().toISOString().slice(0, 10);
      saveAs(content, `banners_multisize_${imageIndex + 1}_${timestamp}.zip`);

      // Close modal after successful export
      onOpenChange(false);
      setSelectedSizes([]);
    } catch (error) {
      console.error("Failed to export multi-size banners:", error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setCurrentExportItem("");
    }
  }, [
    selectedSizes,
    imageUrl,
    imageIndex,
    exportFormat,
    resizeImage,
    onOpenChange,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b">
          <div className="text-sm text-muted-foreground">
            {t("selectedCount", { count: selectedSizes.length })}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {t("selectAll")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={selectedSizes.length === 0}
            >
              {t("clearAll")}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <Accordion type="multiple" className="w-full">
            {PLATFORM_PRESETS.map((platform) => {
              const selectionState = getPlatformSelectionState(platform.id);
              const selectedCount = selectedSizes.filter(
                (s) => s.platformId === platform.id
              ).length;

              return (
                <AccordionItem key={platform.id} value={platform.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlatform(platform.id);
                        }}
                      >
                        {selectionState === "all" ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : selectionState === "partial" ? (
                          <div className="h-2 w-2 bg-primary rounded-sm" />
                        ) : (
                          <PlatformIcon icon={platform.icon} />
                        )}
                      </div>
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto mr-4">
                        {selectedCount > 0 &&
                          `${selectedCount}/${platform.sizes.length}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-11">
                      {platform.sizes.map((size) => {
                        const isSelected = isSizeSelected(platform.id, size);
                        return (
                          <label
                            key={`${platform.id}-${size.width}x${size.height}`}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleSize(platform.id, platform.name, size)
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {size.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {size.width} × {size.height}px
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>

        {isExporting && (
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{currentExportItem}</span>
              <span>{Math.round(exportProgress)}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedSizes.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("exporting")}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t("exportSelected", { count: selectedSizes.length })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
