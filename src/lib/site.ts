import { getCollection, type CollectionEntry } from "astro:content";
import { BASE, REPO, readMeta } from "../../scripts/meta.mjs";

export const meta = readMeta();
export const GITHUB = `https://github.com/${REPO}`;
export const ISSUES = `${GITHUB}/issues`;
export const RELEASES = `${GITHUB}/releases`;

/** A path under the Pages base: url("guide/"), url("#download"). */
export const url = (p = "") => `${BASE}/${p}`;

export type GuideEntry = CollectionEntry<"guide">;

export const titleOf = (e: GuideEntry) => e.body?.match(/^#\s+(.+)$/m)?.[1].trim() ?? e.id;
export const guideHref = (id: string) => url(id === "readme" ? "guide/" : `guide/${id}/`);
/** The guide page if this version of the guide has it, else a fallback URL. */
export async function guideOr(id: string, fallback: string) {
  const ids = new Set((await getCollection("guide")).map((e) => e.id));
  return ids.has(id) ? guideHref(id) : fallback;
}
export const readmeHref = (hash = "") => `${GITHUB}/blob/${meta.ref}/README.md${hash}`;

export const sourceHref = (id: string) =>
  `${GITHUB}/blob/${meta.ref}/app/docs/${id === "readme" ? "README" : id}.md`;

export interface NavGroup {
  label: string;
  items: { id: string; title: string }[];
}

/**
 * The sidebar follows the "Contents" list of the guide's own README:
 * **Group** lines start a group, "- [Title](page.md)" lines add pages.
 * Pages the README doesn't list are added at the end, so none go missing.
 */
export async function guideNav(): Promise<NavGroup[]> {
  const entries = await getCollection("guide");
  const byId = new Map(entries.map((e) => [e.id, e]));
  const readme = byId.get("readme");
  const contents = readme?.body?.split(/^## Contents\s*$/m)[1]?.split(/^## /m)[0] ?? "";

  const groups: NavGroup[] = [];
  const seen = new Set(["readme"]);
  for (const line of contents.split("\n")) {
    const group = line.match(/^\*\*(.+)\*\*\s*$/);
    if (group) {
      groups.push({ label: group[1], items: [] });
      continue;
    }
    const link = line.match(/^- \[([^\]]+)\]\(([a-z0-9-]+)\.md(#[^)]*)?\)/);
    if (!link || link[3] || !byId.has(link[2]) || seen.has(link[2])) continue;
    seen.add(link[2]);
    if (!groups.length) groups.push({ label: "Guide", items: [] });
    groups.at(-1)!.items.push({ id: link[2], title: titleOf(byId.get(link[2])!) });
  }
  const rest = entries.filter((e) => !seen.has(e.id));
  if (rest.length) groups.push({ label: "More", items: rest.map((e) => ({ id: e.id, title: titleOf(e) })) });
  return groups.filter((g) => g.items.length);
}

export interface Download {
  os: "macos" | "windows" | "linux";
  name: string;
  requirements: string;
  files: { label: string; url: string; size: number; file: string }[];
  firstOpen: string;
}

const find = (re: RegExp) => meta.release.assets.find((a: { name: string }) => re.test(a.name));

function file(label: string, re: RegExp) {
  const a = find(re);
  return a ? [{ label, url: a.url, size: a.size, file: a.name }] : [];
}

// Requirements match immage's README; first-open steps match its release notes.
export const downloads: Download[] = [
  {
    os: "macos",
    name: "macOS",
    requirements: "Apple silicon, macOS 15 or newer",
    files: file("Download .dmg", /-macOS-arm64\.dmg$/),
    firstOpen:
      "Drag Immage to Applications and open it once. When macOS says it can't check it, go to System Settings › Privacy & Security and click Open Anyway.",
  },
  {
    os: "windows",
    name: "Windows",
    requirements: "Windows 10 or 11, x64. Windows on ARM through x64 emulation",
    files: file("Download installer", /-Windows-x64-setup\.exe$/),
    firstOpen: "Run the installer. When SmartScreen stops it, click More info, then Run anyway.",
  },
  {
    os: "linux",
    name: "Linux",
    requirements: "x86-64 or ARM64, glibc 2.35 or newer (Ubuntu 22.04 and later, Linux Mint 22.x)",
    files: [
      ...file("x86-64 AppImage", /-Linux-x86_64\.AppImage$/),
      ...file("ARM64 AppImage", /-Linux-arm64\.AppImage$/),
    ],
    firstOpen: "Make the AppImage executable (chmod +x) and run it.",
  },
];

/** One file per platform, for the hero's direct download button. */
const asset = (re: RegExp) => {
  const a = find(re);
  return a ? { url: a.url as string, size: a.size as number } : undefined;
};
export const direct = {
  macos: asset(/-macOS-arm64\.dmg$/),
  windows: asset(/-Windows-x64-setup\.exe$/),
  linuxX64: asset(/-Linux-x86_64\.AppImage$/),
  linuxArm64: asset(/-Linux-arm64\.AppImage$/),
};

export const mb = (bytes: number) => `${Math.round(bytes / 1048576)} MB`;

export const releaseDate = new Date(meta.release.published).toLocaleDateString("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
