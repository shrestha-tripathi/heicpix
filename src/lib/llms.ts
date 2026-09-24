import { site, lastUpdatedLabel } from "../site.config";
import { absoluteUrl } from "./baseUrl";
import { pseo } from "../data/pseo";

/**
 * llms.txt (llmstxt.org). Generated at build time so brand/domain come from
 * site.config. Add new indexable pages here (and to sitemap.xml.ts).
 */
export const pages: { path: string; desc: string }[] = [
  { path: "/", desc: "The converter: HEIC/HEIF to JPG, PNG, WebP or AVIF in the browser, unlimited batch, quality slider." },
  { path: "/how-it-works", desc: "How in-browser conversion works (libheif WASM in Web Workers, OffscreenCanvas encode)." },
  { path: "/faq", desc: "FAQ: HEIC basics, platforms, privacy, formats, limits." },
  { path: "/install", desc: "Install as a PWA / Share Target on phone or desktop." },
  { path: "/heic-viewer", desc: "View a HEIC file in the browser without converting." },
  { path: "/heic-exif", desc: "Read EXIF/GPS metadata inside a HEIC, locally." },
  { path: "/strip-heic-exif", desc: "Remove GPS and all metadata from iPhone photos." },
  { path: "/heic-to-png", desc: "HEIC to PNG (lossless)." },
  { path: "/heic-to-webp", desc: "HEIC to WebP." },
  { path: "/heic-to-avif", desc: "HEIC to AVIF." },
  { path: "/heic-to-jpg-windows", desc: "HEIC to JPG on Windows." },
  { path: "/heic-to-jpg-mac", desc: "HEIC to JPG on Mac." },
  { path: "/heic-to-jpg-chromebook", desc: "HEIC to JPG on Chromebook." },
  { path: "/heic-to-jpg-android", desc: "HEIC to JPG on Android." },
  { path: "/heic-for-whatsapp", desc: "Sending HEIC photos via WhatsApp." },
  { path: "/heic-for-gmail", desc: "HEIC attachments in Gmail." },
  { path: "/heic-for-slack", desc: "HEIC in Slack." },
  { path: "/heic-for-discord", desc: "HEIC in Discord." },
  { path: "/heic-for-outlook", desc: "HEIC in Outlook." },
  { path: "/heic-for-canva", desc: "HEIC in Canva." },
  { path: "/heic-for-wordpress", desc: "HEIC uploads in WordPress." },
  { path: "/free-forever", desc: "Why the converter is free with no premium tier." },
  { path: "/privacy", desc: "Privacy: nothing uploads." },
  { path: "/about", desc: "About the project." },
  { path: "/blog", desc: "Blog: HEIC guides and explainers." },
  ...pseo.map((p) => ({ path: `/${p.slug}`, desc: p.description })),
];

export function llmsHeader(): string {
  return `# ${site.name}

> ${site.description}

## What it is
A free web app that converts iPhone HEIC/HEIF photos to JPG, PNG, WebP or AVIF. Files are decoded with libheif compiled to WebAssembly inside Web Workers and re-encoded with the browser canvas. Batch as many files as you like; download individually, as a .zip, save to a folder, or share.

## Privacy
Photos never leave the device: no upload, no server processing, no account. Output is re-encoded from pixels, so EXIF/GPS metadata is not carried into converted files. Aggregate page analytics only; no ads.

## Limits
- Input: .heic / .heif (iPhone, iPad, some Android). Output: JPG, PNG, WebP, AVIF (AVIF only where the browser can encode it).
- Quality slider 30–100% for lossy formats (default 92%). PNG is lossless and larger.
- No PDF output. Very large batches are capped per device memory (a few hundred on desktop).
- Works offline after first load (service worker). Free, no signup. Last updated ${lastUpdatedLabel}.
`;
}

export function pageList(): string {
  return pages.map((p) => `- [${p.path}](${absoluteUrl(p.path)}): ${p.desc}`).join("\n");
}
