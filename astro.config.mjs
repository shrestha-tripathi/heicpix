// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Canonical site origin. Mirrors the .pages.dev guard in src/site.config.ts so
// a stale Cloudflare Pages dashboard env var can't poison the built `site`.
const rawSiteUrl = process.env.PUBLIC_SITE_URL ?? 'https://heicpix.com';
const SITE_URL = /\.pages\.dev/i.test(rawSiteUrl) ? 'https://heicpix.com' : rawSiteUrl;

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // "always" → built pages live at /foo/index.html and Astro.url.pathname
  // carries the trailing slash, matching Cloudflare Pages' 308 /foo → /foo/
  // behaviour. Keeps sitemap + canonical + internal links on the 200 URL
  // (no redirect hop, no "Alternate page with canonical" warning in GSC).
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});
