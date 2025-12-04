"use client";

import { useState, useMemo } from "react";
import { Pipette, Palette, Check, AlertTriangle, X, Plus } from "lucide-react";
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

// Predefined color palettes
const colorPalettes = {
  brand: [
    "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5",
    "#FFD700", "#FF69B4", "#8A2BE2", "#00CED1", "#FF4500",
  ],
  neutral: [
    "#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161",
    "#424242", "#212121", "#000000", "#FAFAFA", "#EEEEEE",
  ],
  warm: [
    "#FF6B6B", "#FFE66D", "#FF8C42", "#FF5252", "#FFAB40",
    "#FFD54F", "#FFA726", "#FF7043", "#FF5722", "#F4511E",
  ],
  cool: [
    "#4FC3F7", "#29B6F6", "#03A9F4", "#00BCD4", "#26C6DA",
    "#00ACC1", "#0097A7", "#00838F", "#006064", "#80DEEA",
  ],
  nature: [
    "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C",
    "#2E7D32", "#1B5E20", "#8BC34A", "#689F38", "#558B2F",
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
  if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-green-600" };
  if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-green-500" };
  if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-yellow-600" };
  return { level: "fail", label: "Fail", color: "text-red-500" };
}

interface AdvancedColorPickerProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  contrastAgainst?: string; // Color to check contrast against
  savedColors?: string[];
  onSaveColor?: (color: string) => void;
  onRemoveSavedColor?: (color: string) => void;
}

export function AdvancedColorPicker({
  label,
  value,
  onChange,
  placeholder = "#000000",
  contrastAgainst,
  savedColors = [],
  onSaveColor,
  onRemoveSavedColor,
}: AdvancedColorPickerProps) {
  const t = useTranslations("bannerGenerator");
  const [inputValue, setInputValue] = useState(value || "");
  const [activePalette, setActivePalette] = useState<keyof typeof colorPalettes>("brand");

  // Check if EyeDropper API is supported (computed once)
  const isEyedropperSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "EyeDropper" in window;
  }, []);

  // Sync input value with prop when it changes externally
  const displayValue = value !== undefined ? value : inputValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only update parent if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || newValue === "") {
      onChange(newValue || undefined);
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
      // User cancelled or error occurred
    }
  };

  const handlePaletteColorClick = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleClear = () => {
    setInputValue("");
    onChange(undefined);
  };

  const handleSaveCurrentColor = () => {
    if (value && onSaveColor && !savedColors.includes(value)) {
      onSaveColor(value);
    }
  };

  // Calculate contrast if contrastAgainst is provided
  const contrastRatio = value && contrastAgainst ? getContrastRatio(value, contrastAgainst) : null;
  const contrastLevel = contrastRatio ? getContrastLevel(contrastRatio) : null;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        {/* Color Picker */}
        <div className="relative">
          <input
            type="color"
            value={value || "#000000"}
            onChange={handleColorPickerChange}
            className="w-10 h-10 rounded border cursor-pointer"
          />
        </div>

        {/* Text Input */}
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 font-mono text-sm"
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
                  className="shrink-0"
                >
                  <Pipette className="h-4 w-4" />
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
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("colorPicker.palette")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{t("colorPicker.selectFromPalette")}</h4>
                {value && onSaveColor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveCurrentColor}
                    disabled={savedColors.includes(value)}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {t("colorPicker.saveColor")}
                  </Button>
                )}
              </div>

              {/* Saved Colors */}
              {savedColors.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {t("colorPicker.savedColors")}
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {savedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handlePaletteColorClick(color)}
                        className="group relative w-7 h-7 rounded border hover:ring-2 ring-primary"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {value === color && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                        )}
                        {onRemoveSavedColor && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSavedColor(color);
                            }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full hidden group-hover:flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Palette Tabs */}
              <div className="flex gap-1 flex-wrap">
                {(Object.keys(colorPalettes) as Array<keyof typeof colorPalettes>).map((palette) => (
                  <Button
                    key={palette}
                    variant={activePalette === palette ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePalette(palette)}
                    className="h-7 text-xs capitalize"
                  >
                    {t(`colorPicker.palettes.${palette}`)}
                  </Button>
                ))}
              </div>

              {/* Palette Colors */}
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-1.5">
                  {colorPalettes[activePalette].map((color) => (
                    <button
                      key={color}
                      onClick={() => handlePaletteColorClick(color)}
                      className="w-7 h-7 rounded border hover:ring-2 ring-primary relative"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {value === color && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
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
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Contrast Checker */}
      {contrastRatio !== null && contrastLevel && (
        <div className="flex items-center gap-2 text-xs mt-1.5">
          {contrastLevel.level === "fail" ? (
            <AlertTriangle className="h-3 w-3 text-yellow-600" />
          ) : (
            <Check className="h-3 w-3 text-green-600" />
          )}
          <span className="text-muted-foreground">
            {t("colorPicker.contrastRatio")}: {contrastRatio.toFixed(2)}:1
          </span>
          <span className={`font-medium ${contrastLevel.color}`}>
            WCAG {contrastLevel.label}
          </span>
        </div>
      )}
    </div>
  );
}
