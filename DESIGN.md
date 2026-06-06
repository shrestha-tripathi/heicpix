# HEICPix — Design Contract

> Visual + interaction contract for HEICPix. Read this BEFORE touching UI.
> Anything that contradicts this file is a bug or a deliberate, documented
> exception.

## Brand voice

- **Direct, not clever.** "Drop iPhone photos. Get JPGs." > "Revolutionize your photo workflow."
- **Specific, not generic.** "Unlimited batch" > "Powerful conversion."
- **Trust through transparency.** "Nothing uploads" appears on every page touching the converter.
- **Friendly, not corporate.** No "leverage," "synergy," or "robust." Yes "actually free," "drop it here."

## Color tokens (Tailwind v4 `@theme`)

All colors are CSS variables defined in `src/styles/global.css` under `@theme`.
**Never hardcode hex values in components.** Use `bg-[var(--color-bg)]` etc.

### Light mode
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#ffffff` | Body background |
| `--color-fg` | `#0a0a0a` | Body text |
| `--color-muted` | `#6b7280` | Secondary text, captions |
| `--color-border` | `#e5e7eb` | Card borders, dividers |
| `--color-surface` | `#f9fafb` | Cards, dropzone background |
| `--color-accent` | `#2563eb` | Primary CTA, links (Apple-blue affinity) |
| `--color-accent-hover` | `#1d4ed8` | Hover/active state |
| `--color-accent-fg` | `#ffffff` | Text on accent backgrounds |
| `--color-success` | `#16a34a` | ✓ checkmarks, success states |
| `--color-warning` | `#d97706` | Warnings, "keep tab open" |
| `--color-error` | `#dc2626` | Errors, failed conversions |

### Dark mode
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Body background |
| `--color-fg` | `#fafafa` | Body text |
| `--color-muted` | `#9ca3af` | Secondary text |
| `--color-border` | `#262626` | Borders |
| `--color-surface` | `#171717` | Cards, dropzone bg |
| `--color-accent` | `#60a5fa` | Lighter blue for dark bg |
| `--color-accent-hover` | `#93c5fd` | Hover |
| `--color-accent-fg` | `#0a0a0a` | Text on accent backgrounds |

### Theme switching
- **Default**: dark mode (matches iPhone Photos app dark default)
- **User override** persists in `localStorage["heicpix:theme"]`
- Bootstrap script in `Layout.astro` runs BEFORE stylesheets — no FOUC
- Future toggle button writes `data-theme` + dispatches `themechange` event

## Typography

- **Font stack**: `system-ui, -apple-system, "Segoe UI", Roboto, ...` — zero web font loading
- **Heading weight**: 800 (extra-bold) for hierarchy without custom font
- **Letter-spacing on headings**: `-0.025em` (tight tracking for display)
- **Body line-height**: default (1.5)
- **Type scale**: Tailwind defaults (text-sm 14px, text-base 16px, text-lg 18px, text-xl 20px, text-2xl 24px, text-3xl 30px, text-5xl 48px, text-6xl 60px, text-7xl 72px)

## Spacing

- Stick to Tailwind's default 4px grid (`p-4` = 16px, `p-6` = 24px, `p-8` = 32px, etc.)
- Section vertical rhythm: `py-16` minimum (64px) between major sections
- Max content width: `max-w-3xl` (768px) for prose, `max-w-4xl` (896px) for feature grids, `max-w-6xl` (1152px) for hero+features combo

## Radius

| Token | Use |
|---|---|
| `rounded-md` (6px) | Inline UI (buttons, badges) |
| `rounded-lg` (8px) | Cards |
| `rounded-xl` (12px) | Big surfaces (dropzone, feature panels) |
| `rounded-2xl` (16px) | Hero-level visual elements |

## Buttons

### Primary (CTA)
```html
<button class="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold hover:bg-[var(--color-accent-hover)] transition-colors">
  Convert HEICs
</button>
```

### Secondary
```html
<button class="px-6 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] font-semibold hover:bg-[var(--color-border)] transition-colors">
  Learn more
</button>
```

### Ghost (low emphasis)
```html
<button class="px-4 py-2 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
  Cancel
</button>
```

## Cards / Surfaces

- Use `bg-[var(--color-surface)]` for elevated content
- Borders `border border-[var(--color-border)]`
- Radius `rounded-xl` minimum
- Internal padding `p-6` or `p-8`

## Iconography

- **Inline SVG only** — never icon font libraries (deps + runtime cost)
- Use `currentColor` for fill/stroke so icons inherit theme
- Decorative icons get `aria-hidden="true"`
- Functional icons need `aria-label`

## Components

### Dropzone (the hero piece)
- Min height: 280px on mobile, 320px on desktop
- Dashed border `border-2 border-dashed border-[var(--color-border)]`
- Background `bg-[var(--color-surface)]`
- Centered content: icon + label + secondary text
- Active state (drag hover): change border to `border-[var(--color-accent)]` + slight `bg-[var(--color-accent)]/5`

### File row (per-file conversion progress)
- Single row per file: filename + size before/after + progress bar + status
- Compact: `py-3` vertical padding
- Status colors: muted (queued) → accent (converting) → success (done) → error (failed)
- Filename truncates with `truncate` utility (single line, ellipsis)

### Status pill
- Inline badge: small rounded-full with icon + text
- Variants: queued (muted), converting (accent + animated dot), done (success), error (error)

## Anti-patterns ❌

- ❌ Hardcoded hex colors anywhere outside `global.css` and `site.config.ts`
- ❌ `text-blue-600` (use `text-[var(--color-accent)]`)
- ❌ `bg-white` / `bg-black` (use `bg-[var(--color-bg)]`)
- ❌ Stacking opacity on text color tokens (`text-[var(--color-fg)]/50` — kills light-mode contrast)
- ❌ Icon font libraries (FontAwesome, Material Icons)
- ❌ Custom web fonts (kills LCP, hurts SEO, slows install)
- ❌ Tailwind `@tailwind base;` directive (v4 doesn't use it — single `@import "tailwindcss";`)
- ❌ `tailwind.config.js` (v4 uses `@theme` in CSS — config file is ignored)
- ❌ Hardcoding the brand name "HEICPix" anywhere outside `site.config.ts` (use `{site.name}`)
- ❌ Animations longer than 300ms for UI feedback (annoying)
- ❌ Animations without `prefers-reduced-motion` respect (a11y violation — handled globally in `global.css`)

## Mobile-first rules

- Touch targets ≥ 44×44 px
- Stack everything vertically below `sm:` breakpoint (640px)
- Use `min-w-0` + `truncate` on any text inside flex containers (prevents overflow)
- Don't gate critical UI behind hover states (touch has no hover)

## Accessibility (mandatory)

- All interactive elements keyboard-reachable
- Focus rings via `*:focus-visible` (defined globally — `outline: 2px solid var(--color-accent)`)
- Decorative emoji/SVG → `aria-hidden="true"`
- Functional icons → `aria-label="..."`
- All form inputs have visible labels (no placeholder-only labels)
- Contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text (verified in both themes)

## SEO conventions

- One `<h1>` per page
- Semantic landmarks: `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`
- Every page sets meta description via Layout props
- JSON-LD per page when relevant (WebApplication on /, FAQPage on /faq, HowTo on /how-it-works)
- Canonical URL always set (auto-derived from current path in Layout)
- `*.pages.dev` URLs get `noindex` via `_headers` file

## Implementation reference

Color tokens, theme switching, anchor cascade fix, and other Tailwind v4
gotchas → see `.skills/tailwind-4-docs/SKILL.md`.

Visual examples + recurring component patterns → `.skills/web-design-guidelines/SKILL.md`.
