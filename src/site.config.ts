// Single source of truth for ALL user-facing brand strings.
// NEVER hardcode the literal brand name anywhere else in src/.
// Edit .env (or .env.local) to rebrand the entire site.

const env = import.meta.env;

// Defensive guard: Cloudflare Pages dashboard often has stale `*.pages.dev`
// values left over from pre-domain deploys. They silently poison canonical
// URLs, OG tags, and sitemap.xml. Reject them and fall back to defaults.
// See: stale-build-env-var-defensive-default skill for the war story.
const TOXIC = /\.pages\.dev/i;

const DEFAULT_DOMAIN = "heicpix.com";
const DEFAULT_URL = "https://heicpix.com";

const rawSiteUrl = env.PUBLIC_SITE_URL ?? DEFAULT_URL;
const siteUrl = TOXIC.test(rawSiteUrl) ? DEFAULT_URL : rawSiteUrl;

const rawDomain = env.PUBLIC_SITE_DOMAIN ?? DEFAULT_DOMAIN;
const siteDomain = TOXIC.test(rawDomain) ? DEFAULT_DOMAIN : rawDomain;

export const site = {
  // Brand identity
  name: env.PUBLIC_SITE_NAME ?? "HEICPix",
  shortName: env.PUBLIC_SITE_SHORT_NAME ?? "HEICPix",
  tagline: env.PUBLIC_SITE_TAGLINE ?? "iPhone HEIC photos to JPG, PNG, WebP, or AVIF — free forever",
  description:
    env.PUBLIC_SITE_DESCRIPTION ??
    "Free forever HEIC converter — JPG, PNG, WebP, AVIF. Browser-only, nothing uploads. Unlimited batch, no signup, no ads, no premium tier. Works on Windows, Mac, Chromebook, Android, every browser.",

  // URLs
  domain: siteDomain,
  url: siteUrl,

  // Owner / org (for JSON-LD Organization schema)
  org: {
    name: env.PUBLIC_ORG_NAME ?? "WorksOffline",
    url: env.PUBLIC_ORG_URL ?? "https://worksoffline.in",
    logo: env.PUBLIC_ORG_LOGO ?? "https://worksoffline.in/favicon.svg",
  },

  // Theme color (used in <meta name="theme-color"> + manifest)
  themeColorDark: "#0a0a0a",
  themeColorLight: "#ffffff",

  // Analytics — gated to production only via Layout.astro
  ga4MeasurementId: env.PUBLIC_GA4_MEASUREMENT_ID ?? "",

  // Social / sharing
  twitter: env.PUBLIC_TWITTER_HANDLE ?? "@worksoffline",

  // localStorage namespace for app state (theme, prefs, etc.)
  // Keep stable across rebrands — if you change this, existing users
  // lose their settings.
  storageNs: "heicpix",
} as const;

export type SiteConfig = typeof site;
