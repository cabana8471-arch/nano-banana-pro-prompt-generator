"use client";

import { useState, useMemo } from "react";
import { Pipette, Palette, Check, AlertTriangle, X, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Predefined color palettes for logos
const colorPalettes = {
  brand: [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5",
    "#FFD700", "#FF69B4", "#8A2BE2", "#00CED1", "#FF4500",
  ],
  neutral: [
    "#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161",
    "#424242", "#212121", "#000000", "#FAFAFA", "#EEEEEE",
  ],
  professional: [
    "#1A365D", "#2C5282", "#2B6CB0", "#3182CE", "#4299E1",
    "#0F4C5C", "#1A535C", "#2D3748", "#4A5568", "#718096",
  ],
  vibrant: [
    "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795",
    "#3182CE", "#5A67D8", "#805AD5", "#D53F8C", "#ED64A6",
  ],
  nature: [
    "#22543D", "#276749", "#2F855A", "#38A169", "#48BB78",
    "#68D391", "#9AE6B4", "#C6F6D5", "#8BC34A", "#689F38",
  ],
};

// WCAG Contrast calculation helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastLevel(ratio: number): {
  level: "fail" | "aa-large" | "aa" | "aaa";
  label: string;
  color: string;
} {
  if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-success" };
  if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-success" };
  if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-warning" };
  return { level: "fail", label: "Fail", color: "text-destructive" };
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  contrastAgainst?: string;
}

function ColorInput({ label, value, onChange, contrastAgainst }: ColorInputProps) {
  const t = useTranslations("logoGenerator");
  const [inputValue, setInputValue] = useState(value || "");
  const [activePalette, setActivePalette] = useState<keyof typeof colorPalettes>("brand");

  // Check if EyeDropper API is supported
  const isEyedropperSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "EyeDropper" in window;
  }, []);

  const displayValue = value || inputValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleEyedropper = async () => {
    if (!isEyedropperSupported) return;
    try {
      // @ts-expect-error - EyeDropper API is not in TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const color = result.sRGBHex;
      setInputValue(color);
      onChange(color);
    } catch {
      // User cancelled
    }
  };

  const handlePaletteColorClick = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  // Calculate contrast if contrastAgainst is provided
  const contrastRatio = value && contrastAgainst ? getContrastRatio(value, contrastAgainst) : null;
  const contrastLevel = contrastRatio ? getContrastLevel(contrastRatio) : null;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex gap-2">
        {/* Color Picker */}
        <div className="relative">
          <input
            type="color"
            value={value || "#000000"}
            onChange={handleColorPickerChange}
            className="w-9 h-9 rounded border cursor-pointer"
          />
        </div>

        {/* Text Input */}
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder="#000000"
          className="flex-1 font-mono text-xs h-9"
        />

        {/* Eyedropper */}
        {isEyedropperSupported && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEyedropper}
                  className="shrink-0 h-9 w-9"
                >
                  <Pipette className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("colorPicker.eyedropper")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Palette Popover */}
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                    <Palette className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("colorPicker.palette")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">{t("colorPicker.selectFromPalette")}</h4>

              {/* Palette Tabs */}
              <div className="flex gap-1 flex-wrap">
                {(Object.keys(colorPalettes) as Array<keyof typeof colorPalettes>).map((palette) => (
                  <Button
                    key={palette}
                    variant={activePalette === palette ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePalette(palette)}
                    className="h-6 text-[10px] capitalize px-2"
                  >
                    {t(`colorPicker.palettes.${palette}`)}
                  </Button>
                ))}
              </div>

              {/* Palette Colors */}
              <ScrollArea className="h-20">
                <div className="flex flex-wrap gap-1.5">
                  {colorPalettes[activePalette].map((color) => (
                    <button
                      key={color}
                      onClick={() => handlePaletteColorClick(color)}
                      className="w-6 h-6 rounded border hover:ring-2 ring-primary relative"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {value === color && (
                        <Check className="absolute inset-0 m-auto h-3 w-3 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Button */}
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0 h-9 w-9"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Contrast Checker */}
      {contrastRatio !== null && contrastLevel && (
        <div className="flex items-center gap-2 text-[10px] mt-1">
          {contrastLevel.level === "fail" ? (
            <AlertTriangle className="h-3 w-3 text-warning" />
          ) : (
            <Check className="h-3 w-3 text-success" />
          )}
          <span className="text-muted-foreground">
            {contrastRatio.toFixed(2)}:1
          </span>
          <span className={`font-medium ${contrastLevel.color}`}>
            WCAG {contrastLevel.label}
          </span>
        </div>
      )}
    </div>
  );
}

export interface LogoColorManagerProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onAccentColorChange: (value: string) => void;
  onSwapColors?: (() => void) | undefined;
}

export function LogoColorManager({
  primaryColor,
  secondaryColor,
  accentColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  onSwapColors,
}: LogoColorManagerProps) {
  const t = useTranslations("logoGenerator");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          {t("sections.brandColors")}
        </h3>
        {onSwapColors && primaryColor && secondaryColor && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSwapColors}
                  className="h-7 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t("colorPicker.swapColors")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("colorPicker.swapColorsHint")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Color Preview */}
      {(primaryColor || secondaryColor || accentColor) && (
        <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
          {primaryColor && (
            <div className="flex-1 h-12 rounded" style={{ backgroundColor: primaryColor }} />
          )}
          {secondaryColor && (
            <div className="flex-1 h-12 rounded" style={{ backgroundColor: secondaryColor }} />
          )}
          {accentColor && (
            <div className="flex-1 h-12 rounded" style={{ backgroundColor: accentColor }} />
          )}
        </div>
      )}

      {/* Color Inputs */}
      <div className="space-y-3">
        <ColorInput
          label={t("colorPicker.primaryColor")}
          value={primaryColor}
          onChange={onPrimaryColorChange}
          contrastAgainst={secondaryColor || "#FFFFFF"}
        />
        <ColorInput
          label={t("colorPicker.secondaryColor")}
          value={secondaryColor}
          onChange={onSecondaryColorChange}
          contrastAgainst={primaryColor || "#000000"}
        />
        <ColorInput
          label={t("colorPicker.accentColor")}
          value={accentColor}
          onChange={onAccentColorChange}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {t("colorPicker.hint")}
      </p>
    </div>
  );
}
