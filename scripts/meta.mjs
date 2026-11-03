// Shared by the build scripts, astro.config.mjs and the pages.
import fs from "node:fs";
import path from "node:path";

export const REPO = "Rhettus/immage";
export const CACHE = ".cache/immage";
// the site is served from the root of https://immage.photo
export const BASE = "";

export function readMeta() {
  const file = path.join(CACHE, "meta.json");
  if (!fs.existsSync(file)) {
    throw new Error(`${file} is missing: run "npm run sync" first`);
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
