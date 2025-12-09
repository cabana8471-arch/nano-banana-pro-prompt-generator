# Restructurarea Sistemului de Prompturi - Toate 3 Generatoare

## Avantajul Arhitecturii Tale

Sistemul tau de preseturi este **excelent gandit**:
- Preseturile stocheaza **ID-uri de template-uri**, nu text
- Cand modificam un `promptFragment`, **toate preseturile beneficiaza automat**
- Modularitatea este pastrata complet

---

## Problema Identificata (Toate 3 Generatoare)

### 1. Redundanta in Template-uri
Fiecare `promptFragment` contine 2-4 sinonime:
```typescript
// banner-templates.ts
"electric blue color scheme, vibrant azure palette, bright blue tones"

// logo-templates.ts
"modern minimalist logo, clean contemporary design, sleek simple branding"

// templates.ts (photo)
"golden hour lighting, warm sunset glow, magical hour illumination"
```

### 2. Asamblare prin Concatenare Simpla
Toate hook-urile fac acelasi lucru - concateneaza fragmente cu ". ":
```typescript
return parts.filter(Boolean).join(". ");
```

---

## Solutia: Template-uri cu Rol Contextual

In loc sa schimbam logica de asamblare (care ar strica modularitatea), **redefinim cum arata un promptFragment profesional**.

### Principiu: Fiecare Fragment = Contributie Contextuala

**Inainte (lista de sinonime):**
```typescript
promptFragment: "electric blue color scheme, vibrant azure palette, bright blue tones"
```

**Dupa (contributie contextuala):**
```typescript
promptFragment: "featuring an electric blue color palette that creates energy and professionalism"
```

Cand sunt concatenate, fragmentele noi formeaza **propozitii coerente**:

```
A professional banner. featuring an electric blue color palette that creates energy.
with a smooth gradient background transitioning subtly. using clean modern typography...
```

---

## Plan de Implementare

### Pasul 1: Definim Prefixe pe Categorie

Fiecare categorie de template primeste un **prefix implicit** care face fragmentul contextual:

| Categorie | Prefix Implicit | Exemplu Fragment Nou |
|-----------|-----------------|---------------------|
| **colorScheme** | "featuring" | "featuring an electric blue palette" |
| **backgroundStyle** | "with" | "with a smooth gradient background" |
| **mood** | "creating" | "creating a trustworthy atmosphere" |
| **designStyle** | "using" | "using clean modern aesthetics" |
| **textPlacement** | "with" | "with centered text placement" |
| **typography** | "styled in" | "styled in bold slab serif" |
| **industry** | "for" | "for the nanotechnology sector" |
| **bannerType** | (none - starts sentence) | "About Us hero banner" |

### Pasul 2: Restructurare Template-uri

**Fisiere de modificat:**

| Fisier | Template-uri | Effort |
|--------|-------------|--------|
| [banner-templates.ts](src/lib/data/banner-templates.ts) | ~300 | Mare |
| [logo-templates.ts](src/lib/data/logo-templates.ts) | ~150 | Mediu |
| [templates.ts](src/lib/data/templates.ts) | ~200 | Mediu |

**Exemplu transformare completa (Banner - Color Scheme):**

```typescript
// INAINTE
{
  id: "color-electric-blue",
  name: "Electric Blue",
  description: "Vibrant blue palette",
  promptFragment: "electric blue color scheme, vibrant azure palette, bright blue tones"
}

// DUPA
{
  id: "color-electric-blue",
  name: "Electric Blue",
  description: "Vibrant blue palette",
  promptFragment: "featuring an electric blue color palette that conveys energy and innovation"
}
```

**Exemplu transformare (Logo - Design Style):**

```typescript
// INAINTE
{
  id: "style-modern-minimal",
  promptFragment: "modern minimalist logo, clean contemporary design, sleek simple branding"
}

// DUPA
{
  id: "style-modern-minimal",
  promptFragment: "using a modern minimalist approach with clean lines and purposeful simplicity"
}
```

**Exemplu transformare (Photo - Lighting):**

```typescript
// INAINTE
{
  id: "lighting-golden-hour",
  promptFragment: "golden hour lighting, warm sunset glow, magical hour illumination"
}

// DUPA
{
  id: "lighting-golden-hour",
  promptFragment: "illuminated by golden hour light with warm, soft shadows"
}
```

### Pasul 3: Ajustare Minora Logica Asamblare

Modificam **doar intro-ul si finalul** in fiecare hook:

**Banner (`use-banner-builder.ts`):**
```typescript
// Intro mai profesional
parts.push(`A professional ${width}x${height} ${bannerTypeName}`);

// ... restul fragmentelor raman la fel ...

// Final cu instructiuni clare
parts.push("High quality advertising design with clean composition");
```

**Logo (`use-logo-builder.ts`):**
```typescript
parts.push(`A professional company logo design`);
// ... fragmente ...
parts.push("Vector-ready, scalable, brand-appropriate");
```

**Photo (`use-prompt-builder.ts`):**
```typescript
parts.push(`A ${styleName} photograph`);
// ... fragmente ...
parts.push("High resolution, professionally composed");
```

---

## Rezultat Asteptat

### Banner - Prompt Actual:
```
Professional web banner design. about us banner, company story showcase, team introduction design.
nanotechnology industry style, nano-scale aesthetic. electric blue color scheme, vibrant azure palette,
bright blue tones. trustworthy mood, reliable atmosphere, dependable professional feel...
```

### Banner - Prompt Nou:
```
A professional 1440x400 About Us hero banner. for the nanotechnology and scientific instrumentation sector.
featuring an electric blue color palette that conveys trust and innovation. with a smooth gradient
background transitioning subtly across the composition. creating a trustworthy and professional atmosphere.
using clean modern design aesthetics. with centered text placement allowing clear headline visibility.
styled in bold slab serif typography. Include headline: "Advanced instrumentation, real impact".
High quality advertising design with clean composition.
```

### Logo - Prompt Nou:
```
A professional company logo design. for the technology sector. using a modern minimalist approach
with clean lines. featuring a deep blue and silver color palette. incorporating abstract geometric
symbol elements. styled in clean sans-serif typography. creating a trustworthy and innovative feel.
Text: "TechCorp". Vector-ready, scalable, brand-appropriate.
```

### Photo - Prompt Nou:
```
A photorealistic photograph. of a confident professional in formal business attire. positioned in
a modern office environment with large windows. illuminated by soft natural window light creating
gentle shadows. shot with shallow depth of field emphasizing the subject. conveying confidence and
approachability. High resolution, professionally composed.
```

---

## Fisiere de Modificat (PILOT: Banner Generator)

### Fase Pilot - Doar Banner:
1. [src/lib/data/banner-templates.ts](src/lib/data/banner-templates.ts) - ~300 template-uri
2. [src/hooks/use-banner-builder.ts](src/hooks/use-banner-builder.ts) - intro + final (liniile 330-340, 490-495)

### Dupa Validare (Logo + Photo):
- Se vor implementa dupa testarea si validarea rezultatelor banner

---

## Categorii de Template-uri Banner (in ordine de procesare)

| # | Categorie | Nr. Templates | Prefix |
|---|-----------|---------------|--------|
| 1 | bannerTypeTemplates | ~45 | (starts sentence) |
| 2 | industryTemplates | ~30 | "for" |
| 3 | designStyleTemplates | ~35 | "using" |
| 4 | colorSchemeTemplates | ~45 | "featuring" |
| 5 | moodTemplates | ~30 | "creating" |
| 6 | seasonalTemplates | ~40 | "with" |
| 7 | backgroundStyleTemplates | ~40 | "with" |
| 8 | visualEffectsTemplates | ~30 | "enhanced by" |
| 9 | iconGraphicsTemplates | ~20 | "incorporating" |
| 10 | promotionalTemplates | ~20 | "highlighting" |
| 11 | layoutStyleTemplates | ~10 | "arranged in" |
| 12 | textPlacementTemplates | ~15 | "with" |
| 13 | typographyStyleTemplates | ~25 | "styled in" |
| 14 | ctaButtonStyleTemplates | ~50 | "featuring" |
| 15 | bannerSizeTemplates | ~40 | (dimension context) |

---

## Beneficii

1. **Backward Compatible** - Preseturile existente functioneaza fara modificari
2. **Modularitate Pastrata** - Sistemul de template-uri ramane intact
3. **Prompturi Profesionale** - Descrieri narative in loc de liste de cuvinte
4. **Flexibilitate** - Utilizatorii pot in continuare combina orice template-uri
5. **Imbunatatire Globala** - O modificare de template afecteaza toate preseturile care il folosesc
