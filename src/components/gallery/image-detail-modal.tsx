"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Download, Copy, Check, ExternalLink, X, FolderPlus, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { AddToProjectModal } from "@/components/banner-generator/projects/add-to-project-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GalleryImage, GeneratedImage, GenerationSettings } from "@/lib/types/generation";
import type { Project, CreateProjectInput } from "@/lib/types/project";
import { VisibilityToggle } from "./visibility-toggle";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GalleryImageModalProps extends BaseModalProps {
  image: GalleryImage | null;
  showUser?: boolean;
  showVisibilityToggle?: false;
}

interface PersonalImageModalProps extends BaseModalProps {
  image: (GeneratedImage & {
    generation: {
      id: string;
      prompt: string;
      settings: GenerationSettings;
      createdAt: Date;
      projectId: string | null;
    };
  }) | null;
  showUser?: false;
  showVisibilityToggle?: boolean;
  onVisibilityChange?: (imageId: string, isPublic: boolean) => void;
  // Project props (optional for personal gallery)
  projects?: Project[];
  projectsLoading?: boolean;
  onAddToProject?: (generationId: string, projectId: string) => Promise<boolean>;
  onCreateProject?: (input: CreateProjectInput) => Promise<Project | null>;
}

type ImageDetailModalProps = GalleryImageModalProps | PersonalImageModalProps;

function isGalleryImage(image: GalleryImageModalProps["image"] | PersonalImageModalProps["image"]): image is GalleryImage {
  return image !== null && "user" in image;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ImageDetailModal({
  image,
  open,
  onOpenChange,
  showUser = false,
  showVisibilityToggle = false,
  ...props
}: ImageDetailModalProps) {
  const t = useTranslations("gallery");
  const tProjects = useTranslations("bannerGenerator.projects");
  const [copied, setCopied] = useState(false);
  const [addToProjectModalOpen, setAddToProjectModalOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const onVisibilityChange = "onVisibilityChange" in props ? props.onVisibilityChange : undefined;
  const projects = "projects" in props ? props.projects : undefined;
  const projectsLoading = "projectsLoading" in props ? props.projectsLoading : false;
  const onAddToProject = "onAddToProject" in props ? props.onAddToProject : undefined;
  const onCreateProject = "onCreateProject" in props ? props.onCreateProject : undefined;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!image || !open || !mounted) return null;

  const prompt = image.generation.prompt;
  const settings = image.generation.settings;
  const createdAt = new Date(image.createdAt);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: "jpg" | "webp" | "avif" = "jpg") => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();

      // Convert image to requested format using canvas
      const img = new window.Image();
      const originalUrl = window.URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const mimeType = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/avif";
        const quality = 0.92;

        canvas.toBlob((convertedBlob) => {
          if (!convertedBlob) return;

          const downloadUrl = window.URL.createObjectURL(convertedBlob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `nano-banana-${image.id}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
          window.URL.revokeObjectURL(originalUrl);
          document.body.removeChild(a);
        }, mimeType, quality);
      };

      img.src = originalUrl;
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const content = (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-background/80 hover:bg-background"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-5 w-5" />
        <span className="sr-only">{t("close")}</span>
      </Button>

      {/* Full-screen container */}
      <div className="h-full w-full flex flex-col p-4">
        {/* Image container - fills all available space */}
        <div className="relative flex-1 min-h-0">
          <Image
            src={image.imageUrl}
            alt={prompt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Details bar at bottom */}
        <div className="shrink-0 pt-3 pb-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Left side: user/time and settings */}
            <div className="flex items-center gap-3 text-sm">
              {showUser && isGalleryImage(image) && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={image.user.image || undefined} alt={image.user.name} />
                    <AvatarFallback className="text-xs">
                      {image.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{image.user.name}</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                  </span>
                </div>
              )}
              {!showUser && (
                <span className="text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              )}
              <Badge variant="secondary" className="text-xs">{settings.resolution}</Badge>
              <Badge variant="secondary" className="text-xs">{settings.aspectRatio}</Badge>
            </div>

            {/* Right side: actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCopyPrompt} className="h-8 gap-1.5">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? t("copied") : t("copyPrompt")}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("download")}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload("jpg")}>
                    {t("downloadAsJpg")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("webp")}>
                    {t("downloadAsWebp")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("avif")}>
                    {t("downloadAsAvif")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(image.imageUrl, "_blank")}
                className="h-8 gap-1.5"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">{t("open")}</span>
              </Button>
              {showVisibilityToggle && (
                <VisibilityToggle
                  imageId={image.id}
                  isPublic={image.isPublic}
                  onToggle={onVisibilityChange}
                />
              )}
              {/* Add to Project button - only for personal images with project support */}
              {!isGalleryImage(image) && projects && onAddToProject && onCreateProject && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddToProjectModalOpen(true)}
                  className="h-8 gap-1.5"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">{tProjects("addToProject")}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Prompt text */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{prompt}</p>
        </div>
      </div>

      {/* Add to Project Modal */}
      {!isGalleryImage(image) && projects && onAddToProject && onCreateProject && (
        <AddToProjectModal
          open={addToProjectModalOpen}
          onOpenChange={setAddToProjectModalOpen}
          projects={projects}
          projectsLoading={projectsLoading ?? false}
          generationId={image.generation.id}
          currentProjectId={image.generation.projectId}
          onAddToProject={onAddToProject}
          onCreateProject={onCreateProject}
        />
      )}
    </div>
  );

  return createPortal(content, document.body);
}
