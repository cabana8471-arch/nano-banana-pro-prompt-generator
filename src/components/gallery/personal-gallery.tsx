"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FolderOpen, Search, Star, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/use-projects";
import type {
  GenerationWithImages,
  GeneratedImage,
  GenerationSettings,
  GenerationType,
  PaginatedResponse,
} from "@/lib/types/generation";
import type { CreateProjectInput } from "@/lib/types/project";
import { GalleryGrid } from "./gallery-grid";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";
import { ViewModeSelector, type ViewMode } from "./view-mode-selector";

const GALLERY_VIEW_MODE_KEY = "gallery-view-mode";

export type PersonalImage = GeneratedImage & {
  generation: {
    id: string;
    prompt: string;
    settings: GenerationSettings;
    createdAt: Date;
    projectId: string | null;
    generationType: GenerationType;
    builderConfig: Record<string, unknown> | null;
  };
};

type FilterType = "all" | GenerationType;

function getInitialViewMode(): ViewMode {
  if (typeof window === "undefined") return "grid-4";
  const stored = localStorage.getItem(GALLERY_VIEW_MODE_KEY);
  if (stored && ["grid-4", "grid-3", "grid-2", "grid-1", "masonry"].includes(stored)) {
    return stored as ViewMode;
  }
  return "grid-4";
}

export function PersonalGallery() {
  const t = useTranslations("gallery");
  const { projects, isLoading: projectsLoading, createProject } = useProjects();
  const [images, setImages] = useState<PersonalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<PersonalImage | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");

  // Search & filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  // Load view mode from localStorage on mount
  useEffect(() => {
    setViewMode(getInitialViewMode());
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(GALLERY_VIEW_MODE_KEY, mode);
  };

  const fetchImages = useCallback(async (
    pageNum: number,
    filterType: FilterType,
    projectId: string | null,
    searchTerm: string,
    sort: string,
    visibility: string,
    favorites: boolean,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: "20",
      });
      if (filterType !== "all") {
        params.append("type", filterType);
      }
      if (projectId) {
        params.append("projectId", projectId);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (sort !== "newest") {
        params.append("sort", sort);
      }
      if (visibility !== "all") {
        params.append("visibility", visibility);
      }
      if (favorites) {
        params.append("favorites", "true");
      }

      const response = await fetch(`/api/generations?${params.toString()}`);
      if (response.ok) {
        const data: PaginatedResponse<GenerationWithImages> = await response.json();

        // Flatten generations into individual images
        const flatImages: PersonalImage[] = data.items.flatMap((gen) =>
          gen.images.map((img) => ({
            ...img,
            generation: {
              id: gen.id,
              prompt: gen.prompt,
              settings: gen.settings,
              createdAt: gen.createdAt,
              projectId: gen.projectId,
              generationType: gen.generationType,
              builderConfig: gen.builderConfig,
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
    fetchImages(page, filter, projectFilter, debouncedSearch, sortBy, visibilityFilter, favoritesOnly);
  }, [page, filter, projectFilter, debouncedSearch, sortBy, visibilityFilter, favoritesOnly, fetchImages]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleProjectFilterChange = (projectId: string | null) => {
    setProjectFilter(projectId);
    setPage(1);
  };

  const handleVisibilityChange = (imageId: string, isPublic: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, isPublic } : img))
    );
    if (selectedImage?.id === imageId) {
      setSelectedImage({ ...selectedImage, isPublic });
    }
  };

  const handleFavoriteToggle = async (imageId: string, _shouldFavorite: boolean) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      if (response.ok) {
        const data = await response.json();
        const isFavorited = data.isFavorited as boolean;
        setImages((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, isFavorited } : img))
        );
        if (selectedImage?.id === imageId) {
          setSelectedImage({ ...selectedImage, isFavorited });
        }
        toast.success(isFavorited ? t("addedToFavorites") : t("removedFromFavorites"));
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleAddToProject = async (generationId: string, projectId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/generations/${generationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (response.ok) {
        const project = projects.find((p) => p.id === projectId);
        toast.success(t("addedToProject", { name: project?.name ?? "" }));
        setImages((prev) =>
          prev.map((img) =>
            img.generation.id === generationId
              ? { ...img, generation: { ...img.generation, projectId } }
              : img
          )
        );
        if (selectedImage?.generation.id === generationId) {
          setSelectedImage({
            ...selectedImage,
            generation: { ...selectedImage.generation, projectId },
          });
        }
        return true;
      }
      toast.error(t("failedToAddToProject"));
      return false;
    } catch {
      toast.error(t("failedToAddToProject"));
      return false;
    }
  };

  const handleCreateProject = async (input: CreateProjectInput) => {
    const project = await createProject(input);
    if (project) {
      toast.success(t("projectCreated", { name: input.name }));
    } else {
      toast.error(t("failedToCreateProject"));
    }
    return project;
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      {/* Filter Tabs, Project Filter, and View Mode */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Tabs value={filter} onValueChange={(v) => handleFilterChange(v as FilterType)}>
            <TabsList>
              <TabsTrigger value="all">{t("filterAll")}</TabsTrigger>
              <TabsTrigger value="photo">{t("filterPhotos")}</TabsTrigger>
              <TabsTrigger value="banner">{t("filterBanners")}</TabsTrigger>
              <TabsTrigger value="logo">{t("filterLogos")}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <Select
              value={projectFilter || "all"}
              onValueChange={(v) => handleProjectFilterChange(v === "all" ? null : v)}
              disabled={projectsLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("allProjects")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allProjects")}</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode Selector and Trash Link */}
        <div className="flex items-center gap-2">
          <ViewModeSelector value={viewMode} onChange={handleViewModeChange} />
          <Link href="/gallery/trash">
            <Button variant="ghost" size="icon" title={t("trash")}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Search, Sort, Visibility, Favorites */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v as "newest" | "oldest"); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sortNewest")}</SelectItem>
            <SelectItem value="oldest">{t("sortOldest")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Visibility Filter */}
        <Select
          value={visibilityFilter}
          onValueChange={(v) => { setVisibilityFilter(v as "all" | "public" | "private"); setPage(1); }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            <SelectItem value="public">{t("filterPublic")}</SelectItem>
            <SelectItem value="private">{t("filterPrivate")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Favorites Toggle */}
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => { setFavoritesOnly(!favoritesOnly); setPage(1); }}
          className="gap-1.5"
        >
          <Star className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
          {t("favorites")}
        </Button>
      </div>

      <GalleryGrid
        loading={loading}
        isEmpty={images.length === 0}
        emptyMessage={favoritesOnly ? t("noFavorites") : t("noImagesYet")}
        viewMode={viewMode}
      >
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            showVisibilityToggle
            onClick={() => setSelectedImage(image)}
            onVisibilityChange={handleVisibilityChange}
            onFavoriteToggle={handleFavoriteToggle}
            viewMode={viewMode}
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
        onFavoriteToggle={handleFavoriteToggle}
        projects={projects}
        projectsLoading={projectsLoading}
        onAddToProject={handleAddToProject}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}
