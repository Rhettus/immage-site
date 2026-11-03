import { defineConfig } from "astro/config";
import remarkImmageLinks from "./src/plugins/remark-immage-links.mjs";
import { BASE, CACHE, REPO, readMeta } from "./scripts/meta.mjs";

const { ref } = readMeta();

export default defineConfig({
  site: "https://immage.photo",
  base: BASE || "/",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: {
    remarkPlugins: [[remarkImmageLinks, { base: BASE, ref, root: CACHE, repo: REPO }]],
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
