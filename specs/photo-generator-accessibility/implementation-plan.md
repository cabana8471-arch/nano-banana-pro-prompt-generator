# Photo Generator Accessibility - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | Icon Button Aria Labels | ~4 |
| 2 | Form Label Association | ~3 |
| 3 | Destructive Action Confirmation | ~1 |
| 4 | Image Grid Keyboard Accessibility | ~1 |
| 5 | Carousel Keyboard Navigation | ~1 |
| 6 | Translations | ~2 |

**Complexity:** S (6 phases, ~12 files)

---

## Phase 1: Icon Button Aria Labels

Add `aria-label` attributes to all icon-only buttons for screen reader accessibility.

### Components

- [x] Add aria-label to delete subject button - `src/components/generate/prompt-builder/subject-card.tsx`
  - Line 48-55: `<Button variant="ghost" size="icon" aria-label={t("deleteSubject")}>`

- [x] Add aria-labels to results panel buttons - `src/components/generate/results/results-panel.tsx`
  - Previous/Next navigation buttons (Download/Open buttons already have text labels)

- [x] Add aria-labels to preview panel buttons - `src/components/generate/preview/preview-panel.tsx`
  - No icon-only buttons found (all buttons have text labels)

- [x] Add aria-labels to additional icon buttons found during implementation:
  - `src/components/generate/prompt-builder/template-selector.tsx` - Clear selection button
  - `src/components/generate/prompt-builder/template-selector-modal.tsx` - Clear search button
  - `src/components/generate/three-column-layout.tsx` - Collapse panel buttons

### Technical Details

**Pattern to follow:**
```tsx
<Button
  variant="ghost"
  size="icon"
  aria-label={t("actionName")}
>
  <IconComponent className="h-4 w-4" />
</Button>
```

**Translation keys needed:**
- `deleteSubject`
- `downloadImage`
- `openInNewTab`
- `previousImage`
- `nextImage`
- `reset`

---

## Phase 2: Form Label Association

Associate all form labels with their inputs using `htmlFor` and `id` attributes.

### Components

- [x] Fix label associations in SubjectCard - `src/components/generate/prompt-builder/subject-card.tsx`
  - Hair input: `htmlFor="hair-{index}"` and `id="hair-{index}"`
  - Makeup input: `htmlFor="makeup-{index}"` and `id="makeup-{index}"`
  - Custom description: `htmlFor="custom-description-{index}"` and `id="custom-description-{index}"`

- [x] Fix label association in PromptBuilderPanel - `src/components/generate/prompt-builder/prompt-builder-panel.tsx`
  - Custom prompt textarea: `htmlFor="custom-prompt"` and `id="custom-prompt"`

- [x] Fix label associations in PreviewPanel - `src/components/generate/preview/preview-panel.tsx`
  - Resolution select: `htmlFor="resolution-select"` and `id="resolution-select"` on SelectTrigger
  - Aspect ratio select: `htmlFor="aspect-ratio-select"` and `id="aspect-ratio-select"` on SelectTrigger

### Technical Details

**Pattern for Input/Textarea:**
```tsx
<div className="space-y-2">
  <Label htmlFor={`field-${uniqueId}`}>{t("labelText")}</Label>
  <Input id={`field-${uniqueId}`} ... />
</div>
```

**Pattern for Select (Radix UI):**
```tsx
<div className="space-y-2">
  <Label htmlFor="select-id">{t("labelText")}</Label>
  <Select>
    <SelectTrigger id="select-id">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
</div>
```

---

## Phase 3: Destructive Action Confirmation

Add AlertDialog confirmation when deleting subjects to prevent accidental data loss.

### Components

- [x] Wrap delete button in AlertDialog - `src/components/generate/prompt-builder/subject-card.tsx`
  - Imported AlertDialog components from `@/components/ui/alert-dialog`
  - Wrapped delete button with AlertDialogTrigger
  - Added AlertDialogContent with confirmation message and translations

### Technical Details

**Pattern from existing codebase (image-card.tsx lines 150-179):**
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// In component:
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      aria-label={t("deleteSubject")}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t("deleteSubjectTitle")}</AlertDialogTitle>
      <AlertDialogDescription>
        {t("deleteSubjectDescription")}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
      <AlertDialogAction
        onClick={onRemove}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        {tCommon("delete")}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Translation keys needed:**
- `deleteSubjectTitle`: "Delete Subject" / "Șterge Subiectul"
- `deleteSubjectDescription`: "Are you sure you want to delete this subject? This action cannot be undone." / "Ești sigur că vrei să ștergi acest subiect? Această acțiune nu poate fi anulată."

---

## Phase 4: Image Grid Keyboard Accessibility

Make the generated images grid fully keyboard accessible.

### Components

- [x] Add keyboard accessibility to image grid items - `src/components/generate/results/results-panel.tsx`
  - Added `role="group"` and `aria-label` to grid container
  - Added `role="button"`, `tabIndex={0}` to image items
  - Added `onKeyDown` handler for Enter/Space activation
  - Added `aria-label` with translated "View image {number}"
  - Added focus-visible ring styles for keyboard focus indication

### Technical Details

**Current code (lines 87-117):**
```tsx
<div className="grid grid-cols-2 gap-4">
  {images.map((url, i) => (
    <div
      key={i}
      className="aspect-square..."
      onClick={() => setFullscreenIndex(i)}
    >
```

**Updated code:**
```tsx
<div
  className="grid grid-cols-2 gap-4"
  role="group"
  aria-label={t("generatedImages")}
>
  {images.map((url, i) => (
    <div
      key={i}
      role="button"
      tabIndex={0}
      aria-label={t("viewImage", { number: i + 1 })}
      className="aspect-square... focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
      onClick={() => setFullscreenIndex(i)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFullscreenIndex(i);
        }
      }}
    >
```

**Translation keys needed:**
- `generatedImages`: "Generated images"
- `viewImage`: "View image {number}"

---

## Phase 5: Carousel Keyboard Navigation

Add keyboard navigation support for the fullscreen image carousel.

### Components

- [x] Add keyboard event handler for carousel navigation - `src/components/generate/results/results-panel.tsx`
  - Added `useEffect` to listen for arrow keys and Escape
  - Left arrow: previous image
  - Right arrow: next image
  - Escape: close carousel (redundant but explicit)

### Technical Details

**Pattern from existing codebase (image-detail-modal.tsx):**
```tsx
useEffect(() => {
  if (fullscreenIndex === null) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setFullscreenIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
        break;
      case "ArrowRight":
        e.preventDefault();
        setFullscreenIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
        break;
      case "Escape":
        setFullscreenIndex(null);
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [fullscreenIndex, images.length]);
```

**Optional: Add screen-reader hint:**
```tsx
<span className="sr-only">
  {t("carouselKeyboardHint")}
</span>
```

---

## Phase 6: Translations

Add all new translation keys for English and Romanian.

### Files

- [ ] Add English translations - `messages/en.json`
- [ ] Add Romanian translations - `messages/ro.json`

### Technical Details

**Keys to add in `generate` namespace:**

```json
{
  "generate": {
    "deleteSubject": "Delete subject",
    "deleteSubjectTitle": "Delete Subject",
    "deleteSubjectDescription": "Are you sure you want to delete this subject? This action cannot be undone.",
    "downloadImage": "Download image",
    "openInNewTab": "Open in new tab",
    "previousImage": "Previous image",
    "nextImage": "Next image",
    "generatedImages": "Generated images",
    "viewImage": "View image {number}",
    "carouselKeyboardHint": "Use arrow keys to navigate between images"
  }
}
```

**Romanian translations:**
```json
{
  "generate": {
    "deleteSubject": "Șterge subiectul",
    "deleteSubjectTitle": "Șterge Subiectul",
    "deleteSubjectDescription": "Ești sigur că vrei să ștergi acest subiect? Această acțiune nu poate fi anulată.",
    "downloadImage": "Descarcă imaginea",
    "openInNewTab": "Deschide în tab nou",
    "previousImage": "Imaginea anterioară",
    "nextImage": "Imaginea următoare",
    "generatedImages": "Imagini generate",
    "viewImage": "Vezi imaginea {number}",
    "carouselKeyboardHint": "Folosește tastele săgeți pentru a naviga între imagini"
  }
}
```

---

## Implementation Order

Execute phases sequentially:

1. **Phase 1** (Aria Labels) - Foundation for screen reader support
2. **Phase 2** (Form Labels) - Improves form accessibility
3. **Phase 3** (Delete Confirmation) - Prevents data loss
4. **Phase 4** (Grid Keyboard) - Critical for keyboard users
5. **Phase 5** (Carousel Keyboard) - Enhances carousel UX
6. **Phase 6** (Translations) - Must be done after all code changes to know exact keys needed

---

## Verification Checklist

After implementation, verify:
- [ ] All icon buttons announce their purpose in screen readers
- [ ] Tab key navigates through all interactive elements in logical order
- [ ] Enter/Space activates image grid items
- [ ] Arrow keys navigate carousel when open
- [ ] Delete subject shows confirmation dialog
- [ ] All form inputs have visible, associated labels
- [ ] `pnpm lint && pnpm typecheck` passes without errors

## Environment Variables

No new environment variables required.
