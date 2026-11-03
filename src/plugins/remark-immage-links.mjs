// Makes immage's Markdown work on the site:
// - links between guide pages (foo.md#x) go to /guide/foo/#x
// - images/... go to the copied images; missing screenshots are dropped,
//   and a portrait one (a side panel) gets class "tall" so text wraps beside it
// - anything else in the repo goes to GitHub at the synced ref
// - in RELEASE_NOTES.md, the "Improvements" / "Performance" / "Bug fixes"
//   labels become headings
import fs from "node:fs";
import path from "node:path";

const LABELS = new Set(["Improvements", "Performance", "Bug fixes"]);

// width and height from a PNG header, or null for anything else
function pngSize(file) {
  try {
    const fd = fs.openSync(file, "r");
    const b = Buffer.alloc(24);
    fs.readSync(fd, b, 0, 24, 0);
    fs.closeSync(fd);
    if (b.toString("latin1", 1, 4) !== "PNG") return null;
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  } catch {
    return null;
  }
}

export default function remarkImmageLinks({ base, ref, root, repo }) {
  const rootAbs = path.resolve(root);

  return (tree, file) => {
    const src = file.path ? path.resolve(file.path) : "";
    if (!src.startsWith(rootAbs + path.sep)) return;
    const dir = path.dirname(src);
    const isNotes = path.basename(src) === "RELEASE_NOTES.md";

    // returns the new url, or null for an image that doesn't exist yet
    function map(url) {
      if (!url || /^([a-z][a-z0-9+.-]*:|#|\/)/i.test(url)) return url;
      const [p, hash = ""] = url.split("#");
      const h = hash ? `#${hash}` : "";
      const abs = path.resolve(dir, decodeURI(p));
      const rel = path.relative(rootAbs, abs).split(path.sep).join("/");
      if (rel.startsWith("..")) return url;

      const page = rel.match(/^app\/docs\/([^/]+)\.md$/);
      if (page) {
        const slug = page[1].toLowerCase() === "readme" ? "" : `${page[1]}/`;
        return `${base}/guide/${slug}${h}`;
      }
      const image = rel.match(/^app\/docs\/images\/(.+)$/);
      if (image) return fs.existsSync(abs) ? `${base}/guide/images/${image[1]}` : null;

      const kind = p.endsWith("/") || !path.extname(p) ? "tree" : "blob";
      return `https://github.com/${repo}/${kind}/${ref}/${rel.replace(/\/$/, "")}${h}`;
    }

    function walk(node) {
      if (!node.children) return;
      const out = [];
      for (const child of node.children) {
        if (child.type === "image") {
          const url = map(child.url);
          if (url === null) continue;
          const size = url !== child.url && pngSize(path.resolve(dir, decodeURI(child.url.split("#")[0])));
          if (size && size.height > size.width) {
            child.data = { ...child.data, hProperties: { ...child.data?.hProperties, className: ["tall"] } };
          }
          child.url = url;
        } else if (child.type === "link") {
          const url = map(child.url);
          if (url === null) {
            walk(child);
            out.push(...child.children);
            continue;
          }
          child.url = url;
        } else if (child.type === "html") {
          let missing = false;
          child.value = child.value.replace(/\b(src|href)="([^"]+)"/g, (all, attr, url) => {
            const mapped = map(url);
            if (mapped === null) {
              missing = true;
              return all;
            }
            return `${attr}="${mapped}"`;
          });
          if (missing) continue;
          child.value = child.value.replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" ');
          child.value = child.value.replace(/<img (?![^>]*class=)([^>]*src="([^"]+)")/g, (all, rest, url) => {
            const local = url.startsWith(`${base}/guide/images/`) && path.join(rootAbs, "app/docs/images", url.slice(`${base}/guide/images/`.length));
            const size = local && pngSize(local);
            return size && size.height > size.width ? `<img class="tall" ${rest}` : all;
          });
        } else if (
          isNotes &&
          child.type === "paragraph" &&
          child.children.length === 1 &&
          child.children[0].type === "text" &&
          LABELS.has(child.children[0].value.trim())
        ) {
          out.push({ type: "heading", depth: 3, children: child.children });
          continue;
        }
        walk(child);
        out.push(child);
      }
      node.children = out;
    }

    walk(tree);
  };
}
