#!/usr/bin/env node
// Fails the build if a page links to a page, file or #anchor that isn't in dist/.
import fs from "node:fs";
import path from "node:path";
import { BASE } from "./meta.mjs";

const DIST = "dist";
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) pages.push(p);
  }
})(DIST);

const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) {
    const html = fs.readFileSync(file, "utf8");
    ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return ids.get(file);
};

const problems = [];
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const here = "/" + path.relative(DIST, page).split(path.sep).join("/");
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(raw)) continue;
    const [p, hash] = raw.replace(/&amp;/g, "&").split("#");
    let target;
    if (!p) target = page;
    else {
      if (!p.startsWith(BASE + "/")) {
        problems.push(`${here}: ${attr} ${raw} is outside ${BASE}/`);
        continue;
      }
      const rel = decodeURI(p.slice(BASE.length + 1));
      target = path.join(DIST, rel);
      if (p.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
        target = path.join(target, "index.html");
      }
    }
    if (!fs.existsSync(target)) problems.push(`${here}: ${raw} not found`);
    else if (hash && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(hash))) {
      problems.push(`${here}: #${hash} not found in ${raw || "this page"}`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} broken link(s):\n  ${[...new Set(problems)].join("\n  ")}`);
  process.exit(1);
}
console.log(`links ok: ${pages.length} pages checked`);
