export interface PseoPage {
  slug: string;
  crumb: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Short answer shown in the TL;DR box. */
  tldr: string;
  sections: { h2: string; body?: string; list?: string[] }[];
  steps: { name: string; text: string }[];
  faqs?: { q: string; a: string }[];
  cta: string;
  related: string[];
}
