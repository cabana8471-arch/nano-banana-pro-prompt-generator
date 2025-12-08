"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useLogoValidation } from "@/hooks/use-logo-validation";
import type {
  LogoBuilderState,
  LogoReference,
  CreateLogoReferenceInput,
} from "@/lib/types/logo";
import { LogoColorManager } from "./logo-color-manager";
import { LogoReferenceManager } from "./logo-reference-manager";
import { LogoTextContentEditor } from "./logo-text-content-editor";
import { AdditionalOptionsSection } from "./sections/additional-options-section";
import { BasicConfigSection } from "./sections/basic-config-section";
import { IconSymbolSection } from "./sections/icon-symbol-section";
import { TypographySection } from "./sections/typography-section";
import { VisualStyleSection } from "./sections/visual-style-section";

interface LogoBuilderPanelProps {
  // State
  state: LogoBuilderState;

  // Section A: Basic Configuration setters
  onLogoTypeChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onLogoFormatChange: (value: string) => void;

  // Section B: Visual Style setters
  onDesignStyleChange: (value: string) => void;
  onColorSchemeTypeChange: (value: string) => void;
  onMoodChange: (value: string) => void;

  // Section C: Icon/Symbol setters
  onIconStyleChange: (value: string) => void;
  onSymbolElementsChange: (value: string[]) => void;

  // Section D: Typography setters
  onFontCategoryChange: (value: string) => void;
  onTypographyTreatmentChange: (value: string) => void;

  // Section E: Additional Options setters
  onSpecialEffectsChange: (value: string) => void;
  onBackgroundStyleChange: (value: string) => void;

  // Text content setters
  onCompanyNameChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
  onAbbreviationChange: (value: string) => void;

  // Color setters
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onAccentColorChange: (value: string) => void;
  onSwapColors?: () => void;

  // Custom prompt
  onCustomPromptChange: (value: string) => void;

  // Logo references
  logoReferences: LogoReference[];
  selectedLogoReferenceIds: string[];
  isLoadingLogoReferences: boolean;
  onLogoReferenceSelectionChange: (ids: string[]) => void;
  onCreateLogoReference: (input: CreateLogoReferenceInput, image: File) => Promise<LogoReference | null>;
  onDeleteLogoReference: (id: string) => Promise<boolean>;
}

export function LogoBuilderPanel({
  state,
  onLogoTypeChange,
  onIndustryChange,
  onLogoFormatChange,
  onDesignStyleChange,
  onColorSchemeTypeChange,
  onMoodChange,
  onIconStyleChange,
  onSymbolElementsChange,
  onFontCategoryChange,
  onTypographyTreatmentChange,
  onSpecialEffectsChange,
  onBackgroundStyleChange,
  onCompanyNameChange,
  onTaglineChange,
  onAbbreviationChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  onSwapColors,
  onCustomPromptChange,
  logoReferences,
  selectedLogoReferenceIds,
  isLoadingLogoReferences,
  onLogoReferenceSelectionChange,
  onCreateLogoReference,
  onDeleteLogoReference,
}: LogoBuilderPanelProps) {
  const t = useTranslations("logoGenerator");

  // Use validation hook for character limits
  const validation = useLogoValidation(state);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Section A: Basic Configuration */}
          <BasicConfigSection
            logoType={state.logoType}
            industry={state.industry}
            logoFormat={state.logoFormat}
            onLogoTypeChange={onLogoTypeChange}
            onIndustryChange={onIndustryChange}
            onLogoFormatChange={onLogoFormatChange}
          />

          <Separator />

          {/* Section B: Visual Style */}
          <VisualStyleSection
            designStyle={state.designStyle}
            colorSchemeType={state.colorSchemeType}
            mood={state.mood}
            onDesignStyleChange={onDesignStyleChange}
            onColorSchemeTypeChange={onColorSchemeTypeChange}
            onMoodChange={onMoodChange}
          />

          <Separator />

          {/* Section C: Icon/Symbol Design */}
          <IconSymbolSection
            iconStyle={state.iconStyle}
            symbolElements={state.symbolElements}
            onIconStyleChange={onIconStyleChange}
            onSymbolElementsChange={onSymbolElementsChange}
          />

          <Separator />

          {/* Section D: Typography */}
          <TypographySection
            fontCategory={state.fontCategory}
            typographyTreatment={state.typographyTreatment}
            onFontCategoryChange={onFontCategoryChange}
            onTypographyTreatmentChange={onTypographyTreatmentChange}
          />

          <Separator />

          {/* Section E: Additional Options */}
          <AdditionalOptionsSection
            specialEffects={state.specialEffects}
            backgroundStyle={state.backgroundStyle}
            onSpecialEffectsChange={onSpecialEffectsChange}
            onBackgroundStyleChange={onBackgroundStyleChange}
          />

          <Separator />

          {/* Text Content Editor */}
          <LogoTextContentEditor
            textContent={state.textContent}
            characterLimits={validation.characterLimits}
            onCompanyNameChange={onCompanyNameChange}
            onTaglineChange={onTaglineChange}
            onAbbreviationChange={onAbbreviationChange}
            isOverLimit={validation.isOverLimit}
            getPercentageUsed={validation.getPercentageUsed}
          />

          <Separator />

          {/* Brand Colors */}
          <LogoColorManager
            primaryColor={state.primaryColor}
            secondaryColor={state.secondaryColor}
            accentColor={state.accentColor}
            onPrimaryColorChange={onPrimaryColorChange}
            onSecondaryColorChange={onSecondaryColorChange}
            onAccentColorChange={onAccentColorChange}
            onSwapColors={onSwapColors}
          />

          <Separator />

          {/* Logo Reference Images */}
          <LogoReferenceManager
            logoReferences={logoReferences}
            selectedReferenceIds={selectedLogoReferenceIds}
            isLoading={isLoadingLogoReferences}
            onCreateReference={onCreateLogoReference}
            onDeleteReference={onDeleteLogoReference}
            onSelectionChange={onLogoReferenceSelectionChange}
          />

          <Separator />

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("customPrompt.label")}
            </Label>
            <Textarea
              value={state.customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              placeholder={t("customPrompt.placeholder")}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t("customPrompt.hint")}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
