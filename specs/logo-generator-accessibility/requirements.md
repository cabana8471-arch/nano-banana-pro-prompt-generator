# Logo Generator Accessibility - Requirements

## Overview

Rezolvarea problemelor de accesibilitate și usability identificate în evaluarea UI/UX a paginii `/logo-generator`. Aceste îmbunătățiri vizează conformitatea WCAG 2.1 AA, expunerea funcționalităților existente dar ascunse, și îmbunătățirea experienței utilizatorilor.

## User Decisions

Key decisions made during the planning conversation:
- Focalizare pe problemele de accesibilitate (ARIA, htmlFor, touch targets) ca prioritate principală
- Expunerea funcționalităților deja implementate (undo/redo, reset) în UI
- Adăugarea keyboard shortcuts pentru power users
- Înlocuirea textului de navigație cu iconițe Lucide

## Requirements

### Accessibility (High Priority)

1. **ARIA Labels** - Adăugarea `aria-label` pe toate elementele interactive
   - Color picker input în LogoColorManager
   - Template selector button în LogoTemplateSelector
   - Image cards în LogoResultsPanel

2. **Form Associations** - Asocierea corectă label-input cu `htmlFor`/`id`
   - LogoTextContentEditor - toate câmpurile de input

3. **Touch Targets** - Mărirea țintelor tactile la minimum 44x44px
   - Color picker (de la 36px la 44px)
   - Symbol element checkboxes

### Usability (Medium Priority)

4. **Undo/Redo UI** - Expunerea butoanelor undo/redo în interfață
   - Hook-ul `useLogoHistory` este deja implementat
   - Butoane în header-ul LogoBuilderPanel

5. **Reset Configuration** - Adăugarea butonului de reset
   - Funcția `handleReset` există dar nu e expusă
   - Dialog de confirmare înainte de reset

6. **Keyboard Shortcuts** - Adăugarea scurtăturilor pentru power users
   - Cmd/Ctrl+Enter pentru generare
   - Cmd/Ctrl+Z pentru undo
   - Cmd/Ctrl+Shift+Z pentru redo
   - Escape pentru închiderea modalelor

7. **Download Error Feedback** - Afișarea toast la eroare de descărcare

8. **Navigation Icons** - Înlocuirea `<` și `>` cu iconițe ChevronLeft/ChevronRight

## Out of Scope

- Modificări la design-ul vizual existent (deja acoperit de logo-generator-ui-compliance)
- Testare automată (unit tests, e2e)
- Funcționalități noi care nu sunt deja implementate
- Modificări la alte pagini
