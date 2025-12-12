# Logo Generator UI Compliance - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | WCAG Contrast Checker | 1 |
| 2 | Reference Type Badges | 1 |
| 3 | Warning Alert | 1 |
| 4 | Logo Format Preview | 1 |

**Complexity:** S (4 phases, 4 files)

---

## Phase 1: WCAG Contrast Checker Colors

Înlocuirea culorilor hardcodate din funcția `getContrastLevel` și din iconițele de contrast.

### Component Updates

- [ ] Update `getContrastLevel` function colors - `src/components/logo-generator/logo-builder/logo-color-manager.tsx`
  - Line 86: `text-green-600` → `text-success`
  - Line 87: `text-green-500` → `text-success`
  - Line 88: `text-yellow-600` → `text-warning`
  - Line 89: `text-red-500` → `text-destructive`

- [ ] Update contrast indicator icons - `src/components/logo-generator/logo-builder/logo-color-manager.tsx`
  - Line 272: `text-yellow-600` → `text-warning`
  - Line 274: `text-green-600` → `text-success`

### Technical Details

**Token-uri disponibile în globals.css:**
```css
--color-success: oklch(0.646 0.222 142.5);
--color-warning: oklch(0.828 0.189 84.429);
--color-destructive: oklch(0.577 0.245 27.325);
```

**Cod înainte:**
```tsx
function getContrastLevel(ratio: number) {
  if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-green-600" };
  if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-green-500" };
  if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-yellow-600" };
  return { level: "fail", label: "Fail", color: "text-red-500" };
}
```

**Cod după:**
```tsx
function getContrastLevel(ratio: number) {
  if (ratio >= 7) return { level: "aaa", label: "AAA", color: "text-success" };
  if (ratio >= 4.5) return { level: "aa", label: "AA", color: "text-success" };
  if (ratio >= 3) return { level: "aa-large", label: "AA Large", color: "text-warning" };
  return { level: "fail", label: "Fail", color: "text-destructive" };
}
```

---

## Phase 2: Reference Type Badge Colors

Înlocuirea culorilor hardcodate pentru badge-urile de tip referință.

### Component Updates

- [ ] Update `referenceTypeColors` object - `src/components/logo-generator/logo-builder/logo-reference-manager.tsx`
  - Line 56: `bg-purple-500/10 text-purple-500 border-purple-500/20` → `bg-chart-5/10 text-chart-5 border-chart-5/20`
  - Line 57: `bg-blue-500/10 text-blue-500 border-blue-500/20` → `bg-primary/10 text-primary border-primary/20`
  - Line 58: `bg-orange-500/10 text-orange-500 border-orange-500/20` → `bg-warning/10 text-warning border-warning/20`

- [ ] Update SelectItem icons - `src/components/logo-generator/logo-builder/logo-reference-manager.tsx`
  - Line 363: `text-purple-500` → `text-chart-5`
  - Line 374: `text-blue-500` → `text-primary`
  - Line 385: `text-orange-500` → `text-warning`

### Technical Details

**Cod înainte:**
```tsx
const referenceTypeColors: Record<LogoReferenceType, string> = {
  style: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  composition: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};
```

**Cod după:**
```tsx
const referenceTypeColors: Record<LogoReferenceType, string> = {
  style: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  composition: "bg-primary/10 text-primary border-primary/20",
  color: "bg-warning/10 text-warning border-warning/20",
};
```

**Notă:** `chart-5` este folosit pentru violet deoarece nu există un token semantic violet. În dark mode, `chart-5` = `oklch(0.645 0.246 16.439)`.

---

## Phase 3: Warning Alert Styling

Înlocuirea culorilor hardcodate din alert-ul de warning pentru preset-uri existente.

### Component Updates

- [ ] Update warning alert container and content - `src/components/logo-generator/presets/save-logo-preset-modal.tsx`
  - Line 151: `bg-yellow-500/10 border-yellow-500/30` → `bg-warning/10 border-warning/30`
  - Line 153: `text-yellow-600 dark:text-yellow-400` → `text-warning`
  - Line 154: `text-yellow-700 dark:text-yellow-300` → `text-warning-foreground`

### Technical Details

**Cod înainte:**
```tsx
<div className="space-y-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
  <div className="flex items-center gap-2">
    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
      {t("presetExists")}
    </span>
  </div>
```

**Cod după:**
```tsx
<div className="space-y-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
  <div className="flex items-center gap-2">
    <AlertCircle className="h-4 w-4 text-warning" />
    <span className="text-sm font-medium text-warning-foreground">
      {t("presetExists")}
    </span>
  </div>
```

---

## Phase 4: Logo Format Preview Styling

Înlocuirea stilurilor inline cu clase Tailwind pentru preview-ul formatului de logo.

### Component Updates

- [ ] Replace inline styles with Tailwind classes - `src/components/logo-generator/preview/logo-preview-panel.tsx`
  - Import `cn` from `@/lib/utils` (dacă nu este deja importat)
  - Lines 147-159: Înlocuire inline styles cu clase condiționale

### Technical Details

**Cod înainte:**
```tsx
<div
  className="border-2 border-dashed border-muted-foreground/30 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground"
  style={{
    width: selectedLogoFormat === "format-horizontal" ? 160 :
           selectedLogoFormat === "format-vertical" ? 80 : 100,
    height: selectedLogoFormat === "format-vertical" ? 120 :
            selectedLogoFormat === "format-horizontal" ? 60 : 100,
    borderRadius: selectedLogoFormat === "format-circular" ? "50%" : "0.375rem",
  }}
>
  {t("preview.logoPreview")}
</div>
```

**Cod după:**
```tsx
import { cn } from "@/lib/utils";

// În component:
<div
  className={cn(
    "border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center text-xs text-muted-foreground",
    selectedLogoFormat === "format-horizontal" && "w-40 h-[60px] rounded-md",
    selectedLogoFormat === "format-vertical" && "w-20 h-[120px] rounded-md",
    selectedLogoFormat === "format-circular" && "size-[100px] rounded-full",
    !["format-horizontal", "format-vertical", "format-circular"].includes(selectedLogoFormat || "") && "size-[100px] rounded-md"
  )}
>
  {t("preview.logoPreview")}
</div>
```

**Notă:** Pentru dimensiuni care nu există în Tailwind default (60px, 100px, 120px), folosim sintaxa arbitrary value `h-[60px]`, `size-[100px]`, `h-[120px]`. Alternativ, se pot folosi valorile cele mai apropiate din scale: `h-16` (64px), `size-24` (96px), `h-32` (128px).

---

## Implementation Order

Execute phases sequentially. Each phase must be completed before starting the next.

1. Phase 1 - WCAG Contrast Checker (independent)
2. Phase 2 - Reference Type Badges (independent)
3. Phase 3 - Warning Alert (independent)
4. Phase 4 - Logo Format Preview (independent)

**Notă:** Fazele sunt independente și pot fi executate în orice ordine, dar recomandăm ordinea de mai sus pentru consistență.

## Verification

După fiecare fază:
```bash
pnpm typecheck && pnpm lint
```

După toate fazele:
- Verificare vizuală în light mode
- Verificare vizuală în dark mode

## Environment Variables

Nu sunt necesare variabile de mediu noi.
