"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GenerationWithImages,
  GeneratedImage,
  GenerationSettings,
  GenerationType,
  PaginatedResponse,
} from "@/lib/types/generation";
import { GalleryGrid } from "./gallery-grid";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";

type PersonalImage = GeneratedImage & {
  generation: {
    prompt: string;
    settings: GenerationSettings;
    createdAt: Date;
  };
};

type FilterType = "all" | GenerationType;

export function PersonalGallery() {
  const t = useTranslations("gallery");
  const [images, setImages] = useState<PersonalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<PersonalImage | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchImages = useCallback(async (pageNum: number, filterType: FilterType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: "20",
      });
      if (filterType !== "all") {
        params.append("type", filterType);
      }

      const response = await fetch(`/api/generations?${params.toString()}`);
      if (response.ok) {
        const data: PaginatedResponse<GenerationWithImages> = await response.json();

        // Flatten generations into individual images
        const flatImages: PersonalImage[] = data.items.flatMap((gen) =>
          gen.images.map((img) => ({
            ...img,
            generation: {
              prompt: gen.prompt,
              settings: gen.settings,
              createdAt: gen.createdAt,
            },
          }))
        );

        setImages(flatImages);
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(page, filter);
  }, [page, filter, fetchImages]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const handleVisibilityChange = (imageId: string, isPublic: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, isPublic } : img))
    );
    if (selectedImage?.id === imageId) {
      setSelectedImage({ ...selectedImage, isPublic });
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-6">
        <Tabs value={filter} onValueChange={(v) => handleFilterChange(v as FilterType)}>
          <TabsList>
            <TabsTrigger value="all">{t("filterAll")}</TabsTrigger>
            <TabsTrigger value="photo">{t("filterPhotos")}</TabsTrigger>
            <TabsTrigger value="banner">{t("filterBanners")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <GalleryGrid
        loading={loading}
        isEmpty={images.length === 0}
        emptyMessage={t("noImagesYet")}
      >
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            showVisibilityToggle
            onClick={() => setSelectedImage(image)}
            onVisibilityChange={handleVisibilityChange}
          />
        ))}
      </GalleryGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pageOf", { current: page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
          >
            {t("next")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        showVisibilityToggle
        onVisibilityChange={handleVisibilityChange}
      />
    </>
  );
}
