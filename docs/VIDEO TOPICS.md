# Video organization

Video links are stored in each project's `videos/` directory. A topic-level Markdown file defines a video group; numbered clip files in its corresponding subdirectory define the carousel entries.

For example, the teleoperated arm's System Integration & Testing videos are stored in:

```text
projects/02-arm/videos/02-system-integration-testing/
  01-grav-comp.md
  02-playback.md
  03-teleoperation.md
  04-teleoperation-2.md
```

The source files provide clip titles and YouTube URLs. The site generator reads them to populate the player beside the relevant project section. Add or reorder clips by updating their numbered source records, then rebuild the site.

Some collections use external folder links rather than individual embedded videos. Do not imply that an external link is a hosted video or that a demonstration measures performance beyond what is documented in the project text.

See the [editing guide](EDITING.md) for instructions.
