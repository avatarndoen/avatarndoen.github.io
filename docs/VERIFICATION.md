# Website validation

The site includes build-time checks for linked assets and source records.

## Run checks

```sh
node scripts/build.mjs
node scripts/check.mjs
```

The check script validates the generated page inventory, local asset references, image metadata and integrity records, original video links, YouTube embed handling, and the checksums recorded for the downloadable PDFs.

The image integrity manifest is [`WORD IMAGE UPGRADES.json`](WORD%20IMAGE%20UPGRADES.json), and the download manifest is [`DOWNLOADS.json`](DOWNLOADS.json). Keep both in sync when replacing assets.

## Manual review

Automated validation does not verify the meaning of project claims or the visual quality of every device or browser. Before publishing, review:

- Desktop and mobile layout, including navigation and long project pages.
- Figure rendering and alternative text.
- Video selection and external playback links.
- PDF download links.
- Technical descriptions, experimental observations, and clearly identified future work.

The live site should be checked after GitHub Pages deploys the updated files.
