/**
 * Base URL helper — supports deploying under a non-root path
 * (e.g. `/heicpix/` on GitHub Pages) without breaking links.
 *
 * Usage: `<a href={b("/faq")}>FAQ</a>` instead of `<a href="/faq">`.
 *
 * In Astro static builds, `import.meta.env.BASE_URL` includes the trailing
 * slash. We normalize that here so callers don't need to worry.
 */

import { site } from "../site.config";

/**
 * Normalize a path to ALWAYS end with a trailing slash (except a bare query/
 * hash or a real file like /sitemap.xml). This matches Cloudflare Pages'
 * default behaviour — it 308-redirects /faq → /faq/ and only serves 200 at
 * /faq/. Emitting the slash everywhere (internal links, canonical, sitemap,
 * breadcrumb) keeps Googlebot on the 200 URL: no redirect hop, and the
 * submitted URL matches its own canonical. astro.config sets
 * `trailingSlash: "always"` so the built output agrees.
 */
export function withTrailingSlash(path: string): string {
  const [base, ...rest] = path.split(/(?=[?#])/);
  const suffix = rest.join("");
  if (base === "" || base === "/") return `/${suffix}`;
  // Leave real files (last segment contains a dot) alone, e.g. /sitemap.xml.
  const lastSeg = base.split("/").pop() ?? "";
  if (lastSeg.includes(".")) return `${base}${suffix}`;
  return base.endsWith("/") ? `${base}${suffix}` : `${base}/${suffix}`;
}

export function b(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  // Strip leading slash from path; ensure base has trailing slash
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return withTrailingSlash(`${cleanBase}${cleanPath}`);
}

/**
 * Build an absolute URL (origin + path) for canonical, OG, sitemap, and
 * breadcrumb JSON-LD. Always trailing-slashed so the URL we advertise is the
 * exact one Cloudflare serves a 200 for.
 */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${withTrailingSlash(cleanPath)}`;
}
