# HEICPix — AI Agent Rules

Project rules for any AI coding agent working in this repo. Read this first.

## Project pitch

HEICPix is a **fully client-side HEIC→JPG converter** targeting the ~1.2M
monthly searches for "heic to jpg" and its long-tail cluster. Built with
Astro 6 + Tailwind v4. Deployed on Cloudflare Pages.

**Wedge vs competitors:**
- iloveimg, cloudconvert, online-convert → all UPLOAD your files. We don't.
- Their free tiers cap at 5 / 25 / N files per day. We're unlimited.
- They have ads. We don't.
- They need signup. We don't.

The brand promise is **"nothing uploads"** — protect it ruthlessly.

## Mandatory skills to load

Before any work in this repo, load these skills (in this order):

1. `.skills/web-design-guidelines/SKILL.md` — companion to `DESIGN.md`
2. `.skills/tailwind-4-docs/SKILL.md` — Tailwind v4 quirks vs v3
3. `software-development/heicpix-project` (global skill) — stack + gotchas

For new SEO landing pages or competitor analysis:
4. `domain-name-seo-research`
5. `competitor-landing-audit`

For visual debug / SVG / theme bugs:
6. `popular-web-designs`
7. `svg-horizontal-path-bbox-bug`
8. `tailwind-v4-global-anchor-color-cascade`

## Hard rules

### 1. Brand strings via `site.config.ts` ONLY

The literal name "HEICPix" must NOT appear anywhere in `src/` except
`site.config.ts` (as the default value). Use `{site.name}`, `{site.shortName}`,
etc. in components and pages.

Verification before any commit:
```bash
grep -rn "HEICPix" src/ | grep -v site.config.ts
# Empty output = clean.
```

Exceptions allowed in:
- `src/site.config.ts` (the one source of truth)
- `public/manifest.webmanifest` (static JSON, can't import config)
- `public/robots.txt` (static text)
- Page meta descriptions in `.astro` frontmatter that interpolate `{site.name}` via template literals — fine, just don't write it raw.

### 2. Tailwind v4 — no config file

- Tokens live in `@theme` inside `src/styles/global.css`
- NO `tailwind.config.js`
- NO `@tailwind base;` directive (v3 syntax — silently no-ops in v4)
- Single `@import "tailwindcss";` at the top

### 3. Color tokens via CSS variables

- ALWAYS use `bg-[var(--color-bg)]`, `text-[var(--color-fg)]`, etc.
- NEVER `text-blue-600`, `bg-gray-100`, etc.
- See `DESIGN.md` for the full token list

### 4. Brand wedge protection

Three messaging patterns are non-negotiable on every page that mentions the converter:
1. **"Nothing uploads"** — appears in hero copy + privacy page + footer
2. **"Unlimited"** — direct rebuttal of competitor caps
3. **"Works offline"** — once service worker ships, this becomes literal

### 5. SEO discipline

- Every page has `<title>`, `meta description`, canonical URL
- One `<h1>` per page
- JSON-LD when relevant (WebApplication on /, FAQPage on /faq, etc.)
- Don't add `noindex` to anything indexable
- `*.pages.dev` URL guard in `site.config.ts` is sacred — never remove

### 6. Code conventions

- TypeScript strict mode (already configured)
- Astro components for static UI, no React/Vue/Svelte (keep bundle small)
- Web Workers for heavy lifting (libheif decode, JPG encode) — never block main thread
- No CSS-in-JS libraries
- No icon font libraries (inline SVG only, use `currentColor`)
- Use `class:list` directive in Astro for conditional classes
- Comments explain WHY, not WHAT (the code shows what)

### 7. Verify before every commit

```bash
npm run build && npx astro check
```

Both must pass. `npm run build` catches Astro errors, `astro check` catches
TypeScript errors that don't surface at build time.

### 8. One feature = one commit

Revertible by design. If a feature has 3 logical chunks, that's 3 commits,
not one mega-commit. See FileTransferNow's git history for reference.

### 9. Mobile experience never touched when fixing desktop

Use `@media (min-width: 641px) { ... }` to gate desktop tweaks. Modifying
mobile + desktop in the same CSS rule has burned us repeatedly in other
projects (PresetPhoto, FileTransferNow).

### 10. Inline SVG > icon libraries

For all decorative + functional icons. Zero deps, zero runtime cost, theme-
adaptive via `currentColor`.

## Tech stack reference

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static MPA) |
| Styling | Tailwind v4 (`@tailwindcss/vite`) |
| TypeScript | strict mode |
| Node | `>=22.12.0` |
| HEIC decode | `libheif-js` WASM (not yet installed) |
| Worker pool | `comlink` (not yet installed) |
| Zip download | `client-zip` streaming (not yet installed) |
| Deploy | Cloudflare Pages auto-deploy from `main` |
| Worker (future) | Cloudflare Worker if signaling needed (not yet needed) |

## File structure

```
heicpix/
├── astro.config.mjs            # Astro 6 + tailwindcss vite plugin
├── package.json                # astro, tailwindcss
├── tsconfig.json               # strict
├── public/
│   ├── manifest.webmanifest    # PWA + Share Target (future)
│   ├── favicon.svg             # theme-adaptive
│   └── robots.txt
├── src/
│   ├── site.config.ts          # ONLY place brand strings live
│   ├── layouts/Layout.astro    # JSON-LD, OG, theme bootstrap
│   ├── pages/
│   │   └── index.astro         # hero landing
│   ├── components/             # (empty — add as needed)
│   ├── lib/                    # (empty — add convertHeic.ts etc here)
│   └── styles/global.css       # @theme tokens + base layer
├── DESIGN.md                   # visual contract
├── AGENTS.md                   # this file
├── .skills/                    # project-local skills
│   ├── web-design-guidelines/SKILL.md
│   └── tailwind-4-docs/SKILL.md
├── .env.example                # all PUBLIC_SITE_* vars documented
├── .gitignore
└── README.md
```

## What's shipped vs what's NOT

### v0.1 (this scaffold)
- [x] Astro 6 + Tailwind v4 + TS strict baseline
- [x] `site.config.ts` env-driven brand strings
- [x] `Layout.astro` with JSON-LD, OG meta, theme bootstrap, GA4-prod-gated
- [x] `index.astro` hero landing (no converter logic yet)
- [x] `global.css` with light + dark tokens, base layer, reduced-motion respect
- [x] DESIGN.md + AGENTS.md + project skills
- [x] `.env.example` documented

### v0.2 (next ship)
- [ ] DropZone component + drag-drop + file picker
- [ ] `libheif-js` WASM worker pool (4 desktop, 1 mobile)
- [ ] Per-file progress UI
- [ ] Save-to-folder (FSA) + Download .zip (client-zip)
- [ ] Web Share Target via manifest

### v0.3
- [ ] /faq with JSON-LD FAQPage
- [ ] /how-it-works with JSON-LD HowTo
- [ ] /privacy
- [ ] /about
- [ ] 404 page
- [ ] sitemap.xml route
- [ ] OG image generation
- [ ] Favicon pack (app-icon-pack skill)

### v0.4
- [ ] Domain purchased + Cloudflare Pages connected
- [ ] AdSense application
- [ ] LTD tier paywall + Stripe webhook

## Anti-patterns observed in past projects (don't repeat)

- ❌ Hardcoding folder name in source (see p2pdatasharing → p2pdatesharing folder rename pain)
- ❌ Stacking opacity on text colors (killed FileTransferNow light-mode contrast for weeks)
- ❌ Leaving `*.pages.dev` env vars in Cloudflare dashboard after rebrand (poisoned FTN sitemap for a week)
- ❌ Pure-horizontal SVG paths with `objectBoundingBox` gradients (invisible stroke bug)
- ❌ Tailwind v3 patterns in v4 (`@tailwind base;` silently no-ops, wastes hours)
- ❌ Trusting vision tool on pixel-precise SVG questions (cross-check with DOM `getBoundingClientRect`)
- ❌ Building features without a SPEC.md first when they have UX tradeoffs (causes scrap+rebuild cycles)

## Verification one-liner (for future sessions)

```bash
cd ~/projects/heicpix && npm run build && npx astro check && \
  grep -rn "HEICPix" src/ | grep -v site.config.ts | wc -l | \
  awk '{ if ($1 == 0) print "✓ brand discipline clean"; else print "✗ brand leak in " $1 " places" }'
```

Expected: all three checks pass + "✓ brand discipline clean".
