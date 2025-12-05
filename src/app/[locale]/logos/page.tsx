"use client";

import { MediaPage } from "@/components/media/media-page";

export default function LogosPage() {
  return (
    <MediaPage
      filterType="logo"
      translationNamespace="logos"
      defaultAvatarType="logo"
    />
  );
}
