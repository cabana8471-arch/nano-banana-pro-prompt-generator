# Banner Generator Accessibility - Requirements

## Overview

Remediate accessibility and UX issues identified in the `/banner-generator` page UI/UX evaluation. The page scored 79/100 with critical gaps in keyboard accessibility, ARIA compliance, and focus management that prevent users who rely on assistive technologies from fully using the application.

## User Decisions

Key decisions made during the planning conversation:
- Follow existing accessibility patterns from `site-header.tsx` (skip links) and `button.tsx` (focus styles)
- Use Radix UI Dialog's built-in focus trap rather than custom implementation
- Maintain minimum 36px (h-9) touch targets consistent with existing button sizes
- Add translations for all new ARIA labels to support i18n
- Create reusable error boundary component for graceful failure handling

## Requirements

### Critical - Keyboard Accessibility

1. All clickable image grid items in results panel must be keyboard accessible with `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers
2. Banner reference selection cards must support keyboard navigation and activation
3. Interactive elements must have visible focus indicators using `focus-visible:ring-2` pattern

### High Priority - Navigation & ARIA

1. Implement skip links for three-column layout navigation (Builder, Preview, Results panels)
2. All color picker inputs must have accessible labels via `aria-label`
3. Touch targets on all interactive elements must be minimum 44x44px (or 36px with additional padding)
4. File upload area must be keyboard accessible and activatable
5. Fullscreen image modal must properly manage focus on open/close

### Medium Priority - Content & Microcopy

1. Navigation buttons in fullscreen modal must use proper icons with ARIA labels (not text symbols)
2. Modal-triggering buttons must include `aria-haspopup="dialog"`
3. Custom prompt textarea must display character count
4. Project selector empty state must include inline action to create first project
5. Loading states must provide contextual messages (not generic "Loading...")
6. Page must have error boundary for graceful failure handling

### Low Priority - Polish

1. Standardize icon placement (icons before text in buttons)
2. History items in popover must support keyboard navigation
3. Tooltips should have slight delay before appearing
4. Banner size preview should handle extreme aspect ratios better

## Out of Scope

- Visual design changes (covered in `banner-generator-ui-compliance` spec)
- Color token updates (already implemented)
- New feature additions
- Performance optimizations
- Testing implementation
