# Photo Generator Accessibility - Requirements

## Overview

This feature addresses critical accessibility and usability issues identified in a comprehensive UI/UX evaluation of the /photo-generator page. The evaluation scored 76/100 (Good), but highlighted several accessibility gaps that need to be fixed before production release, particularly for keyboard-only users and screen reader users.

## User Decisions

Key decisions made during the planning conversation:
- Focus on WCAG 2.1 AA compliance issues
- Follow existing codebase patterns for AlertDialog confirmations
- Use existing i18n infrastructure for new text strings
- Prioritize critical accessibility issues over cosmetic improvements

## Requirements

### Accessibility (Critical)

1. **Icon Button Labels** - All icon-only buttons must have descriptive `aria-label` attributes for screen readers
   - Delete buttons, navigation buttons, action buttons in carousel
   - Approximately 10 buttons across 4 components

2. **Keyboard-Accessible Image Grid** - The generated images grid must be navigable and activatable via keyboard
   - Add `role="button"`, `tabIndex={0}` to image containers
   - Handle Enter/Space key to open fullscreen view
   - Add visible focus indicators

3. **Form Label Association** - All form inputs must have properly associated labels using `htmlFor`/`id` pairs
   - Hair, Makeup, Custom Description inputs in SubjectCard
   - Custom Prompt textarea in PromptBuilderPanel
   - Resolution and Aspect Ratio selects in PreviewPanel

### Usability (High Priority)

4. **Destructive Action Confirmation** - Subject deletion must require user confirmation via AlertDialog
   - Follow existing pattern from `image-card.tsx`
   - Include clear warning message about irreversibility

5. **Carousel Keyboard Navigation** - Fullscreen image carousel must support keyboard navigation
   - Arrow Left/Right for previous/next image
   - Escape key to close (in addition to Dialog default behavior)

### Internationalization

6. **New Translation Keys** - Add English and Romanian translations for:
   - Aria labels for all icon buttons
   - Delete confirmation dialog text
   - Keyboard navigation hints

## Out of Scope

- Visual design changes beyond focus indicators
- Mobile gesture improvements
- Screen reader announcements for dynamic content updates
- Unit/E2E testing (unless explicitly requested)
- Changes to other pages (banner-generator, logo-generator, gallery)
