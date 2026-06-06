---
name: tailwind-4-docs
description: Tailwind v4 quirks vs v3 — the patterns that silently break when LLMs autocomplete v3 syntax in a v4 codebase. Load whenever editing styles in heicpix.
---

# Tailwind v4 quick reference

LLMs default to v3 patterns. v4 differs significantly and v3 syntax silently
no-ops without warnings. Read this before touching CSS.

## The big differences

| Topic | v3 | v4 |
|---|---|---|
| Config | `tailwind.config.js` | `@theme { ... }` in CSS |
| Import | `@tailwind base/components/utilities;` | `@import "tailwindcss";` |
| Plugin | `tailwindcss` npm package + PostCSS | `@tailwindcss/vite` (or `@tailwindcss/postcss`) |
| Theme access in CSS | `theme()` function | `var(--color-xxx)` directly |
| Variants in HTML | `dark:bg-black` etc | Same — no change |
| Custom colors | `extend.colors` in config | `--color-xxx` tokens in `@theme` |
| Arbitrary values | `bg-[#ff0000]` | Same |
| Container queries | Plugin | Built-in |

## What we use here

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-bg: #ffffff;
  --color-fg: #0a0a0a;
  /* ...all tokens... */
}

@layer base {
  body { background: var(--color-bg); }
}
```

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

## Common mistakes to NOT make

### ❌ Don't write `@tailwind base;`
v3 syntax. Silently does nothing. Use single `@import "tailwindcss";`.

### ❌ Don't create `tailwind.config.js`
v4 ignores it entirely. Token definitions go in `@theme` in CSS.

### ❌ Don't use `theme(colors.gray.500)` in CSS
v4 uses `var(--color-gray-500)` directly.

### ❌ Don't rely on `dark:` variant from system preference
We use `data-theme` toggle. `dark:` variant still works but reads system,
which contradicts our user-controlled toggle. Use `html[data-theme="dark"]`
selectors in CSS or arbitrary variant `[data-theme=dark]:bg-black` in HTML.

Better pattern: use CSS variables that swap based on `data-theme`. Then
write Tailwind classes like `bg-[var(--color-bg)]` and they auto-adapt.
That's what HEICPix does.

### ❌ Don't stack opacity on text color tokens
```html
<!-- BAD: light mode contrast dies -->
<p class="text-[var(--color-fg)]/50">Faded text</p>

<!-- GOOD: use the muted token -->
<p class="text-[var(--color-muted)]">Faded text</p>
```

The `/N` opacity modifier multiplies into the CSS variable's RGB, which works
fine on dark backgrounds but kills contrast on white. Define explicit
`--color-muted` for "secondary text" instead.

### ❌ Don't forget the `@layer base` wrap

Plain CSS rules in `global.css` win over `@layer utilities` in v4's cascade.
This silently breaks utility classes:

```css
/* BAD — plain `a` rule beats utility classes */
a { color: var(--color-accent); }
```

```html
<!-- Looks blue. Utility doesn't win. -->
<a class="text-[var(--color-bg)]">Open app</a>
```

Wrap in `@layer base` so it loses to utilities:

```css
/* GOOD */
@layer base {
  a { color: inherit; }
}
```

Then prose links can opt in via their own scoped rule, and utility-styled
buttons keep their text color. This is the pattern in `global.css` already.

### ❌ Don't add custom fonts without checking bundle impact

v4 doesn't tree-shake unused fonts. Each custom font = ~50KB+ over the wire.
We use `system-ui` stack for zero load time. Only deviate with a strong
reason + measure LCP impact.

## What v4 makes easier

### Arbitrary variant brackets
`hover:[&_svg]:fill-red-500` — selector-as-string. Useful for targeting
nested elements without writing CSS.

### Container queries
```html
<div class="@container">
  <p class="@md:text-lg">Adapts to container, not viewport.</p>
</div>
```

### `@source` directive
Lets you scan additional file types for class usage:
```css
@source "../public/manifest.webmanifest";
```
Useful if classes appear in JSON or non-template files.

### `@utility` directive
Define reusable utility patterns:
```css
@utility btn-primary {
  background: var(--color-accent);
  color: var(--color-accent-fg);
  padding: 0.75rem 1.5rem;
}
```
Then `<button class="btn-primary">` works.

## When to consult v4 docs directly

- New `@theme` token type (animations, breakpoints, shadows)
- Trying to use `dark:` variant
- Need to write a Tailwind plugin
- Custom variant beyond what arbitrary brackets give

Docs: https://tailwindcss.com/docs/v4-beta — but check date, since v4 is
stable as of 2025.

## Verification

```bash
# After CSS edits, confirm build succeeds + no warnings:
npm run build 2>&1 | grep -i "warn\|deprecated"
# Should be empty.
```
