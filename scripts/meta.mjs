// Shared by the build scripts, astro.config.mjs and the pages.
import fs from "node:fs";
import path from "node:path";

export const REPO = "Rhettus/immage";
// The guide and release notes are built from this immage branch or tag
// instead of the latest release, while the downloads still point at the
// latest release. Set it to "" once the release it names is the latest.
export const DOCS_REF = "release-0.42.0";
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
