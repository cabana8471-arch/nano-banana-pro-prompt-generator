"use client";

import { useState } from "react";
import Image from "next/image";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Download, CheckCircle2, XCircle, Loader2, StopCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBannerResize } from "@/hooks/use-banner-resize";
import type { PlatformGenerationProgress as ProgressType } from "@/hooks/use-platform-generation";
import type { BannerExportFormat } from "@/lib/types/banner";

interface PlatformGenerationProgressProps {
  progress: ProgressType;
  exportFormat: BannerExportFormat;
  onCancel?: (() => void) | undefined;
}

export function PlatformGenerationProgress({
  progress,
  exportFormat,
  onCancel,
}: PlatformGenerationProgressProps) {
  const t = useTranslations("bannerGenerator.platformGeneration");
  const { resizeIfNeeded } = useBannerResize();
  const [isDownloading, setIsDownloading] = useState(false);

  const percentComplete = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const handleDownloadAll = async () => {
    if (progress.completed.length === 0) return;

    setIsDownloading(true);
    try {
      const zip = new JSZip();

      for (const completed of progress.completed) {
        const { size, images } = completed;

        for (let i = 0; i < images.length; i++) {
          const imageUrl = images[i];
          if (!imageUrl) continue;

          // Resize/convert the image
          const { blob } = await resizeIfNeeded(imageUrl, {
            targetWidth: size.width,
            targetHeight: size.height,
            mode: "cover",
            format: exportFormat,
            quality: 0.92,
          });

          // Create filename with size info
          const filename = `${size.name.replace(/[^a-zA-Z0-9]/g, "_")}_${size.width}x${size.height}.${exportFormat}`;

          zip.file(filename, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const timestamp = new Date().toISOString().slice(0, 10);
      saveAs(content, `platform-banners_${timestamp}.zip`);
    } catch (error) {
      console.error("Failed to download all banners:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSingle = async (imageUrl: string, sizeName: string, width: number, height: number) => {
    try {
      const { blob } = await resizeIfNeeded(imageUrl, {
        targetWidth: width,
        targetHeight: height,
        mode: "cover",
        format: exportFormat,
        quality: 0.92,
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${sizeName.replace(/[^a-zA-Z0-9]/g, "_")}_${width}x${height}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (progress.status === "idle") {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">
            {progress.status === "generating"
              ? t("generatingProgress", { current: progress.current + 1, total: progress.total })
              : progress.status === "completed"
                ? t("completed", { count: progress.completed.length })
                : t("error")}
          </p>
        </div>
        {progress.status === "generating" && onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            <StopCircle className="h-4 w-4 mr-2" />
            {t("cancel")}
          </Button>
        )}
        {progress.status === "completed" && progress.completed.length > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadAll}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t("downloadAll")}
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {progress.status === "generating" && (
        <div className="space-y-2">
          <Progress value={percentComplete} className="h-2" />
          {progress.currentSize && (
            <p className="text-xs text-muted-foreground">
              {t("currentlyGenerating", {
                name: progress.currentSize.name,
                width: progress.currentSize.width,
                height: progress.currentSize.height
              })}
            </p>
          )}
        </div>
      )}

      {/* Results Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid gap-3">
          {/* Completed Items */}
          {progress.completed.map((item, index) => (
            <Card key={`completed-${index}`} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div
                    className="relative shrink-0 bg-muted rounded overflow-hidden"
                    style={{
                      width: 80,
                      height: 60,
                    }}
                  >
                    {item.images[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.size.name}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="font-medium text-sm truncate">{item.size.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.size.width} × {item.size.height}px
                    </p>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => item.images[0] && handleDownloadSingle(
                      item.images[0],
                      item.size.name,
                      item.size.width,
                      item.size.height
                    )}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Currently Generating */}
          {progress.status === "generating" && progress.currentSize && (
            <Card className="overflow-hidden border-primary/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="relative shrink-0 bg-muted rounded overflow-hidden flex items-center justify-center"
                    style={{ width: 80, height: 60 }}
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {t("generating")}
                      </Badge>
                      <span className="font-medium text-sm truncate">{progress.currentSize.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {progress.currentSize.width} × {progress.currentSize.height}px
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failed Items */}
          {progress.failed.map((item, index) => (
            <Card key={`failed-${index}`} className="overflow-hidden border-destructive/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="relative shrink-0 bg-muted rounded overflow-hidden flex items-center justify-center"
                    style={{ width: 80, height: 60 }}
                  >
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      <span className="font-medium text-sm truncate">{item.size.name}</span>
                    </div>
                    <p className="text-xs text-destructive truncate">{item.error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Summary Stats */}
      {progress.status === "completed" && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {t("successCount", { count: progress.completed.length })}
          </span>
          {progress.failed.length > 0 && (
            <span className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-destructive" />
              {t("failedCount", { count: progress.failed.length })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
