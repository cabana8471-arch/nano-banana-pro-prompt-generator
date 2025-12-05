"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Palette, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AvatarSelectorModal } from "@/components/avatars/avatar-selector-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BannerBrandAssets } from "@/lib/types/banner";
import type { Avatar, AvatarType } from "@/lib/types/generation";

interface BrandAssetsManagerProps {
  brandAssets: BannerBrandAssets;
  avatars: Avatar[];
  isLoadingAvatars: boolean;
  onLogoChange: (avatarId: string | undefined) => void;
  onProductImageChange: (avatarId: string | undefined) => void;
  onPrimaryColorChange: (color: string | undefined) => void;
  onSecondaryColorChange: (color: string | undefined) => void;
  onAccentColorChange: (color: string | undefined) => void;
  getAvatarById: (id: string) => Avatar | undefined;
}

interface AssetSelectorProps {
  label: string;
  description: string;
  selectedAvatarId: string | undefined;
  onSelect: (avatarId: string | undefined) => void;
  avatars: Avatar[];
  isLoading: boolean;
  getAvatarById: (id: string) => Avatar | undefined;
  filterType?: AvatarType | "all" | undefined;
  fallbackTypes?: AvatarType[];
}

function AssetSelector({
  label,
  description,
  selectedAvatarId,
  onSelect,
  avatars,
  isLoading,
  getAvatarById,
  filterType = "object",
  fallbackTypes = [],
}: AssetSelectorProps) {
  const t = useTranslations("bannerGenerator");
  const [modalOpen, setModalOpen] = useState(false);

  const selectedAvatar = selectedAvatarId ? getAvatarById(selectedAvatarId) : undefined;

  const handleSelect = (avatar: Avatar | null) => {
    onSelect(avatar?.id);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {selectedAvatar ? (
        <div className="relative group border rounded-lg overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={selectedAvatar.imageUrl}
              alt={selectedAvatar.name}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              {t("brandAssets.change")}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-2 bg-muted/50">
            <p className="text-sm font-medium truncate">{selectedAvatar.name}</p>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t("brandAssets.selectImage")}</span>
        </Button>
      )}

      <AvatarSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        avatars={avatars}
        isLoading={isLoading}
        selectedId={selectedAvatarId}
        onSelect={handleSelect}
        filterType={filterType}
        fallbackTypes={fallbackTypes}
      />
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string | undefined;
}

function ColorInput({ label, value, onChange, placeholder }: ColorInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue || undefined);
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={value || "#000000"}
            onChange={handleColorPickerChange}
            className="w-10 h-10 rounded border cursor-pointer"
          />
        </div>
        <Input
          type="text"
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 font-mono text-sm"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(undefined)}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function BrandAssetsManager({
  brandAssets,
  avatars,
  isLoadingAvatars,
  onLogoChange,
  onProductImageChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  getAvatarById,
}: BrandAssetsManagerProps) {
  const t = useTranslations("bannerGenerator");

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {t("sections.brandAssets")}
      </h3>

      {/* Logo Selector */}
      <AssetSelector
        label={t("brandAssets.logo")}
        description={t("brandAssets.logoDescription")}
        selectedAvatarId={brandAssets.logoAvatarId}
        onSelect={onLogoChange}
        avatars={avatars}
        isLoading={isLoadingAvatars}
        getAvatarById={getAvatarById}
        filterType="logo"
        fallbackTypes={["object"]}
      />

      {/* Product Image Selector */}
      <AssetSelector
        label={t("brandAssets.productImage")}
        description={t("brandAssets.productImageDescription")}
        selectedAvatarId={brandAssets.productImageAvatarId}
        onSelect={onProductImageChange}
        avatars={avatars}
        isLoading={isLoadingAvatars}
        getAvatarById={getAvatarById}
        filterType="product"
        fallbackTypes={["object"]}
      />

      {/* Brand Colors */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">{t("brandAssets.brandColors")}</Label>
        </div>

        <ColorInput
          label={t("brandAssets.primaryColor")}
          value={brandAssets.primaryColor}
          onChange={onPrimaryColorChange}
          placeholder="#FF5733"
        />

        <ColorInput
          label={t("brandAssets.secondaryColor")}
          value={brandAssets.secondaryColor}
          onChange={onSecondaryColorChange}
          placeholder="#33A1FF"
        />

        <ColorInput
          label={t("brandAssets.accentColor")}
          value={brandAssets.accentColor}
          onChange={onAccentColorChange}
          placeholder="#FFD700"
        />
      </div>
    </div>
  );
}
