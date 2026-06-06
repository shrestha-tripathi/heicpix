---
name: web-design-guidelines
description: Visual design + component patterns for HEICPix. Companion to DESIGN.md. Load before building any new UI surface.
---

# HEICPix design guidelines

Recurring patterns + component examples. Lives next to DESIGN.md (which
defines the contract) — this file is the cookbook.

## Component recipes

### Hero (above-the-fold landing)

```astro
<section class="max-w-3xl w-full text-center">
  <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
    Direct.<br />
    <span class="text-[var(--color-accent)]">No fluff.</span>
  </h1>
  <p class="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
    Supporting sentence that explains the wedge in plain language.
  </p>
  <!-- CTA or interactive widget -->
</section>
```

Type scale: 5xl mobile → 7xl desktop. Tight tracking on heading. Muted
supporting text. CTA inside the section.

### Dropzone

```astro
<div
  class="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-12 sm:p-16 bg-[var(--color-surface)]"
  data-state="idle"
>
  <div class="text-6xl mb-4" aria-hidden="true">⬇</div>
  <p class="text-lg font-semibold mb-2">Drop .heic files here</p>
  <p class="text-sm text-[var(--color-muted)]">Or tap to pick photos</p>
</div>
```

Active state (drag-hover) via JS: `data-state="active"` → swap border color + tint bg.

```css
[data-state="active"] {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 5%, var(--color-surface));
}
```

### Per-file progress row

```astro
<div class="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
  <span class="text-2xl" aria-hidden="true">🖼</span>
  <div class="flex-1 min-w-0">
    <div class="flex items-baseline justify-between gap-2">
      <span class="font-medium truncate">IMG_0001.heic</span>
      <span class="text-xs text-[var(--color-muted)] shrink-0">2.1 MB → 0.8 MB</span>
    </div>
    <div class="mt-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
      <div class="h-full bg-[var(--color-accent)] transition-all" style="width: 67%"></div>
    </div>
  </div>
  <span class="text-[var(--color-success)] shrink-0" aria-label="Done">✓</span>
</div>
```

Key: `flex-1 min-w-0` on the middle column + `truncate` on the filename
prevents overflow. `shrink-0` on the icons + size label keeps them from
collapsing.

### Status pill (badge with icon)

```astro
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)]">
  <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" aria-hidden="true"></span>
  Done
</span>
```

Variants: swap the dot color (`--color-accent` for in-progress with `animate-pulse`, `--color-error` for failed, etc.).

### Primary CTA button

```astro
<button
  type="button"
  class="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold hover:bg-[var(--color-accent-hover)] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
>
  Convert {count} HEIC{count === 1 ? '' : 's'}
</button>
```

Notes:
- Always set `type="button"` (browsers default to `submit` and that breaks forms)
- Focus ring uses `focus-visible:` (only shown on keyboard nav, not mouse)
- Hover transition kept short (~150ms default)

### Feature card (3-up grid)

```astro
<section class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <article class="text-center">
    <div class="text-3xl mb-3" aria-hidden="true">🔒</div>
    <h2 class="text-lg font-bold mb-2">Nothing uploads</h2>
    <p class="text-sm text-[var(--color-muted)]">
      Single sentence explaining the benefit.
    </p>
  </article>
  <!-- 2 more articles -->
</section>
```

Always 1-column on mobile, 3-column desktop. Centered text. Icon on top.
H2 for the headline. Body in muted text.

## Animation guidelines

### Allowed
- Color/background transitions (150-200ms ease)
- Progress bars (linear, matches actual progress)
- Spinner / pulse on active state (1s loop max)
- Subtle scale on button press (`active:scale-[0.98]`)

### Forbidden
- Bouncy springs (saps attention)
- Multi-second intro animations (annoying after first visit)
- Animations on scroll (parallax, fade-in-on-view) — slows perceived perf
- Any animation > 300ms for UI feedback

### Respect reduced motion

`global.css` already has the global rule:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Don't need to add `motion-safe:` prefix on every animation. The global rule
handles it.

## Layout patterns

### Centered single-column page

```astro
<main class="flex-1 flex flex-col items-center justify-center px-6 py-16">
  <section class="max-w-3xl w-full">
    <!-- content -->
  </section>
</main>
```

### Page with sticky nav

```astro
<header class="sticky top-0 z-10 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <!-- logo + links -->
  </nav>
</header>

<main class="max-w-6xl mx-auto px-6 py-12">
  <!-- content -->
</main>
```

The `bg-[var(--color-bg)]/80` + `backdrop-blur-md` gives the frosted glass
effect for the sticky nav. Works in both themes via the var.

## SVG iconography

### Inline SVG with `currentColor`

```astro
<svg viewBox="0 0 24 24" class="w-5 h-5 text-[var(--color-fg)]" aria-hidden="true">
  <path
    fill="currentColor"
    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
  />
</svg>
```

Notes:
- `viewBox` matches the path's coordinate system
- `class="w-5 h-5"` (Tailwind size — 1.25rem = 20px) for icon-grade
- `text-[var(--color-fg)]` sets `color` → `currentColor` inherits → fills auto-theme
- `aria-hidden="true"` for decorative icons
- For functional icons (buttons), wrap in `<button aria-label="...">` instead

### Theme-adaptive favicon

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .fg { fill: #0a0a0a; }
    @media (prefers-color-scheme: dark) {
      .fg { fill: #fafafa; }
    }
  </style>
  <path class="fg" d="..."/>
</svg>
```

Note: favicon uses `prefers-color-scheme` (system) not `data-theme` (user).
That's fine — favicon lives outside the page's theme context.

## Accessibility checklist

Before shipping any new UI:

- [ ] All interactive elements reachable by Tab
- [ ] Focus indicator visible (auto via `*:focus-visible` in global.css)
- [ ] Color contrast ≥ 4.5:1 body, ≥ 3:1 large text (both themes)
- [ ] Decorative SVG/emoji has `aria-hidden="true"`
- [ ] Buttons with icon-only have `aria-label`
- [ ] Form inputs have visible labels (not just placeholders)
- [ ] Errors announced via `role="alert"` or `aria-live="polite"`
- [ ] No content shifts without user action (animations have stable layout)
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with reduced motion preference

## Don't repeat past mistakes

These patterns burned us in adjacent projects:

1. **Don't stack opacity on text tokens** — broke FileTransferNow light-mode contrast (use `--color-muted` instead)
2. **Don't use horizontal-only SVG paths with `objectBoundingBox` gradients** — invisible stroke bug, needs `Q` curve workaround
3. **Don't write unlayered `a { color: ... }` rules** — beats utility classes in v4 cascade, wrap in `@layer base`
4. **Don't hardcode brand name in components** — `{site.name}` everywhere
5. **Don't write desktop fixes that touch mobile media queries** — gate desktop changes inside `@media (min-width: 641px)`
6. **Don't use vision tool for pixel-precise SVG questions** — cross-check with `getBoundingClientRect` via browser_console
