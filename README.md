# immage-site

The website for [Immage](https://github.com/Rhettus/immage), published at
<https://immage.photo/>.

It is a static [Astro](https://astro.build/) site. The landing page is written
here; the user guide and release notes are **not**. They come from the immage
repository at build time, so the guide on the site always matches the latest
release.

## How it builds

`npm run build` runs three steps:

1. `scripts/sync-docs.mjs` clones immage's `app/docs` (without `dev/`) and
   `RELEASE_NOTES.md` at the latest release tag into `.cache/immage/`, copies
   the guide's images to `public/guide/images/`, and records the latest
   release's download assets in `.cache/immage/meta.json`.
2. `astro build` renders the site into `dist/`.
   `src/plugins/remark-immage-links.mjs` rewrites the guide's links:
   - links between guide pages go to `/guide/<page>/`
   - links to screenshots that don't exist yet are dropped
   - links elsewhere in the repo go to GitHub
3. `scripts/check-links.mjs` fails the build on any broken internal link or
   anchor.

The guide's sidebar follows the **Contents** list in immage's
`app/docs/README.md`, so new guide pages appear without changes here.

## Local development

```sh
npm ci
npm run sync                     # latest release
IMMAGE_REF=v0.45.0 npm run sync            # or a branch or tag
IMMAGE_LOCAL=../immage npm run sync        # or a local checkout
npm run dev
```

Set `GITHUB_TOKEN` (e.g. `GITHUB_TOKEN=$(gh auth token)`) if the GitHub API
rate limit gets in the way.

## Publishing

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds every
push and pull request, and deploys `main` to GitHub Pages. A daily run picks up
new immage releases; run the workflow by hand to publish a release straight
away, optionally with an `immage_ref` to preview a branch's guide.

## Media

Site-only screenshots live in `public/media/`. Feature rows are defined in
`src/lib/features.ts`. Give a feature `media` for a still, or `compare` for a
before/after slider (`src/components/Compare.astro`); features without either
show as cards.

## License

GPL-3.0-or-later, like Immage.
