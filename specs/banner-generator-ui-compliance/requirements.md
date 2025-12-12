# Banner Generator UI Compliance - Requirements

## Overview

Remediate UI/UX violations identified in the `/banner-generator` page to achieve full compliance with ShadCN/Tailwind design system standards. The page currently scores 7.5/10 due to hard-coded colors and manual dark mode variants that bypass the semantic token system.

## User Decisions

Key decisions made during the planning conversation:
- Use semantic tokens (`--success`, `--warning`) instead of hard-coded Tailwind colors
- Hard-coded hex color palettes in the color picker are acceptable (user-facing brand options) but need documentation
- Reference type colors should use existing chart tokens (`chart-1`, `chart-3`, `chart-5`)
- Inline styles for dynamic sizing are acceptable; inline styles for colors are not

## Requirements

### Core Functionality

1. Add semantic color tokens to `globals.css` for success and warning states
2. Replace all hard-coded Tailwind color classes with semantic tokens
3. Remove manual dark mode variants (`dark:text-*`) by using auto-switching tokens
4. Convert inline style color usage to className-based approach

### Styling Standards

1. Success states must use `text-success` / `bg-success` tokens
2. Warning states must use `text-warning` / `bg-warning` tokens
3. Error/destructive states must use existing `text-destructive` / `bg-destructive` tokens
4. Reference type colors (style, composition, color) must use chart tokens

### Documentation

1. Color palette arrays in `advanced-color-picker.tsx` must have JSDoc comment explaining they are user-facing brand options, not UI tokens

## Out of Scope

- Refactoring color palette arrays to use CSS custom properties (they are user data, not UI styling)
- Changes to inline styles for dynamic sizing/dimensions (acceptable pattern)
- Adding new ShadCN components
- Visual design changes beyond color token compliance
