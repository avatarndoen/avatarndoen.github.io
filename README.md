# Engineering Portfolio — Avatar Sargamantha Ndoen

Mechanical engineering · Robotics · Mechanism design · Computational optimization

**Website:** https://avatarndoen.github.io/  
**Project portfolio:** https://avatarndoen.github.io/portfolio.html

This repository contains the editable content and published pages for my engineering portfolio. The project pages document mechanical design decisions, prototypes, modeling, experimental testing, and selected demonstrations.

## Selected projects

| Project | Focus |
| --- | --- |
| [Personalized Compliant Prosthetic Wrist](https://avatarndoen.github.io/projects/wrist.html) | User-specific compliant mechanism design and simulation-driven optimization |
| [Teleoperated Robotic Arm with Custom Actuators](https://avatarndoen.github.io/projects/arm.html) | BLDC–cycloidal actuators, transmission design, and master–slave teleoperation |
| [Reverse-Engineered Beltless CVT](https://avatarndoen.github.io/projects/cvt.html) | Reverse engineering, kinematic modeling, optimization, and a physical proof of concept |
| [Underactuated Tendon-Driven Continuum Robot](https://avatarndoen.github.io/projects/continuum.html) | Tendon routing, dynamic modeling, inverse kinematics, and open-loop demonstrations |
| [Compliant Robotic Hand](https://avatarndoen.github.io/projects/hand.html) | 15-DoF tendon-driven finger actuation |

## Repository structure

- `MAIN.md`, `ABOUT.md`, and `profile/` — site introduction, background, and experience.
- `projects/` — project text, figures, video records, and additional links.
- `collections/` — other engineering and personal projects.
- `DESIGN.md` and `site/` — layout and visual styling.
- `scripts/` — static-site generation, local preview, and validation.
- `downloads/` — downloadable CV and portfolio PDF.
- Root `.html`, `.css`, and `.js` files — generated pages and assets served by GitHub Pages.

## Local preview and validation

Requires **Node.js 20 or later**. No npm dependencies need to be installed.

```sh
node scripts/serve.mjs
```

To create and check a production build:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

For content updates, edit the Markdown files and related assets rather than the generated HTML. See the [editing guide](docs/EDITING.md).

## Publishing

The site is served from the repository's `main` branch at the root. After editing:

```sh
node scripts/publish.mjs
node scripts/check.mjs
```

Review the resulting changes before committing them. See [deployment notes](docs/GITHUB.md) and [verification guidance](docs/VERIFICATION.md).

Project demonstrations are linked or embedded from their original video hosts. Future work is identified separately from completed experiments.
