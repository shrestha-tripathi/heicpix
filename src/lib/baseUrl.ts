/**
 * Base URL helper — supports deploying under a non-root path
 * (e.g. `/heicpix/` on GitHub Pages) without breaking links.
 *
 * Usage: `<a href={b("/faq")}>FAQ</a>` instead of `<a href="/faq">`.
 *
 * In Astro static builds, `import.meta.env.BASE_URL` includes the trailing
 * slash. We normalize that here so callers don't need to worry.
 */

export function b(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  // Strip leading slash from path; ensure base has trailing slash
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
