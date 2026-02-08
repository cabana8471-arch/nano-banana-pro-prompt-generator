import Image from "next/image";
import { notFound } from "next/navigation";
import { Banana, Heart, Sparkles } from "lucide-react";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getPublicImageData } from "@/lib/share";

interface Props {
  params: Promise<{ locale: string; imageId: string }>;
}

/**
 * Generate OG meta tags for social media sharing.
 * These are critical for rich link previews on Twitter, Facebook, etc.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, imageId } = await params;

  const imageData = await getPublicImageData(imageId);

  if (!imageData) {
    const t = await getTranslations({ locale, namespace: "gallery.publicImage" });
    return {
      title: t("notFound"),
    };
  }

  // Truncate prompt for the title (60 chars max for social previews)
  const title =
    imageData.prompt.length > 60
      ? `${imageData.prompt.slice(0, 57)}...`
      : imageData.prompt;

  const description = `Created by ${imageData.creator.name} on Nano Banana Pro`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: imageData.imageUrl,
          width: 1200,
          height: 630,
          alt: imageData.prompt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageData.imageUrl],
    },
  };
}

/**
 * Public image page for shared images.
 * This page is server-rendered and does NOT require authentication,
 * enabling social media link previews with proper OG tags.
 */
export default async function PublicImagePage({ params }: Props) {
  const { locale, imageId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery.publicImage");
  const imageData = await getPublicImageData(imageId);

  if (!imageData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Image display */}
      <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
        <div className="relative aspect-auto min-h-[300px] max-h-[70vh]">
          <Image
            src={imageData.imageUrl}
            alt={imageData.prompt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            priority
          />
        </div>
      </div>

      {/* Image details */}
      <div className="mt-6 space-y-4">
        {/* Prompt text */}
        <p className="text-lg text-foreground leading-relaxed">
          {imageData.prompt}
        </p>

        {/* Creator info and stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            {imageData.creator.image ? (
              <Image
                src={imageData.creator.image}
                alt={imageData.creator.name}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <span className="text-sm font-medium">
                  {imageData.creator.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {t("createdBy", { name: imageData.creator.name })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{t("likes", { count: imageData.likeCount })}</span>
          </div>
        </div>

        {/* Call-to-action */}
        <div className="flex justify-center pt-8 pb-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/photo-generator">
              <Sparkles className="h-5 w-5" />
              {t("startCreating")}
            </Link>
          </Button>
        </div>

        {/* Brand footer */}
        <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
          <Banana className="h-4 w-4 text-yellow-500" />
          <span>Nano Banana Pro</span>
        </div>
      </div>
    </div>
  );
}
