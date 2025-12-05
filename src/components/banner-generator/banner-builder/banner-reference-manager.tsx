"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, X, Check, Upload, Loader2, Trash2, Palette, Layout, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RESOURCE_LIMITS } from "@/lib/constants";
import type { BannerReference, BannerReferenceType, CreateBannerReferenceInput } from "@/lib/types/banner";

interface BannerReferenceManagerProps {
  bannerReferences: BannerReference[];
  selectedReferenceIds: string[];
  isLoading: boolean;
  onCreateReference: (input: CreateBannerReferenceInput, image: File) => Promise<BannerReference | null>;
  onDeleteReference: (id: string) => Promise<boolean>;
  onSelectionChange: (ids: string[]) => void;
}

const referenceTypeIcons: Record<BannerReferenceType, React.ReactNode> = {
  style: <Sparkles className="h-3 w-3" />,
  composition: <Layout className="h-3 w-3" />,
  color: <Palette className="h-3 w-3" />,
};

const referenceTypeColors: Record<BannerReferenceType, string> = {
  style: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  composition: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

export function BannerReferenceManager({
  bannerReferences,
  selectedReferenceIds,
  isLoading,
  onCreateReference,
  onDeleteReference,
  onSelectionChange,
}: BannerReferenceManagerProps) {
  const t = useTranslations("bannerGenerator.referenceImages");
  const tCommon = useTranslations("common");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<BannerReference | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [referenceType, setReferenceType] = useState<BannerReferenceType>("style");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxReferences = RESOURCE_LIMITS.MAX_BANNER_REFERENCES_PER_GENERATION;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setReferenceType("style");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !name.trim()) return;

    setIsUploading(true);
    try {
      const input: CreateBannerReferenceInput = {
        name: name.trim(),
        referenceType,
      };
      if (description.trim()) {
        input.description = description.trim();
      }
      const result = await onCreateReference(input, selectedFile);

      if (result) {
        resetForm();
        setUploadDialogOpen(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!referenceToDelete) return;

    setIsDeleting(true);
    try {
      const success = await onDeleteReference(referenceToDelete.id);
      if (success) {
        // Remove from selection if it was selected
        if (selectedReferenceIds.includes(referenceToDelete.id)) {
          onSelectionChange(selectedReferenceIds.filter((id) => id !== referenceToDelete.id));
        }
        setDeleteDialogOpen(false);
        setReferenceToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedReferenceIds.includes(id)) {
      onSelectionChange(selectedReferenceIds.filter((i) => i !== id));
    } else if (selectedReferenceIds.length < maxReferences) {
      onSelectionChange([...selectedReferenceIds, id]);
    }
  };

  const openDeleteDialog = (reference: BannerReference, e: React.MouseEvent) => {
    e.stopPropagation();
    setReferenceToDelete(reference);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            {t("title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="gap-2"
        >
          <ImagePlus className="h-4 w-4" />
          {t("uploadNew")}
        </Button>
      </div>

      {/* Selection info */}
      {selectedReferenceIds.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">
            {t("selectedCount", { count: selectedReferenceIds.length })}
          </Badge>
          {selectedReferenceIds.length >= maxReferences && (
            <span className="text-xs text-muted-foreground">
              {t("maxSelected", { max: maxReferences })}
            </span>
          )}
        </div>
      )}

      {/* Reference grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : bannerReferences.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{t("noReferences")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("noReferencesHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {bannerReferences.map((ref) => {
            const isSelected = selectedReferenceIds.includes(ref.id);
            const canSelect = isSelected || selectedReferenceIds.length < maxReferences;

            return (
              <div
                key={ref.id}
                className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-primary border-primary"
                    : canSelect
                      ? "hover:border-primary/50"
                      : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canSelect && toggleSelection(ref.id)}
              >
                <div className="aspect-video relative">
                  <Image
                    src={ref.imageUrl}
                    alt={ref.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {/* Selection overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  {/* Hover overlay with delete button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => openDeleteDialog(ref, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 bg-muted/50">
                  <p className="text-sm font-medium truncate">{ref.name}</p>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-xs gap-1 ${referenceTypeColors[ref.referenceType]}`}
                  >
                    {referenceTypeIcons[ref.referenceType]}
                    {t(`types.${ref.referenceType}`)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image upload area */}
            <div className="space-y-2">
              <Label>{t("form.image")}</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors ${
                  previewUrl ? "border-primary" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {previewUrl ? (
                  <div className="relative aspect-video max-h-48 mx-auto">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">{t("form.dropHint")}</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="ref-name">{t("form.name")}</Label>
              <Input
                id="ref-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.namePlaceholder")}
              />
            </div>

            {/* Reference Type */}
            <div className="space-y-2">
              <Label>{t("form.type")}</Label>
              <Select value={referenceType} onValueChange={(v) => setReferenceType(v as BannerReferenceType)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="style">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <div>
                        <span>{t("types.style")}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {t("types.styleDescription")}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="composition">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4 text-blue-500" />
                      <div>
                        <span>{t("types.composition")}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {t("types.compositionDescription")}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="color">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-orange-500" />
                      <div>
                        <span>{t("types.color")}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {t("types.colorDescription")}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ref-description">{t("form.description")}</Label>
              <Textarea
                id="ref-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !name.trim() || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("form.uploading")}
                </>
              ) : (
                t("form.upload")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("delete.confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("delete.deleting")}
                </>
              ) : (
                tCommon("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
