"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, User, Package } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Textarea } from "@/components/ui/textarea";
import type { Avatar, AvatarType } from "@/lib/types/generation";

interface AvatarFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatar?: Avatar | undefined; // If provided, we're editing
  onSubmit: (data: {
    name: string;
    description: string;
    avatarType: AvatarType;
    image?: File | undefined;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function AvatarFormModal({
  open,
  onOpenChange,
  avatar,
  onSubmit,
  isSubmitting,
}: AvatarFormModalProps) {
  const t = useTranslations("avatars");
  const tCommon = useTranslations("common");
  const [name, setName] = useState(avatar?.name || "");
  const [description, setDescription] = useState(avatar?.description || "");
  const [avatarType, setAvatarType] = useState<AvatarType>(avatar?.avatarType || "human");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(avatar?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!avatar;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(avatar?.imageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description,
      avatarType,
      image: imageFile || undefined,
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName(avatar?.name || "");
      setDescription(avatar?.description || "");
      setAvatarType(avatar?.avatarType || "human");
      setImageFile(null);
      setImagePreview(avatar?.imageUrl || null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("editAvatar") : t("createAvatar")}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("updateDescription")
              : t("createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          {!isEditing && (
            <div className="space-y-2">
              <Label>{t("referenceImage")}</Label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("clickToUpload")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("imageFormats")}
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="avatar-name">{t("name")}</Label>
            <Input
              id="avatar-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="avatar-description">{t("descriptionLabel")}</Label>
            <Textarea
              id="avatar-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Avatar Type */}
          <div className="space-y-2">
            <Label>{t("type")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAvatarType("human")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  avatarType === "human"
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <User className="h-6 w-6" />
                <span className="font-medium">{t("typeHuman")}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {t("humanDescription")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarType("object")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  avatarType === "object"
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <Package className="h-6 w-6" />
                <span className="font-medium">{t("typeObject")}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {t("objectDescription")}
                </span>
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (!isEditing && !imageFile) || !name.trim()}
            >
              {isSubmitting ? t("saving") : isEditing ? tCommon("saveChanges") : t("createAvatar")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
