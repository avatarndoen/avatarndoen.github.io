# Image asset provenance

Most portfolio figures originate from the owner's engineering portfolio documents. Project image folders contain the published images, alongside Markdown files for descriptions, alternative text, and available source information.

The image upgrade manifest, [`WORD IMAGE UPGRADES.json`](WORD%20IMAGE%20UPGRADES.json), records source media references, dimensions, cropping information, and image hashes for replacements made during the portfolio migration. The build verification script uses the manifest to detect unintended changes to those assets.

When replacing an image, preserve its descriptive sidecar record, update its alternative text where needed, and review all pages using it. If a managed image is intentionally replaced, update the relevant integrity record before rerunning the checks.

Images are presented as project documentation; rendering or conversion does not itself constitute additional experimental validation.
