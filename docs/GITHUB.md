# GitHub Pages deployment

**Repository:** https://github.com/avatarndoen/avatarndoen.github.io  
**Website:** https://avatarndoen.github.io/

GitHub Pages serves the generated site from the `main` branch at the repository root. Editable text and metadata live primarily in Markdown files; publishing rebuilds their corresponding HTML and static assets.

## Publishing workflow

1. Update the relevant Markdown content or image/video records.
2. Run `node scripts/serve.mjs` to preview changes locally.
3. Run `node scripts/publish.mjs` to rebuild the site and copy its output to the repository root.
4. Run `node scripts/check.mjs` to check page references, asset records, and download checksums.
5. Inspect the Git diff, commit the intended files, and push to `main`.
6. Confirm that GitHub Pages has deployed and review the affected live pages.

The downloadable CV and portfolio PDF are separate files in `downloads/`. Updating website text does not update those documents automatically.

## Search visibility

Pages currently include a `noindex, nofollow, noimageindex` meta directive. They can be opened using their direct URLs, but search engines are asked not to index them. This does not make the public site or repository private.

To change search discoverability, update the generator in `scripts/build.mjs`, rebuild and republish consistently. Do not edit the generated HTML files individually.
