# Logo Generator Accessibility - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | ARIA Labels | 3 |
| 2 | Form Associations | 1 |
| 3 | Touch Targets | 2 |
| 4 | Undo/Redo & Reset UI | 2 |
| 5 | Keyboard Shortcuts | 1 |
| 6 | Error Feedback & Icons | 1 |

**Complexity:** S (6 phases, ~8 files)

---

## Phase 1: ARIA Labels

Adăugarea `aria-label` pe elementele interactive care nu au text vizibil descriptiv.

### Component Updates

- [x] Add aria-label to color picker input - `src/components/logo-generator/logo-builder/logo-color-manager.tsx`
  - Line ~163-165: Add `aria-label={label}` to native color input

- [x] Add aria-label to template selector button - `src/components/logo-generator/logo-builder/logo-template-selector.tsx`
  - Line ~80-99: Add `aria-label={t("selectTemplate")}` to selector button

- [x] Add role and aria-label to image cards - `src/components/logo-generator/results/logo-results-panel.tsx`
  - Lines ~212-290: Add `role="button"` and `aria-label` to clickable image containers

### Technical Details

**Color picker (logo-color-manager.tsx):**
```tsx
// Before:
<input
  type="color"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="w-9 h-9 ..."
/>

// After:
<input
  type="color"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="w-9 h-9 ..."
  aria-label={label}
/>
```

**Image cards (logo-results-panel.tsx):**
```tsx
// Before:
<div
  className={cn("relative group cursor-pointer ...", ...)}
  onClick={() => setSelectedIndex(i)}
>

// After:
<div
  role="button"
  tabIndex={0}
  aria-label={`${t("results.generatedLogo")} ${i + 1}`}
  className={cn("relative group cursor-pointer ...", ...)}
  onClick={() => setSelectedIndex(i)}
  onKeyDown={(e) => e.key === "Enter" && setSelectedIndex(i)}
>
```

---

## Phase 2: Form Associations

Asocierea corectă între label-uri și input-uri folosind `htmlFor` și `id`.

### Component Updates

- [ ] Add htmlFor/id associations - `src/components/logo-generator/logo-builder/logo-text-content-editor.tsx`
  - Add unique `id` to each Input component
  - Add matching `htmlFor` to each Label component

### Technical Details

**Pattern de implementare:**
```tsx
// Before:
<div className="space-y-2">
  <Label>{t("fields.businessName")}</Label>
  <Input
    value={config.businessName}
    onChange={(e) => updateConfig({ businessName: e.target.value })}
  />
</div>

// After:
<div className="space-y-2">
  <Label htmlFor="logo-business-name">{t("fields.businessName")}</Label>
  <Input
    id="logo-business-name"
    value={config.businessName}
    onChange={(e) => updateConfig({ businessName: e.target.value })}
  />
</div>
```

**ID-uri de folosit:**
- `logo-business-name` - Business Name
- `logo-tagline` - Tagline
- `logo-industry` - Industry

---

## Phase 3: Touch Targets

Mărirea țintelor tactile la minimum 44x44px pentru conformitate WCAG.

### Component Updates

- [ ] Increase color picker size - `src/components/logo-generator/logo-builder/logo-color-manager.tsx`
  - Line ~163: Change `w-9 h-9` (36px) to `w-11 h-11` (44px)

- [ ] Increase symbol checkbox touch area - `src/components/logo-generator/logo-builder/sections/icon-symbol-section.tsx`
  - Lines ~85-113: Increase overall button size or add padding for 44px minimum

### Technical Details

**Color picker (logo-color-manager.tsx):**
```tsx
// Before:
<input
  type="color"
  className="w-9 h-9 rounded cursor-pointer"
/>

// After:
<input
  type="color"
  className="w-11 h-11 rounded cursor-pointer"
/>
```

**Symbol checkboxes (icon-symbol-section.tsx):**
```tsx
// Before:
<button className="flex items-center justify-center h-4 w-4 ...">

// After - increase padding on parent button:
<Button
  variant="outline"
  className="min-h-11 px-3 ..."  // Ensure 44px height
>
```

---

## Phase 4: Undo/Redo & Reset UI

Expunerea funcționalităților existente în interfața utilizatorului.

### Component Updates

- [ ] Add undo/redo buttons to LogoBuilderPanel header - `src/components/logo-generator/logo-builder/logo-builder-panel.tsx`
  - Import Undo2, Redo2 icons from lucide-react
  - Add props for canUndo, canRedo, onUndo, onRedo
  - Add buttons in panel header

- [ ] Pass history props from page and add reset button - `src/app/[locale]/logo-generator/page.tsx`
  - Pass history functions to LogoBuilderPanel
  - Uncomment/expose reset button with confirmation dialog

### Technical Details

**LogoBuilderPanel header update:**
```tsx
interface LogoBuilderPanelProps {
  // existing props...
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
}

// In header section:
<div className="flex items-center gap-1">
  <Button
    variant="ghost"
    size="icon"
    onClick={onUndo}
    disabled={!canUndo}
    aria-label={t("undo")}
  >
    <Undo2 className="h-4 w-4" />
  </Button>
  <Button
    variant="ghost"
    size="icon"
    onClick={onRedo}
    disabled={!canRedo}
    aria-label={t("redo")}
  >
    <Redo2 className="h-4 w-4" />
  </Button>
</div>
```

**Reset button with confirmation:**
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon" aria-label={t("reset")}>
      <RotateCcw className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t("resetConfirmTitle")}</AlertDialogTitle>
      <AlertDialogDescription>{t("resetConfirmDescription")}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
      <AlertDialogAction onClick={handleReset}>{t("reset")}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Phase 5: Keyboard Shortcuts

Adăugarea scurtăturilor de tastatură pentru operațiuni frecvente.

### Component Updates

- [ ] Add keyboard event listeners - `src/app/[locale]/logo-generator/page.tsx`
  - Add useEffect with keyboard event handler
  - Cmd/Ctrl+Enter for generate
  - Cmd/Ctrl+Z for undo
  - Cmd/Ctrl+Shift+Z for redo

### Technical Details

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey;

    // Generate: Cmd/Ctrl + Enter
    if (isMod && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }

    // Undo: Cmd/Ctrl + Z (without Shift)
    if (isMod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      if (canUndo) undo();
    }

    // Redo: Cmd/Ctrl + Shift + Z
    if (isMod && e.key === "z" && e.shiftKey) {
      e.preventDefault();
      if (canRedo) redo();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [canUndo, canRedo, undo, redo, handleGenerate]);
```

**Notă:** Trebuie să ne asigurăm că shortcut-urile nu interferează cu input-urile text (verificare `document.activeElement`).

---

## Phase 6: Error Feedback & Navigation Icons

Îmbunătățirea feedback-ului la erori și înlocuirea textului de navigație cu iconițe.

### Component Updates

- [ ] Add download error toast and replace navigation arrows - `src/components/logo-generator/results/logo-results-panel.tsx`
  - Lines ~156-158: Add toast.error for download failure
  - Lines ~395, 402: Replace `<` and `>` spans with ChevronLeft/ChevronRight icons

### Technical Details

**Download error handling:**
```tsx
// Before:
} catch (error) {
  console.error("Download failed:", error);
}

// After:
} catch (error) {
  console.error("Download failed:", error);
  toast.error(t("results.downloadError"));
}
```

**Navigation icons:**
```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

// Before:
<Button ...>
  <span className="text-2xl">&lt;</span>
</Button>

// After:
<Button ...>
  <ChevronLeft className="h-5 w-5" />
</Button>

// Similar for right arrow with ChevronRight
```

---

## Implementation Order

Execute phases sequentially. Each phase must be completed before starting the next.

1. Phase 1 - ARIA Labels (accessibility foundation)
2. Phase 2 - Form Associations (accessibility)
3. Phase 3 - Touch Targets (accessibility)
4. Phase 4 - Undo/Redo & Reset UI (usability - depends on nothing)
5. Phase 5 - Keyboard Shortcuts (usability - benefits from Phase 4)
6. Phase 6 - Error Feedback & Icons (polish)

## Verification

After each phase:
```bash
pnpm typecheck && pnpm lint
```

After all phases:
- Test with keyboard-only navigation
- Verify screen reader announces labels correctly
- Test on mobile for touch targets
- Verify keyboard shortcuts work

## Environment Variables

No new environment variables required.

## Translations

Add the following keys to translation files:

```json
{
  "logoGenerator": {
    "undo": "Undo",
    "redo": "Redo",
    "reset": "Reset",
    "resetConfirmTitle": "Reset Configuration",
    "resetConfirmDescription": "This will reset all logo settings to their default values. This action cannot be undone.",
    "results": {
      "downloadError": "Failed to download image. Please try again.",
      "generatedLogo": "Generated logo"
    }
  }
}
```
