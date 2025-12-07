"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Download, ExternalLink, FileImage, FolderPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBannerResize } from "@/hooks/use-banner-resize";
import type { BannerSizeTemplate, BannerExportFormat } from "@/lib/types/banner";
import type { Project, CreateProjectInput } from "@/lib/types/project";
import { BannerRefineInput } from "./banner-refine-input";
import { AddToProjectModal } from "../projects/add-to-project-modal";

interface BannerResultsPanelProps {
  images: string[];
  isGenerating: boolean;
  expectedCount: number;
  generationId?: string | undefined;
  onRefine?: ((instruction: string, selectedImageId?: string) => Promise<void>) | undefined;
  isRefining?: boolean | undefined;
  selectedBannerSize?: BannerSizeTemplate | undefined;
  exportFormat: BannerExportFormat;
  // Project props
  projects: Project[];
  projectsLoading: boolean;
  currentProjectId?: string | null | undefined;
  onAddToProject: (generationId: string, projectId: string) => Promise<boolean>;
  onCreateProject: (input: CreateProjectInput) => Promise<Project | null>;
}

export function BannerResultsPanel({
  images,
  isGenerating,
  expectedCount,
  generationId,
  onRefine,
  isRefining = false,
  selectedBannerSize,
  exportFormat,
  projects,
  projectsLoading,
  currentProjectId,
  onAddToProject,
  onCreateProject,
}: BannerResultsPanelProps) {
  const t = useTranslations("bannerGenerator.results");
  const tProjects = useTranslations("bannerGenerator.projects");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [addToProjectModalOpen, setAddToProjectModalOpen] = useState(false);
  const hasImages = images.length > 0;
  const fullscreenImage = fullscreenIndex !== null ? images[fullscreenIndex] : null;
  const { resizeIfNeeded } = useBannerResize();

  const handleRefine = async (instruction: string) => {
    if (onRefine) {
      await onRefine(instruction, undefined);
    }
  };

  const handleDownload = useCallback(
    async (url: string, index: number, format?: BannerExportFormat) => {
      try {
        const extension = format || exportFormat || "png";
        const sizeSuffix = selectedBannerSize
          ? `_${selectedBannerSize.width}x${selectedBannerSize.height}`
          : "";
        const filename = `banner${sizeSuffix}_${index + 1}.${extension}`;

        let finalBlob: Blob;

        // If we have target dimensions, resize the image to guarantee exact dimensions
        if (selectedBannerSize && selectedBannerSize.width > 0 && selectedBannerSize.height > 0) {
          const { blob } = await resizeIfNeeded(url, {
            targetWidth: selectedBannerSize.width,
            targetHeight: selectedBannerSize.height,
            mode: "cover", // Cover mode crops to fit exact dimensions
            format: extension,
            quality: 0.92,
          });
          finalBlob = blob;
        } else {
          // No specific dimensions, just convert format
          const response = await fetch(url);
          const originalBlob = await response.blob();

          // Create an image element to load the blob
          const img = new window.Image();
          const blobUrl = URL.createObjectURL(originalBlob);

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = blobUrl;
          });

          // Create canvas and draw the image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new Error("Failed to get canvas context");
          }

          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(blobUrl);

          // Determine MIME type and quality based on format
          const mimeType =
            extension === "jpg"
              ? "image/jpeg"
              : extension === "webp"
                ? "image/webp"
                : "image/png";
          const quality = extension === "png" ? undefined : 0.92;

          // Convert to blob
          finalBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Failed to convert image"));
                }
              },
              mimeType,
              quality
            );
          });
        }

        // Download the processed blob
        const downloadUrl = URL.createObjectURL(finalBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Failed to download image:", error);
      }
    },
    [exportFormat, selectedBannerSize, resizeIfNeeded]
  );

  const handleOpenInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  // Calculate aspect ratio for skeleton preview
  const aspectRatio = selectedBannerSize
    ? selectedBannerSize.width / selectedBannerSize.height
    : 1;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          {hasImages && generationId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddToProjectModalOpen(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              {tProjects("addToProject")}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {!hasImages && !isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileImage className="h-12 w-12 mb-4" />
              <p className="text-lg">{t("noImages")}</p>
              <p className="text-sm">{t("buildPrompt")}</p>
            </div>
          ) : (
            <>
              {/* Image Grid */}
              <div
                className={`grid gap-4 ${
                  aspectRatio > 2
                    ? "grid-cols-1"
                    : aspectRatio > 1.2
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-2"
                }`}
              >
                {isGenerating ? (
                  // Show skeletons while generating
                  Array.from({ length: expectedCount }).map((_, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-lg"
                      style={{ aspectRatio: aspectRatio }}
                    >
                      <Skeleton className="w-full h-full" />
                    </div>
                  ))
                ) : (
                  // Show generated images
                  images.map((url, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border bg-muted relative cursor-pointer transition-all group hover:ring-2 hover:ring-primary"
                      style={{ aspectRatio: aspectRatio }}
                      onClick={() => setFullscreenIndex(i)}
                    >
                      <Image
                        src={url}
                        alt={`${t("generatedBanner")} ${i + 1}`}
                        fill
                        className="object-contain bg-muted"
                        sizes="(max-width: 640px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          {t("clickToView")}
                        </span>
                      </div>
                      {/* Quick download button */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(url, i, "png");
                              }}
                            >
                              {t("downloadAsPng")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(url, i, "jpg");
                              }}
                            >
                              {t("downloadAsJpg")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(url, i, "webp");
                              }}
                            >
                              {t("downloadAsWebp")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Refinement Section */}
              {hasImages && generationId && onRefine && (
                <>
                  <Separator />
                  <BannerRefineInput
                    onRefine={handleRefine}
                    isRefining={isRefining}
                    disabled={isGenerating}
                  />
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Fullscreen Image Dialog */}
      <Dialog
        open={fullscreenIndex !== null}
        onOpenChange={(open) => !open && setFullscreenIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <DialogTitle className="sr-only">
            {t("generatedBanner")} {fullscreenIndex !== null ? fullscreenIndex + 1 : ""}
          </DialogTitle>
          {fullscreenIndex !== null && fullscreenImage && (
            <div className="relative w-full h-[90vh] flex items-center justify-center">
              <Image
                src={fullscreenImage}
                alt={`${t("generatedBanner")} ${fullscreenIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />

              {/* Action buttons */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {t("download")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleDownload(fullscreenImage, fullscreenIndex, "png")}
                    >
                      {t("downloadAsPng")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(fullscreenImage, fullscreenIndex, "jpg")}
                    >
                      {t("downloadAsJpg")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(fullscreenImage, fullscreenIndex, "webp")}
                    >
                      {t("downloadAsWebp")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenInNewTab(fullscreenImage)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("openInNewTab")}
                </Button>
              </div>

              {/* Navigation for multiple images */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() =>
                      setFullscreenIndex((fullscreenIndex - 1 + images.length) % images.length)
                    }
                  >
                    <span className="text-2xl">&lt;</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setFullscreenIndex((fullscreenIndex + 1) % images.length)}
                  >
                    <span className="text-2xl">&gt;</span>
                  </Button>

                  {/* Image counter */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {t("imageCounter", { current: fullscreenIndex + 1, total: images.length })}
                  </div>
                </>
              )}

              {/* Banner size info */}
              {selectedBannerSize && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedBannerSize.width} × {selectedBannerSize.height}px
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to Project Modal */}
      {generationId && (
        <AddToProjectModal
          open={addToProjectModalOpen}
          onOpenChange={setAddToProjectModalOpen}
          projects={projects}
          projectsLoading={projectsLoading}
          generationId={generationId}
          currentProjectId={currentProjectId}
          onAddToProject={onAddToProject}
          onCreateProject={onCreateProject}
        />
      )}
    </div>
  );
}
