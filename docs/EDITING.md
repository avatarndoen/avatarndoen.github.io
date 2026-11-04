# Editing the portfolio

The site is built from Markdown content and project assets. The generated HTML at the repository root is for publication, not the primary source of text.

## Main content

| Edit | Source |
| --- | --- |
| Introduction and featured project order | [`MAIN.md`](../MAIN.md) |
| Personal background | [`ABOUT.md`](../ABOUT.md), [`profile/`](../profile/) |
| Project summaries and metadata | `projects/<project>/PROJECT.md` |
| Project sections and explanations | `projects/<project>/sections/*.md` |
| Project figures and captions | `projects/<project>/images/` |
| Project video titles, URLs, and captions | `projects/<project>/videos/` |
| Other projects | [`collections/`](../collections/) |
| Colors and styling | [`DESIGN.md`](../DESIGN.md), [`site/`](../site/) |

Section files are ordered by their numeric filename prefixes. Their headings and text are written in Markdown; fields between the opening `---` markers provide page metadata.

## Images

Place images in the project's `images/` folder. Add a corresponding Markdown metadata file with the same base filename (for example, `prototype.webp` and `prototype.md`), including appropriate alternative text. Reference the image from a section's `images:` field. Existing image metadata also records source-document information where available.

## Videos

Each video group has a Markdown record in a project's `videos/` directory. Multiple clips for the group are stored as numbered Markdown records in a folder of the same name. The clip records control title, YouTube URL, and optional caption; their filenames determine display order.

To add a clip, copy an existing clip record in the correct group, update its title and `youtube_url:`, and give it the next numbered filename. Do not edit player data directly in the published HTML.

See [video organization](VIDEO%20TOPICS.md) for further details.

## Preview and publish

Use Node.js 20 or later:

```sh
node scripts/serve.mjs
```

The preview server rebuilds when source content changes. To prepare the files served by GitHub Pages:

```sh
node scripts/publish.mjs
node scripts/check.mjs
```

The publish script builds into `dist/` and copies the generated output to the repository root. Check the changes before committing. Do not remove asset manifests in `docs/`: the verification script relies on them.
