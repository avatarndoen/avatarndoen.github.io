# Avatar Ndoen — Engineering Portfolio

Editable portfolio website for Avatar Sargamantha Ndoen.

## Preview locally

Install Node.js 20 or newer, then run:

```sh
node scripts/serve.mjs
```

On Windows, double-click START WEBSITE.cmd.

## Edit content

- MAIN.md: Home and project groups.
- ABOUT.md and profile/: profile and skills.
- projects/: project text, images, and video links.
- collections/: combined project collections.
- links/: contact and PDF downloads.
- DESIGN.md and site/: styling.

## Build

```sh
node scripts/build.mjs
node scripts/check.mjs
```

Generated website files are in dist/. No package installation is needed.

## GitHub Pages

The built website is also included at the repository root. GitHub Pages can serve main / root. To refresh those files after editing, run `node scripts/publish.mjs`, then upload the changes.
