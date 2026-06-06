import type { APIRoute } from "astro";
import { site } from "../site.config";

/**
 * Custom sitemap route — handmade because we want explicit control
 * over which pages get indexed vs which don't (e.g. /share is a
 * runtime endpoint, not a real page).
 */
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);

  const pages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/how-it-works", priority: "0.8", changefreq: "monthly" },
    { path: "/faq", priority: "0.8", changefreq: "monthly" },
    { path: "/privacy", priority: "0.5", changefreq: "yearly" },
    { path: "/heic-to-jpg-windows", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-jpg-mac", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-png", priority: "0.7", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url>
    <loc>${site.url}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
