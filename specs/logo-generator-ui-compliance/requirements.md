# Logo Generator UI Compliance - Requirements

## Overview

Aducerea paginii `/logo-generator` la conformitate cu standardele UI ale proiectului prin înlocuirea culorilor Tailwind hardcodate cu token-uri semantice din design system și eliminarea stilurilor inline în favoarea claselor Tailwind.

## User Decisions

Key decisions made during the planning conversation:
- Înlocuirea culorilor hardcodate (`text-green-600`, `text-yellow-600`, etc.) cu token-uri semantice (`text-success`, `text-warning`, `text-destructive`)
- Păstrarea culorilor hex din color picker-ul pentru logo-uri (acestea sunt pentru designul logo-urilor, nu pentru UI)
- Utilizarea token-urilor `chart-*` pentru culorile badge-urilor de tip referință unde nu există token semantic direct
- Eliminarea stilurilor inline din logo preview panel

## Requirements

### Core Functionality

1. **WCAG Contrast Checker** - Indicatorii de contrast trebuie să folosească token-uri semantice
   - `text-success` pentru nivelurile AAA și AA
   - `text-warning` pentru AA Large
   - `text-destructive` pentru Fail

2. **Reference Type Badges** - Badge-urile pentru tipurile de referință (style, composition, color) trebuie să folosească token-uri din design system

3. **Warning Alerts** - Alert-urile de avertisment trebuie să folosească token-ul `warning` în loc de culori galben hardcodate

4. **Logo Format Preview** - Dimensiunile preview-ului trebuie să folosească clase Tailwind în loc de inline styles

### UI/UX

1. Suport automat pentru dark mode prin utilizarea token-urilor semantice
2. Consistență vizuală cu restul aplicației
3. Menținerea funcționalității existente fără schimbări de comportament

## Out of Scope

- Modificarea culorilor din paleta color picker-ului (acestea sunt culori pentru logo-uri, nu UI)
- Adăugarea de noi funcționalități
- Modificări la alte pagini
- Testing automat
