#!/usr/bin/env node
// Fetches what the site is built from:
// - the user guide (app/docs, without dev/) and RELEASE_NOTES.md from
//   Rhettus/immage, at the latest release tag (or IMMAGE_REF)
// - the latest release's assets, for the download cards
// into .cache/immage/, with guide images copied to public/guide/images/.
//
//   IMMAGE_REF=release-0.42.0   build the guide from a branch or tag
//   IMMAGE_LOCAL=../immage      copy from a local checkout instead of cloning
//   GITHUB_TOKEN                optional; avoids API rate limits
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { CACHE, REPO } from "./meta.mjs";

const PUBLIC_IMAGES = "public/guide/images";

async function api(route) {
  const headers = { accept: "application/vnd.github+json", "user-agent": "immage-site-build" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/${route}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${route}: ${res.status} ${res.statusText}`);
  return res.json();
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
}

const release = await api(`repos/${REPO}/releases/latest`);
const ref = process.env.IMMAGE_REF || release.tag_name;

fs.rmSync(CACHE, { recursive: true, force: true });
fs.rmSync(PUBLIC_IMAGES, { recursive: true, force: true });
fs.mkdirSync(CACHE, { recursive: true });

let source;
let sha;
if (process.env.IMMAGE_LOCAL) {
  source = path.resolve(process.env.IMMAGE_LOCAL);
  sha = git(["rev-parse", "HEAD"], source);
} else {
  source = path.join(CACHE, "src");
  git(["-c", "advice.detachedHead=false", "clone", "--quiet", "--depth", "1", "--filter=blob:none", "--sparse", "--branch", ref,
    `https://github.com/${REPO}.git`, source]);
  git(["sparse-checkout", "set", "--no-cone", "/app/docs/*", "!/app/docs/dev/", "/RELEASE_NOTES.md"], source);
  sha = git(["rev-parse", "HEAD"], source);
}

const docs = path.join(CACHE, "app/docs");
fs.cpSync(path.join(source, "app/docs"), docs, {
  recursive: true,
  filter: (p) => !p.startsWith(path.join(source, "app/docs/dev")),
});
fs.copyFileSync(path.join(source, "RELEASE_NOTES.md"), path.join(CACHE, "RELEASE_NOTES.md"));
if (!process.env.IMMAGE_LOCAL) fs.rmSync(source, { recursive: true, force: true });

if (fs.existsSync(path.join(docs, "images"))) {
  fs.cpSync(path.join(docs, "images"), PUBLIC_IMAGES, { recursive: true });
}

const meta = {
  ref,
  sha,
  release: {
    tag: release.tag_name,
    version: release.tag_name.replace(/^v/, ""),
    name: release.name,
    url: release.html_url,
    published: release.published_at,
    assets: release.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
  },
};
fs.writeFileSync(path.join(CACHE, "meta.json"), JSON.stringify(meta, null, 2));
console.log(`synced immage docs at ${ref} (${sha.slice(0, 7)}); latest release ${meta.release.tag}`);
