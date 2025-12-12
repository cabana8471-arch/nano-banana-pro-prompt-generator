# Banner Generator UI Compliance - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | Add semantic tokens to globals.css | 1 |
| 2 | Fix color violations in components | 5 |

**Complexity:** S (Small) (2 phases)

**Current Score:** 7.5/10 → **Target Score:** 10/10

---

## Phase 1: Add Semantic Tokens

Add missing semantic color tokens to the global stylesheet for success and warning states.

### CSS Tokens

- [x] Add success and warning tokens to `:root` and `.dark` - `src/app/globals.css`
  - [x] Add `--color-success` token (green for positive states)
  - [x] Add `--color-success-foreground` token
  - [x] Add `--color-warning` token (yellow/amber for caution states)
  - [x] Add `--color-warning-foreground` token

### Technical Details

**Add to `:root` section (after line ~57):**
```css
--color-success: oklch(0.646 0.222 142.5);
--color-success-foreground: oklch(0.985 0 0);
--color-warning: oklch(0.828 0.189 84.429);
--color-warning-foreground: oklch(0.21 0.006 285.885);
```

**Add to `.dark` section (after line ~91):**
```css
--color-success: oklch(0.696 0.17 142.5);
--color-success-foreground: oklch(0.21 0.006 285.885);
--color-warning: oklch(0.828 0.189 84.429);
--color-warning-foreground: oklch(0.21 0.006 285.885);
```

---

## Phase 2: Fix Component Color Violations

Replace hard-coded Tailwind color classes with semantic tokens across all affected components.

### Advanced Color Picker

- [x] Fix WCAG contrast level colors - `src/components/banner-generator/banner-builder/advanced-color-picker.tsx`
  - Lines 86-89: Replace `text-green-600`, `text-green-500`, `text-yellow-600`, `text-red-500` with `text-success`, `text-warning`, `text-destructive`
  - Line 344: Replace `text-yellow-600` with `text-warning`
  - Line 346: Replace `text-green-600` with `text-success`
- [x] Add JSDoc comment for color palettes - `src/components/banner-generator/banner-builder/advanced-color-picker.tsx`
  - Lines 23-44: Document that hex values are intentional (user-facing brand options)

### Preset Config Diff

- [x] Fix diff status colors - `src/components/banner-generator/presets/shared/preset-config-diff.tsx`
  - Lines 173-175: Replace hard-coded colors with semantic tokens
  - Remove manual `dark:` variants

### Platform Generation Progress

- [x] Fix success icon colors - `src/components/banner-generator/results/platform-generation-progress.tsx`
  - Line 187: Replace `text-green-500` with `text-success`
  - Line 270: Replace `text-green-500` with `text-success`

### Banner Reference Manager

- [x] Fix reference type colors - `src/components/banner-generator/banner-builder/banner-reference-manager.tsx`
  - Lines 55-59: Replace purple/blue/orange with chart-1/chart-3/chart-5 tokens
  - Line 363: Replace `text-purple-500` with `text-chart-1`
  - Line 374: Replace `text-blue-500` with `text-chart-3`
  - Line 385: Replace `text-orange-500` with `text-chart-5`

### Responsive Preview

- [x] Fix inline borderColor style - `src/components/banner-generator/preview/responsive-preview.tsx`
  - Lines 96-101: Move `borderColor` from inline style to className using `cn()` utility

### Technical Details

**advanced-color-picker.tsx - Lines 86-89 (getContrastLevel function):**
```tsx
// BEFORE:
if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-green-600" };
if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-green-500" };
if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-yellow-600" };
return { level: "fail", label: "Fail", color: "text-red-500" };

// AFTER:
if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-success" };
if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-success" };
if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-warning" };
return { level: "fail", label: "Fail", color: "text-destructive" };
```

**advanced-color-picker.tsx - Lines 23-44 (add JSDoc):**
```tsx
/**
 * User-selectable brand color palettes for banner design.
 * These are NOT UI theme colors - they are example presets
 * for users to pick from when designing their banners.
 * Hard-coded hex values are intentional here.
 */
const colorPalettes = {
  // ... existing code unchanged
};
```

**preset-config-diff.tsx - Lines 171-176:**
```tsx
// BEFORE:
change.type === "added" && "bg-green-500/10 text-green-700 dark:text-green-400",
change.type === "removed" && "bg-red-500/10 text-red-700 dark:text-red-400",
change.type === "modified" && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"

// AFTER:
change.type === "added" && "bg-success/10 text-success",
change.type === "removed" && "bg-destructive/10 text-destructive",
change.type === "modified" && "bg-warning/10 text-warning"
```

**banner-reference-manager.tsx - Lines 55-59:**
```tsx
// BEFORE:
const referenceTypeColors: Record<BannerReferenceType, string> = {
  style: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  composition: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

// AFTER:
const referenceTypeColors: Record<BannerReferenceType, string> = {
  style: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  composition: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};
```

**responsive-preview.tsx - Lines 96-101:**
```tsx
// BEFORE:
<div
  className="border-2 border-dashed rounded flex items-center justify-center text-[10px] text-muted-foreground bg-muted/30"
  style={{
    width: displayWidth,
    height: displayHeight,
    borderColor: isSelected ? "var(--primary)" : undefined,
  }}
>

// AFTER:
<div
  className={cn(
    "border-2 border-dashed rounded flex items-center justify-center text-[10px] text-muted-foreground bg-muted/30",
    isSelected ? "border-primary" : "border-muted-foreground/30"
  )}
  style={{
    width: displayWidth,
    height: displayHeight,
  }}
>
```

---

## Implementation Order

Execute phases sequentially:
1. **Phase 1** must complete first (tokens must exist before components can use them)
2. **Phase 2** can proceed once tokens are available

## Verification

After implementation:
1. Run `pnpm lint && pnpm typecheck`
2. Visual test: Toggle dark mode and verify all colors switch correctly
3. Test all affected pages/components render without errors
