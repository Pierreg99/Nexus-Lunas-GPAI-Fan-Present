# Luna's First Project Pack

Luna's First Project Pack is a small, local-first thank-you for early supporters. It gives someone a useful thing to open today, a tiny project to understand, and enough prompts and structure to make a next thing of their own.

There is no account, subscription, API key, analytics, or required service. The website and tools run in the browser; the downloadable files can be kept independently.

## Start here

If you only want the gift, open [`index.html`](index.html) or download [`luna-first-project-pack.zip`](downloads/luna-first-project-pack.zip). Extract the ZIP and open its `index.html`.

If browser storage behaves differently when opening local files, start a temporary local server from the repository root:

```sh
python -m http.server 8080
```

Then visit <http://localhost:8080>. The site itself has no build step or runtime dependencies.

## What is included

| Part | What it gives you |
| --- | --- |
| Seven local tools | Prompt Builder, Terminal Quickstart, E-mail Starter, Mini Kanban, JSON Helper, First Project Checklist, and Luna Mini Missions. |
| Twenty prompts | Five each for learning, coding, planning, and troubleshooting, with hand-written illustrative examples. |
| Luna Launchpad | A working local goal tracker with editable HTML, CSS, JavaScript, README, and walkthrough. |
| Freebie Creator Kit | Original prompts, bounded agent roles, Codex-compatible skills, privacy-first rules, recipient profiles, a five-session plan, and a roadmap. |
| Early-supporter extras | A personalized plain-text thank-you, three themes, and original desktop/phone wallpapers in PNG and SVG. |

## Downloads

- [`downloads/luna-first-project-pack.zip`](downloads/luna-first-project-pack.zip) — the complete standalone pack: website, tools, prompt library, Launchpad, creator kit, guides, wallpapers, and the starter-project ZIPs.
- [`downloads/luna-freebie-creator-kit.zip`](downloads/luna-freebie-creator-kit.zip) — the creator kit on its own, including its four `.agents/skills/` workflows.
- [`downloads/luna-launchpad-starter.zip`](downloads/luna-launchpad-starter.zip) — only the editable Launchpad project and its two guides.

## Build and check the source repository

The following commands are for maintainers working from a repository clone. The recipient ZIPs are already built and do not need Node.js. The project intentionally uses plain files and a small Node.js script rather than a front-end framework. Node.js 18 or newer and the `zip` command are needed for the optional archive build.

```sh
npm run build   # regenerate the three deterministic ZIP files and docs/PROMPTS.md
npm test        # syntax checks plus repository/content/archive checks
```

The same commands can be run directly with `node scripts/build-pack.mjs` and `node scripts/check-repository.mjs`. No `npm install` is required because the project has no package dependencies.

## Repository map

```text
index.html                 The standalone gift website
styles.css / app.js        Website styling and local interactions
data/prompts.js            Authoring source for the 20 prompt cards
docs/                      Quick start, generated prompts, testing, and notes
freebie-creator-kit/       Creator-kit source documents
.agents/skills/            Four portable Codex-compatible skill files
starter-project/           Editable Luna Launchpad source and walkthrough
assets/                    Original wallpaper and moon artwork
scripts/                   Reproducible packaging and repository checks
downloads/                 Tracked ZIP artifacts
```

## Data and privacy

The website stores small pieces of progress in this browser's `localStorage` when available: theme choice, Kanban tasks, checklist progress, walkthrough progress, and the optional supporter name. The Launchpad stores goals locally as well. Nothing is sent to a server by the site, and there is no sign-in or cloud sync.

The prompt examples are written examples, not live AI responses. If you paste project material into an external AI service, that service's own privacy and retention settings apply. Do not paste secrets, private keys, passwords, or confidential material into the included prompts.

## Content and distribution

The creator kit documents are original project templates and the wallpaper files are original artwork made for this pack. Check the exact terms of any third-party material before redistributing a modified copy. `docs/REPO_SCAN.md` is source-repository material and is intentionally excluded from public gift archives.

This repository does not currently declare a general open-source license. Ask before treating the whole repository as reusable code or artwork; the free downloads are the intended recipient-facing gift.

## Quality checks

The validation script checks required files, prompt counts and fields, skill metadata, manifest JSON, local source links, archive integrity, archive link paths, and exclusion of the private repository scan. See [`docs/TESTING.md`](docs/TESTING.md) for the manual release checklist and known boundaries.

Made for small beginnings. Free to download and keep.
