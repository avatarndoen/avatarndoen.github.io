# Your editable portfolio website

This is the new local website root. Open this folder in Codex to continue working on it.

**To view and edit:** double-click **START WEBSITE.cmd**. It opens the website in your browser. Keep its small terminal window open while editing. Save a text file or replace an image and the page refreshes automatically. Press Ctrl+C in that window when finished.

**No installation or npm commands are needed on this computer.** The launcher can use the Node.js runtime already bundled with Codex. On another computer, install Node.js 20 or newer if it is missing.

## What to edit

| Change | Editable source |
| --- | --- |
| Homepage text, headlines, featured-project order, smaller-group order | [MAIN.md](MAIN.md) |
| Full About page | [ABOUT.md](ABOUT.md) |
| Kupang → Bandung → Japan map story and affordability motivation | [profile/JOURNEY.md](profile/JOURNEY.md) |
| Colors and page width | [DESIGN.md](DESIGN.md) |
| Education, skills, interests, work experience, publication copy | [profile/](profile/) |
| Email, telephone, paper link, CV and portfolio downloads | [links/](links/) |
| Project titles, summaries, context, cover images | Each project's `PROJECT.md` in [projects/](projects/) |
| Detailed project text and which figures appear together | Each project's `sections/` folder |
| Actual image files, their captions and alternative text | Each project's `images/` folder |
| YouTube URLs, original video links and video captions | Each project's `videos/` folder |
| The three smaller project-group titles and descriptions | [collections/](collections/) |

The `.md` files are ordinary text files. Open them in Codex, Notepad, or another text editor. Keep the `---` lines and field names; change the words after the colon. The paragraphs below the second `---` are normal Markdown.

## Your portfolio hierarchy

The homepage keeps **all five Notable projects together and equally prominent**. They are followed by three smaller, separate groups in your source order:

1. **Internship / Contract projects** — six entries.
2. **Competition projects** — two entries.
3. **Additional / Fun projects** — three entries.

Home has an integrated contents sidebar like the individual project pages. Skills and all six research interests are near the top, in larger text. Each notable-project preview can show several PDF images; edit its `home_images:` field in `PROJECT.md`. Home ends after the three smaller project groups. Full background, work experience and publication remain on About. Home itself is the project index; the separate project listing page is removed. The five notable projects have individual pages, with text-only overviews and figures beside their topics. The smaller entries are combined into three pages—one each for Internship / Contract, Competition, and Additional / Fun—with an integrated contents list. Homepage item links jump to the correct entry on its shared page. All detail/collection pages return to Home. Images are static, with no click-to-zoom control. The former overview-figure panels are removed.

## A project folder looks like this

```text
projects/
  01-wrist/
    PROJECT.md                   title, summary, cover, context
    sections/
      01-mechanism-development.md text and image selection
    images/
      mechanism-development-p3-03.webp
      mechanism-development-p3-03.md   caption and alt text
    videos/
      01-automated-cad-cae.md     shared topic link
      01-automated-cad-cae/
        01-cad-automation.md      clip title, YouTube URL, caption
        02-cae-automation.md
    links/
      publication.md             project-specific paper link
```

## Replace an image

The simplest change is to put your new image in the existing `images/` folder with the **same filename**. Edit the matching `.md` file to change its caption. The website preserves the image's natural proportions.

To add a different image, place the file beside the other project images and create a matching `.md` file. For example, `prototype.jpg` goes with `prototype.md`. Copy an existing caption file and update its description. Then add `images/prototype.jpg` to the `images:` field in the section where it should appear. Multiple image paths are separated by commas.

An image's caption is the paragraph below its second `---`. The `alt:` field briefly describes the image for accessibility. `source_asset:` and `source_page:` identify imported PDF figures; omit them for a new photo. `width:` and `height:` are optional; omit them if you do not know the dimensions. The browser uses the image's natural proportions. Supported web image formats include WebP, PNG, JPEG, GIF, AVIF and SVG.

## Add a YouTube video

Open the right project's `videos/` folder and edit the relevant `.md` file:

```text
---
title: My actuator demonstration
source_url: https://your-original-video-link
youtube_url: https://www.youtube.com/watch?v=YOUR_VIDEO_ID
placeholder: false
---

A short caption explaining what this video shows.
```

Paste a real YouTube watch, share, Shorts, or embed URL into `youtube_url:`. Leave it blank to show the original portfolio link instead. All **17 original video links** are retained. The unrelated sample video from the old site has been removed. Actual YouTube playback cannot be checked until your real URLs are added.

For the five main projects, videos appear beside their matching topic. Each topic file in `videos/` has a child folder with one `.md` file per clip. Edit those child files to change clip titles, captions or YouTube URLs; number filenames to set carousel order. A section's `video:` field names its topic record without `.md`. Multiple clips use a carousel inside that topic only. One clip has no carousel controls. The current OneDrive button opens the original folder/video; a folder does not automatically select a clip. See [verified topic titles and counts](docs/VIDEO%20TOPICS.md).

## Add or reorder a project

Copy a similar project folder in `projects/`, change the `id:` to a unique lowercase name, and edit `PROJECT.md`, its sections, images and links. The folder is discovered automatically. `order:` sets the listing order. `collection:` is one of `selected`, `industry`, `competition`, or `explorations`.

To feature it on the homepage, add its `id:` to `featured_projects:` in `MAIN.md`. To change the order of the three smaller groups, edit `secondary_collections:` in `MAIN.md`. Sections appear in filename order. Prefix their filenames with `01-`, `02-`, and so on.

## Build a portable copy

Double-click **BUILD WEBSITE.cmd** to rebuild and check the pages. The generated website is in `dist/`. You can open `dist/index.html` directly for a quick offline look; use START WEBSITE for automatic refresh and YouTube embeds. Future publication can use the contents of `dist/`.

**Edit the Markdown and image folders, not `dist/`.** The generated files are overwritten when rebuilding. No website has been published or uploaded by this local task.

## What was preserved

All 90 source images, 17 original demonstration links, 16 project entries, and the original portfolio PDF were transferred. The PDF download remains the unchanged PDF from your ZIP; it is not an export of new website edits.

The unchanged ZIP and original website are preserved next door in `../Source Files/Website Import 2026-10-28/`. Historical compact-homepage instructions in that import have been superseded by your October 28 request. See [migration notes](docs/MIGRATION.md), [design references](docs/DESIGN REFERENCES.md), and [local Codex handoff](AGENTS.md).

## PDF structure and sidebar links

Project topics retain the PDF names, order and hierarchy. The actuator color key is explanatory text inside Actuator Architecture, not a separate topic. Image caption files remain editable for provenance and alternative text, but captions are not displayed on detail/collection pages. Back to portfolio is at the top of those contents sidebars. Download CV sits beside Portfolio PDF in the top navigation on every page. The CV download is a copy of the current PDF linked from the workspace Output guide; replace `downloads/Avatar_Sargamantha_Ndoen_CV.pdf` when that canonical export changes.

## Smaller-project media

The three combined collection pages now use the same topic-specific media organization. Single videos have no arrows; multiple identified clips have their own carousel. Linkage Study remains a plain folder link. Art, free-form CAD and computational exploration sections follow the PDF subtopics and image pairings. Edit the existing source section files and video child folders to update them; the shared pages are generated automatically.
