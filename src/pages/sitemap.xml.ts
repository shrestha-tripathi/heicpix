import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../site.config";

/**
 * Custom sitemap route — handmade because we want explicit control over
 * which pages get indexed vs which don't (e.g. /share is a runtime
 * endpoint, not a real page).
 *
 * Blog posts auto-include from the content collection.
 */
export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);

  const staticPages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/how-it-works", priority: "0.8", changefreq: "monthly" },
    { path: "/install", priority: "0.8", changefreq: "monthly" },
    { path: "/faq", priority: "0.8", changefreq: "monthly" },
    { path: "/blog", priority: "0.7", changefreq: "weekly" },
    { path: "/free-forever", priority: "0.7", changefreq: "yearly" },
    { path: "/privacy", priority: "0.5", changefreq: "yearly" },
    // Inspector tools (v0.5)
    { path: "/heic-viewer", priority: "0.8", changefreq: "monthly" },
    { path: "/heic-exif", priority: "0.8", changefreq: "monthly" },
    { path: "/strip-heic-exif", priority: "0.8", changefreq: "monthly" },
    // Platform pages
    { path: "/heic-to-jpg-windows", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-jpg-mac", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-jpg-chromebook", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-jpg-android", priority: "0.7", changefreq: "monthly" },
    // Format pages
    { path: "/heic-to-png", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-webp", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-to-avif", priority: "0.7", changefreq: "monthly" },
    // App-specific pages (v0.5)
    { path: "/heic-for-whatsapp", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-gmail", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-slack", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-discord", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-outlook", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-canva", priority: "0.7", changefreq: "monthly" },
    { path: "/heic-for-wordpress", priority: "0.7", changefreq: "monthly" },
  ];

  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const blogPosts = posts.map((p) => ({
    path: `/blog/${p.id}`,
    priority: "0.6",
    changefreq: "monthly",
    lastmod: (p.data.updatedDate ?? p.data.pubDate).toISOString().slice(0, 10),
  }));

  const allPages = [
    ...staticPages.map((p) => ({ ...p, lastmod: today })),
    ...blogPosts,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) =>
      `  <url>
    <loc>${site.url}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
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
