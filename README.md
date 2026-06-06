# HEICPix

> iPhone HEIC photos → JPG. In your browser. Nothing uploads.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

## What

A fully client-side HEIC to JPG converter. Drag a folder of 200 iPhone photos
in, get 200 JPGs out. No upload, no signup, no limits, no ads.

**Wedge:** Every other "free HEIC converter" online (iloveimg, cloudconvert,
online-convert) either uploads your photos to their servers, caps you at 5-25
files per day, requires signup, or all three. HEICPix runs entirely in your
browser via WebAssembly.

## Status

**v0.1** — scaffold complete. Landing page live. Converter logic ships in v0.2.

## Stack

- **Astro 6** (static MPA, zero JS by default)
- **Tailwind v4** (`@theme` tokens, no config file)
- **TypeScript strict**
- **libheif-js** WASM (v0.2)
- **Cloudflare Pages** (auto-deploy from `main`)

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve the build locally
npx astro check   # TS + Astro type check
```

## Project rules

Read `AGENTS.md` before contributing. Key constraints:

- Brand name "HEICPix" lives ONLY in `src/site.config.ts` (env-driven)
- Color tokens via CSS vars in `global.css` (`var(--color-bg)`)
- Inline SVG icons only (no icon libraries)
- One feature = one commit

Design contract in `DESIGN.md`. Project-local skills in `.skills/`.

## License

Source code: MIT. Built by [WorksOffline](https://worksoffline.in).
