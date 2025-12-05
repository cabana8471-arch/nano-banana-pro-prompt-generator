"use client";

import { MediaPage } from "@/components/media/media-page";

export default function ProductsPage() {
  return (
    <MediaPage
      filterType="product"
      translationNamespace="products"
      defaultAvatarType="product"
    />
  );
}
