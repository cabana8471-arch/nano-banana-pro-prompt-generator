# Banner Generator Accessibility - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | Critical keyboard accessibility | 2 |
| 2 | High priority navigation & ARIA | 5 |
| 3 | Medium priority content & microcopy | 6 |
| 4 | Low priority polish | 4 |

**Complexity:** M (Medium) (4 phases)

**Current Score:** 79/100 (Accessibility: 17/25) -> **Target Score:** 90+/100 (Accessibility: 23+/25)

---

## Phase 1: Critical Keyboard Accessibility

Fix keyboard navigation for interactive elements that currently block keyboard-only users.

### Results Panel - Image Grid

- [x] Add keyboard accessibility to image grid items - `src/components/banner-generator/results/banner-results-panel.tsx`
  - Lines 256-327: Add `role="button"`, `tabIndex={0}`, `onKeyDown` handler
  - Add focus styling with `focus-visible:ring-2 focus-visible:ring-ring`
  - Add `aria-label` for screen readers

### Reference Manager - Selection Cards

- [x] Add keyboard accessibility to reference cards - `src/components/banner-generator/banner-builder/banner-reference-manager.tsx`
  - Lines 228-281: Add `role="button"`, `tabIndex={0}`, `onKeyDown` handler
  - Add focus styling consistent with other interactive elements

### Technical Details

**banner-results-panel.tsx - Image Grid Items (lines 256-327):**
```tsx
// BEFORE:
<div
  key={i}
  className="rounded-lg overflow-hidden cursor-pointer group relative aspect-video bg-muted"
  onClick={() => setFullscreenIndex(i)}
>

// AFTER:
<div
  key={i}
  role="button"
  tabIndex={0}
  className="rounded-lg overflow-hidden cursor-pointer group relative aspect-video bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
  onClick={() => setFullscreenIndex(i)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFullscreenIndex(i);
    }
  }}
  aria-label={t("viewImage", { index: i + 1 })}
>
```

**banner-reference-manager.tsx - Reference Cards (lines 228-281):**
```tsx
// BEFORE:
<div
  className={cn(
    "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
    // ...
  )}
  onClick={() => canSelect && toggleSelection(ref.id)}
>

// AFTER:
<div
  role="button"
  tabIndex={canSelect ? 0 : -1}
  className={cn(
    "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // ...
  )}
  onClick={() => canSelect && toggleSelection(ref.id)}
  onKeyDown={(e) => {
    if ((e.key === "Enter" || e.key === " ") && canSelect) {
      e.preventDefault();
      toggleSelection(ref.id);
    }
  }}
  aria-label={t("selectReference", { name: ref.name || t("untitledReference") })}
  aria-pressed={selectedIds.includes(ref.id)}
>
```

**Translations to add (en.json):**
```json
{
  "bannerGenerator": {
    "results": {
      "viewImage": "View generated banner {index} in fullscreen"
    },
    "builder": {
      "selectReference": "Select reference image: {name}",
      "untitledReference": "Untitled reference"
    }
  }
}
```

---

## Phase 2: High Priority Navigation & ARIA

Implement skip links, fix touch targets, and add proper ARIA attributes.

### Skip Links

- [x] Add skip links to three-column layout - `src/components/generate/three-column-layout.tsx`
  - Add skip link group at top of layout component
  - Add `id` attributes to each panel for anchor targets
  - Use existing pattern from `site-header.tsx:73-79`

### Color Input Labels

- [x] Add accessible labels to color picker inputs - `src/components/banner-generator/banner-builder/brand-assets-manager.tsx`
  - Lines 153-159: Add `aria-label` to color input
  - Add `id` for programmatic association

### Touch Targets

- [x] Increase touch target sizes on collapse buttons - `src/components/generate/three-column-layout.tsx`
  - Line 79: Change from `h-6 w-6` to `h-9 w-9`

- [x] Increase touch target sizes on history controls - `src/components/banner-generator/banner-builder/history-controls.tsx`
  - Line 54: Change from `h-8 w-8` to `h-9 w-9` for consistency

### File Upload Accessibility

- [x] Make file upload area keyboard accessible - `src/components/banner-generator/banner-builder/banner-reference-manager.tsx`
  - Lines 333-339: Add `role="button"`, `tabIndex={0}`, `onKeyDown`
  - Add focus styling and `aria-label`

### Focus Management

- [x] Verify focus trap in fullscreen modal - `src/components/banner-generator/results/banner-results-panel.tsx`
  - Radix Dialog handles this automatically
  - Add `onOpenAutoFocus` if first button should receive focus

### Technical Details

**three-column-layout.tsx - Skip Links (add at top of component):**
```tsx
{/* Skip Links for accessibility */}
<div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-16 focus-within:left-4 focus-within:z-50 focus-within:flex focus-within:flex-col focus-within:gap-2 focus-within:p-2 focus-within:bg-background focus-within:border focus-within:rounded-lg focus-within:shadow-lg">
  <a
    href="#builder-panel"
    className="px-3 py-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
  >
    {t("skipToBuilder")}
  </a>
  <a
    href="#preview-panel"
    className="px-3 py-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
  >
    {t("skipToPreview")}
  </a>
  <a
    href="#results-panel"
    className="px-3 py-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
  >
    {t("skipToResults")}
  </a>
</div>
```

**three-column-layout.tsx - Panel IDs:**
```tsx
// Add id to left panel wrapper
<div id="builder-panel" className="...">

// Add id to center panel wrapper
<div id="preview-panel" className="...">

// Add id to right panel wrapper
<div id="results-panel" className="...">
```

**brand-assets-manager.tsx - Color Input (lines 153-159):**
```tsx
// BEFORE:
<input
  type="color"
  value={value || "#000000"}
  onChange={handleColorPickerChange}
  className="w-10 h-10 rounded border cursor-pointer"
/>

// AFTER:
<input
  type="color"
  id={`color-${label.replace(/\s/g, "-").toLowerCase()}`}
  aria-label={label}
  value={value || "#000000"}
  onChange={handleColorPickerChange}
  className="w-10 h-10 rounded border cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
/>
```

**banner-reference-manager.tsx - File Upload (lines 333-339):**
```tsx
// BEFORE:
<div
  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
  onClick={() => fileInputRef.current?.click()}
>

// AFTER:
<div
  role="button"
  tabIndex={0}
  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  onClick={() => fileInputRef.current?.click()}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }}
  aria-label={t("uploadReferenceImage")}
>
```

**Translations to add:**
```json
{
  "generate": {
    "layout": {
      "skipToBuilder": "Skip to builder panel",
      "skipToPreview": "Skip to preview panel",
      "skipToResults": "Skip to results panel"
    }
  },
  "bannerGenerator": {
    "builder": {
      "uploadReferenceImage": "Upload reference image"
    }
  }
}
```

---

## Phase 3: Medium Priority Content & Microcopy

Improve navigation buttons, add character counts, and implement error boundary.

### Navigation Buttons

- [x] Replace text symbols with proper icons - `src/components/banner-generator/results/banner-results-panel.tsx`
  - Lines 414-431: Use ChevronLeft/ChevronRight with aria-labels
  - Add sr-only text for screen readers

### Modal Triggers

- [x] Add aria-haspopup to template selector - `src/components/banner-generator/banner-builder/banner-template-selector.tsx`
  - Lines 81-90: Add `aria-haspopup="dialog"` and `aria-expanded`

### Character Count

- [x] Add character count to custom prompt - `src/components/banner-generator/banner-builder/banner-builder-panel.tsx`
  - Lines 266-279: Add character counter like other text inputs

### Empty State Enhancement

- [x] Add inline CTA to project selector empty state - `src/components/banner-generator/projects/project-selector.tsx`
  - Lines 74-78: Add button to create first project

### Loading Messages

- [x] Add contextual loading message - `src/app/[locale]/banner-generator/page.tsx`
  - Lines 614-619: Replace generic "Loading..." with specific message

### Error Boundary

- [x] Create error boundary component - `src/components/banner-generator/banner-error-boundary.tsx` (new file)
  - Wrap page content for graceful failure handling

- [x] Integrate error boundary - `src/app/[locale]/banner-generator/page.tsx`
  - Wrap main content with BannerErrorBoundary

### Technical Details

**banner-results-panel.tsx - Navigation Buttons (lines 414-431):**
```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

// BEFORE:
<Button variant="ghost" size="icon" ...>
  <span className="text-2xl">&lt;</span>
</Button>

// AFTER:
<Button
  variant="ghost"
  size="icon"
  aria-label={t("previousImage")}
  ...
>
  <ChevronLeft className="h-6 w-6" />
  <span className="sr-only">{t("previousImage")}</span>
</Button>

<Button
  variant="ghost"
  size="icon"
  aria-label={t("nextImage")}
  ...
>
  <ChevronRight className="h-6 w-6" />
  <span className="sr-only">{t("nextImage")}</span>
</Button>
```

**banner-template-selector.tsx - aria-haspopup (lines 81-90):**
```tsx
<Button
  variant="outline"
  className="w-full justify-between"
  aria-haspopup="dialog"
  aria-expanded={isOpen}
>
```

**banner-builder-panel.tsx - Character Count (lines 266-279):**
```tsx
const MAX_CUSTOM_PROMPT_LENGTH = 500;

<div className="relative">
  <Textarea
    value={customPrompt}
    onChange={(e) => onCustomPromptChange(e.target.value.slice(0, MAX_CUSTOM_PROMPT_LENGTH))}
    maxLength={MAX_CUSTOM_PROMPT_LENGTH}
    placeholder={t("customPromptPlaceholder")}
    className="min-h-[80px] resize-none pr-16"
  />
  <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
    {customPrompt.length}/{MAX_CUSTOM_PROMPT_LENGTH}
  </span>
</div>
```

**project-selector.tsx - Empty State (lines 74-78):**
```tsx
{projects.length === 0 ? (
  <div className="p-4 text-center">
    <p className="text-sm text-muted-foreground mb-3">{t("noProjectsYet")}</p>
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowCreateDialog(true)}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      {t("createFirstProject")}
    </Button>
  </div>
) : (
  // existing project list
)}
```

**banner-error-boundary.tsx (new file):**
```tsx
"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class BannerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Banner Generator Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>
                  An error occurred while loading the banner generator. Please try again.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={this.handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

**Translations to add:**
```json
{
  "bannerGenerator": {
    "results": {
      "previousImage": "Previous image",
      "nextImage": "Next image"
    },
    "projects": {
      "createFirstProject": "Create your first project"
    },
    "loadingBannerGenerator": "Loading banner generator..."
  }
}
```

---

## Phase 4: Low Priority Polish

Final polish items for improved user experience.

### Icon Standardization

- [ ] Review and standardize icon placement - Multiple files
  - Ensure icons appear before text in action buttons

### History Navigation

- [ ] Add keyboard navigation to history items - `src/components/banner-generator/banner-builder/history-controls.tsx`
  - Lines 113-134: Add `role="listbox"` to container, `role="option"` to items
  - Implement arrow key navigation

### Tooltip Delay

- [ ] Add delay to tooltips - Multiple files
  - Add `delayDuration={300}` to Tooltip components

### Banner Preview Scaling

- [ ] Improve extreme aspect ratio handling - `src/components/banner-generator/preview/responsive-preview.tsx`
  - Add minimum visible size constraints
  - Consider adding zoom controls for very wide/tall banners

### Technical Details

**history-controls.tsx - Keyboard Navigation:**
```tsx
// Container
<div
  role="listbox"
  aria-label={t("historyList")}
  onKeyDown={(e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      // Focus next item
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Focus previous item
    }
  }}
>
  {/* Items */}
  <div
    role="option"
    tabIndex={0}
    aria-selected={isSelected}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(index);
      }
    }}
  >
```

---

## Implementation Order

Execute phases sequentially. Each phase must be completed before starting the next.

1. **Phase 1** - Critical keyboard accessibility (blocks keyboard users)
2. **Phase 2** - High priority navigation and ARIA
3. **Phase 3** - Medium priority content improvements
4. **Phase 4** - Low priority polish

## Verification

After implementation:
```bash
pnpm lint && pnpm typecheck
```

Manual testing checklist:
- [ ] Tab through all interactive elements
- [ ] Activate buttons with Enter and Space keys
- [ ] Test skip links navigation
- [ ] Verify focus indicators are visible
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify touch targets on mobile (44px minimum)
- [ ] Test fullscreen modal focus trap
- [ ] Verify error boundary catches failures gracefully

## Environment Variables

No new environment variables required.
