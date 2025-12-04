import { Banana, ImageIcon, Sparkles, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicGalleryPreview } from "@/components/gallery/public-gallery-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const tFeatures = await getTranslations("home.features");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 mb-16">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/20">
            <Banana className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {tBrand("name")}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("heroDescription")}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/generate">{t("startCreating")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/gallery">{t("viewGallery")}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{tFeatures("promptBuilder.title")}</CardTitle>
            <CardDescription>
              {tFeatures("promptBuilder.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>{tFeatures("promptBuilder.items.templates")}</li>
              <li>{tFeatures("promptBuilder.items.customization")}</li>
              <li>{tFeatures("promptBuilder.items.preview")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{tFeatures("avatarSystem.title")}</CardTitle>
            <CardDescription>
              {tFeatures("avatarSystem.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>{tFeatures("avatarSystem.items.types")}</li>
              <li>{tFeatures("avatarSystem.items.reference")}</li>
              <li>{tFeatures("avatarSystem.items.consistency")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{tFeatures("multiImage.title")}</CardTitle>
            <CardDescription>
              {tFeatures("multiImage.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>{tFeatures("multiImage.items.resolutions")}</li>
              <li>{tFeatures("multiImage.items.aspectRatios")}</li>
              <li>{tFeatures("multiImage.items.refinement")}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Public Gallery Preview */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t("publicGallery")}</h2>
        <p className="text-muted-foreground mb-8">
          {t("publicGalleryDescription")}
        </p>
        <PublicGalleryPreview />
        <Button asChild variant="outline" className="mt-8">
          <Link href="/gallery/public">{t("viewAllImages")}</Link>
        </Button>
      </section>
    </div>
  );
}
