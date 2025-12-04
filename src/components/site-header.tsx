"use client";

import { useTranslations } from "next-intl";
import { Banana, Menu, Wand2, Image as ImageIcon, Users, Settings } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Link, usePathname } from "@/i18n/routing";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("navigation");
  const tBrand = useTranslations("brand");

  const navigationItems = [
    { href: "/generate" as const, labelKey: "generate" as const, icon: Wand2 },
    { href: "/gallery" as const, labelKey: "gallery" as const, icon: ImageIcon },
    { href: "/avatars" as const, labelKey: "avatars" as const, icon: Users },
    { href: "/profile" as const, labelKey: "settings" as const, icon: Settings },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        {t("skipToMainContent")}
      </a>
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" role="banner">
        <nav
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          aria-label={t("mainNavigation")}
        >
          {/* Logo */}
          <h1 className="text-2xl font-bold">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              aria-label={`${tBrand("name")} - Go to homepage`}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/20"
                aria-hidden="true"
              >
                <Banana className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent hidden sm:inline">
                {tBrand("name")}
              </span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center gap-1" role="navigation">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2" role="group" aria-label={t("userActions")}>
            {/* Mobile Menu */}
            {session && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t("openMenu")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Banana className="h-5 w-5 text-yellow-500" />
                      {tBrand("name")}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            <UserProfile />
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
