"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "./view-mode-selector";

interface GalleryGridProps {
  children: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  isEmpty?: boolean;
  className?: string;
  viewMode?: ViewMode;
}

const gridClasses: Record<ViewMode, string> = {
  "grid-4": "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  "grid-2": "grid grid-cols-1 md:grid-cols-2 gap-6",
  "grid-1": "grid grid-cols-1 gap-6 max-w-4xl mx-auto",
  "masonry": "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4",
};

export function GalleryGrid({
  children,
  loading = false,
  emptyMessage = "No images found",
  isEmpty = false,
  className,
  viewMode = "grid-4",
}: GalleryGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(gridClasses[viewMode], className)}>
      {children}
    </div>
  );
}
