/**
 * Build a JSON-LD BreadcrumbList schema.
 *
 * Pass an ordered array of {name, path}. The first entry is implicitly
 * the home (added automatically). Pass paths as absolute site paths
 * (e.g. "/heic-to-jpg-windows") — they get joined to site.url.
 */
import { site } from "../site.config";
import { absoluteUrl } from "./baseUrl";

export interface CrumbInput {
  name: string;
  path: string;
}

export function breadcrumb(...crumbs: CrumbInput[]) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: site.name,
      item: site.url,
    },
    ...crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
