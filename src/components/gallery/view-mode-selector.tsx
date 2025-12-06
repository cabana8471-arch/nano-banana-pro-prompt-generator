"use client";

import { Grid2X2, Grid3X3, LayoutGrid, Rows3, LayoutList } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ViewMode = "grid-4" | "grid-3" | "grid-2" | "grid-1" | "masonry";

interface ViewModeSelectorProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const viewModes: { mode: ViewMode; icon: React.ElementType }[] = [
  { mode: "grid-4", icon: LayoutGrid },
  { mode: "grid-3", icon: Grid3X3 },
  { mode: "grid-2", icon: Grid2X2 },
  { mode: "grid-1", icon: Rows3 },
  { mode: "masonry", icon: LayoutList },
];

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  const t = useTranslations("gallery");

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 border rounded-lg p-1">
        {viewModes.map(({ mode, icon: Icon }) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={value === mode ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  value === mode && "bg-secondary"
                )}
                onClick={() => onChange(mode)}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{t(`viewMode.${mode}`)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t(`viewMode.${mode}`)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
