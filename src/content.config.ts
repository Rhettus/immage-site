import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Both come from immage itself, copied by scripts/sync-docs.mjs.
export const collections = {
  guide: defineCollection({
    loader: glob({ pattern: "*.md", base: "./.cache/immage/app/docs" }),
  }),
  notes: defineCollection({
    loader: glob({ pattern: "RELEASE_NOTES.md", base: "./.cache/immage" }),
  }),
};
