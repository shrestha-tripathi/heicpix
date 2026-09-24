import { pseoA } from "./pseo-a";
import { pseoB } from "./pseo-b";
export type { PseoPage } from "./pseo-types";

/** Data-driven landing pages rendered by src/pages/[slug].astro. */
export const pseo = [...pseoA, ...pseoB];
