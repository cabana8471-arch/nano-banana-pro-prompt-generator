"use client";

import { MediaPage } from "@/components/media/media-page";

export default function ReferencesPage() {
  return (
    <MediaPage
      filterType="reference"
      translationNamespace="references"
      defaultAvatarType="reference"
    />
  );
}
