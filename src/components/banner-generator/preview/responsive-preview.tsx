"use client";

import { useState } from "react";
import { Expand, Monitor, Smartphone, Tablet, Grid2X2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bannerSizeTemplates } from "@/lib/data/banner-templates";
import type { BannerSizeTemplate } from "@/lib/types/banner";

interface ResponsivePreviewProps {
  selectedBannerSize: BannerSizeTemplate | undefined;
  disabled?: boolean;
}

// Group sizes by platform/category for preview
const sizeGroups = {
  desktop: bannerSizeTemplates.filter(
    (s) =>
      s.platform === "google-ads" ||
      s.platform === "website" ||
      (s.category === "hero" || s.category === "billboard")
  ),
  mobile: bannerSizeTemplates.filter(
    (s) => s.category === "mobile" || s.category === "story"
  ),
  social: bannerSizeTemplates.filter(
    (s) =>
      s.platform === "facebook" ||
      s.platform === "instagram" ||
      s.category === "feed"
  ),
};

// Common comparison sizes
const comparisonSizes = [
  { id: "size-leaderboard-728x90", label: "Leaderboard" },
  { id: "size-medium-rectangle-300x250", label: "Rectangle" },
  { id: "size-mobile-banner-320x50", label: "Mobile" },
  { id: "size-facebook-square-1080x1080", label: "Square" },
  { id: "size-instagram-story-1080x1920", label: "Story" },
  { id: "size-hero-1920x600", label: "Hero" },
];

interface SizePreviewCardProps {
  size: BannerSizeTemplate;
  isSelected: boolean;
  maxWidth?: number;
}

function SizePreviewCard({ size, isSelected, maxWidth = 200 }: SizePreviewCardProps) {

  // Calculate scaled dimensions to fit within maxWidth while maintaining aspect ratio
  const aspectRatio = size.width / size.height;
  let displayWidth = Math.min(maxWidth, size.width / 4);
  let displayHeight = displayWidth / aspectRatio;

  // Cap height at 150px
  if (displayHeight > 150) {
    displayHeight = 150;
    displayWidth = displayHeight * aspectRatio;
  }

  // Ensure minimum dimensions
  displayWidth = Math.max(displayWidth, 40);
  displayHeight = Math.max(displayHeight, 20);

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
        isSelected ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"
      }`}
    >
      <div
        className="border-2 border-dashed rounded flex items-center justify-center text-[10px] text-muted-foreground bg-muted/30"
        style={{
          width: displayWidth,
          height: displayHeight,
          borderColor: isSelected ? "var(--primary)" : undefined,
        }}
      >
        {size.width}×{size.height}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium truncate max-w-[150px]">{size.name}</p>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full">
            {size.platform}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ResponsivePreview({
  selectedBannerSize,
  disabled = false,
}: ResponsivePreviewProps) {
  const t = useTranslations("bannerGenerator");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("comparison");

  // Get comparison sizes with their full data
  const comparisonSizeData = comparisonSizes
    .map((cs) => bannerSizeTemplates.find((s) => s.id === cs.id))
    .filter((s): s is BannerSizeTemplate => s !== undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Grid2X2 className="h-4 w-4" />
          {t("responsivePreview.buttonLabel")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("responsivePreview.title")}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comparison" className="gap-2">
              <Expand className="h-4 w-4" />
              {t("responsivePreview.tabs.comparison")}
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="h-4 w-4" />
              {t("responsivePreview.tabs.desktop")}
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              {t("responsivePreview.tabs.mobile")}
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Tablet className="h-4 w-4" />
              {t("responsivePreview.tabs.social")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("responsivePreview.comparisonDescription")}
              </p>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                  {comparisonSizeData.map((size) => (
                    <SizePreviewCard
                      key={size.id}
                      size={size}
                      isSelected={selectedBannerSize?.id === size.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("responsivePreview.desktopDescription")}
              </p>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                  {sizeGroups.desktop.map((size) => (
                    <SizePreviewCard
                      key={size.id}
                      size={size}
                      isSelected={selectedBannerSize?.id === size.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("responsivePreview.mobileDescription")}
              </p>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                  {sizeGroups.mobile.map((size) => (
                    <SizePreviewCard
                      key={size.id}
                      size={size}
                      isSelected={selectedBannerSize?.id === size.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("responsivePreview.socialDescription")}
              </p>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
                  {sizeGroups.social.map((size) => (
                    <SizePreviewCard
                      key={size.id}
                      size={size}
                      isSelected={selectedBannerSize?.id === size.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {selectedBannerSize && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">{t("responsivePreview.currentSelection")}:</span>{" "}
              {selectedBannerSize.name} ({selectedBannerSize.width}×{selectedBannerSize.height}px)
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
