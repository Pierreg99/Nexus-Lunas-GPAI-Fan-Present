<p align="center">
  <img src="assets/luna-pack-hero.png" alt="A moonlit, celestial creative landscape with luminous idea panels" width="100%">
</p>

<h1 align="center">Luna's First Project Pack</h1>

<p align="center">
  <strong>A quiet place to turn a small idea into a real first step.</strong><br>
  Seven local tools, 20 worked prompts, an editable project, and a creator kit—made to open, keep, and make your own.
</p>

<p align="center">
  <a href="downloads/luna-first-project-pack.zip"><strong>Download the complete pack</strong></a>
  · <a href="docs/START-HERE.md">Start in one minute</a>
  · <a href="starter-project/index.html">Open Luna Launchpad</a>
  · <a href="freebie-creator-kit/README.md">Explore the Creator Kit</a>
</p>

> **Local-first by default.** No account, subscription, API key, analytics, or required service. The site works in a browser and the files remain yours to keep.

## Choose your first path

| I need… | Start here | What happens next |
| --- | --- | --- |
| A little momentum | Open [`index.html`](index.html) | Use a practical helper for prompts, tasks, e-mail, JSON, or project planning. |
| A project I can understand | Open [Luna Launchpad](starter-project/index.html) | Add a goal, make one safe change, and follow a five-step walkthrough. |
| A better freebie of my own | Open the [`Freebie Creator Kit`](freebie-creator-kit/README.md) | Shape one honest, useful resource with prompts, agent roles, skills, rules, and a release plan. |

## A small constellation of useful things

| Make a next step | Learn by touching the code | Give something thoughtful |
| --- | --- | --- |
| **7 browser-local tools** for prompts, terminal basics, e-mail, a mini Kanban, JSON, a checklist, and tiny missions. | **Luna Launchpad** is a complete HTML/CSS/JavaScript goal tracker with source, walkthrough, and manual checks. | **The Creator Kit** includes eight original guides, four bounded roles, four portable skills, profiles, rules, a plan, and a roadmap. |
| **20 prompts** across learning, coding, planning, and troubleshooting—with hand-written illustrative examples. | **Three themes**, an optional local thank-you note, and desktop/phone wallpapers make the pack feel like a gift, not a funnel. | **Everything is deliberately small.** No cloud dependency is required for the core experience. |

## Open it in under a minute

1. Download the complete pack above, extract it, and open `index.html`.
2. Choose one path: try a tool, open Launchpad, or read the Creator Kit.
3. Keep the files. Come back when your next idea needs a first step.

Opening the files directly works in most browsers. If local browser storage behaves differently from expected, serve the folder temporarily:

```sh
python -m http.server 8080
```

Then visit <http://localhost:8080>. No build step is needed to use the gift.

## Pick the download that fits

| Download | Best for | Includes |
| --- | --- | --- |
| [`luna-first-project-pack.zip`](downloads/luna-first-project-pack.zip) | The whole experience | The website, all tools, prompts, Launchpad, Creator Kit, guides, wallpapers, and the two focused ZIPs. |
| [`luna-freebie-creator-kit.zip`](downloads/luna-freebie-creator-kit.zip) | Designing a useful freebie | The eight guides and four `.agents/skills/` workflows, without the website tools. |
| [`luna-launchpad-starter.zip`](downloads/luna-launchpad-starter.zip) | Starting to code | Only the editable goal tracker, README, and walkthrough. |

## Why this pack feels different

- **Small enough to finish.** The first version favors a real, visible outcome over a long list of features.
- **Clear about its limits.** Prompt examples are illustrative, browser data stays local when storage is available, and no outcome is promised that the files cannot deliver.
- **Built to keep.** The core experience does not depend on a login, a remote API, a platform account, or a recurring service.

## Trust, privacy, and artwork

The website stores small pieces of progress in the current browser's `localStorage` when available: theme, Kanban tasks, checklist and walkthrough progress, and the optional supporter name. Launchpad stores its goals locally too. Nothing is sent to a server by the site; there is no sign-in, cloud sync, or analytics.

The prompt examples are written examples, not live AI responses. If you paste material into an external AI service, that service's own privacy and retention settings apply—do not paste passwords, private keys, secrets, or confidential material into the prompts.

The moon wallpapers are original artwork for this pack. The README hero visual is AI-assisted original artwork made for this repository. Check the exact terms of any third-party material before redistributing a modified copy. `docs/REPO_SCAN.md` is source-repository material and is intentionally excluded from every public download.

<details>
<summary><strong>For maintainers: build and validate the source repository</strong></summary>

<br>

The recipient ZIPs are already built and do not require Node.js. From a repository clone, Node.js 18+ and `zip` are needed only to rebuild the archives:

```sh
npm run build   # regenerate the three deterministic ZIP files and docs/PROMPTS.md
npm test        # syntax, content, source-link, and archive checks
```

No `npm install` is required. The main source locations are:

```text
index.html / styles.css / app.js    The standalone gift website
data/prompts.js                     Source for the 20 prompt cards
freebie-creator-kit/                Creator-kit source documents
.agents/skills/                     Four portable Codex-compatible skill files
starter-project/                    Editable Launchpad source and walkthrough
assets/                             Moon artwork, wallpapers, and README hero visual
scripts/                            Reproducible packaging and repository checks
downloads/                          Tracked recipient-facing ZIP artifacts
```

[`docs/TESTING.md`](docs/TESTING.md) records the manual release checklist and the limits of the automated checks. This repository does not currently declare a general open-source license; ask before treating the entire source or artwork collection as reusable.
</details>

<p align="center"><em>Small beginnings, infinite possibilities.</em></p>
