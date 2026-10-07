# Nexus Luna Toolkit

A **local-first beginner toolkit** built as a fan present from recurring ideas across the Pierreg99 repository collection.

The project is deliberately simple to run — plain HTML, CSS and JavaScript — but the experience is structured like a compact product dashboard rather than a loose demo page.

## What changed in the full overhaul

- Rebuilt information architecture with a **dashboard, launcher and focused tool sections**.
- Added **global tool search** with `Ctrl/Cmd + K` quick focus.
- Added local **usage stats**, project progress and board status in the dashboard.
- Upgraded the Prompt Builder into **Prompt Studio** with four presets, draft persistence and a structure meter.
- Expanded the terminal helper with **command search + category filtering**.
- Added persistent local drafts for the mail and prompt tools.
- Added a dedicated **JSON validation** action.
- Preserved and polished the local Mini Kanban, Project Path and Luna Missions.
- Added **backup export/import** for local browser data.
- Added a minimal **service worker** and installable web app manifest for offline-friendly use.
- Reworked the complete visual system: responsive glass/material surfaces, better hierarchy, stronger focus states, reduced-motion support and mobile layouts.

## Toolkit

1. **Prompt Studio** — turn a rough idea into a structured prompt.
2. **Terminal Guide** — safe beginner commands for Linux/macOS, PowerShell and Git.
3. **Mail Starter** — build a simple German or English starter draft locally.
4. **Mini Kanban** — local task board stored in the browser.
5. **JSON Lab** — validate, format and minify JSON.
6. **Project Path** — seven guided steps toward a useful first repository.
7. **Luna Missions** — small coding and learning challenges.

## Run locally

You can open `index.html` directly for most functionality.

For service-worker/offline support, use a tiny local server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Privacy and storage

The toolkit has no account, backend or analytics dependency. Prompt drafts, mail drafts, tasks, checklist progress, theme and usage counters are stored in `localStorage`.

The **Local Data Center** can export these settings as JSON and import them again later.

## Technical shape

- Plain HTML5
- Modern CSS with responsive layouts and reduced-motion handling
- Vanilla JavaScript
- LocalStorage persistence
- Minimal Service Worker caching
- Web App Manifest
- No runtime package dependencies

## Inspiration

The initial account-wide scan covered **161 owned repositories** and identified recurring themes around AI, developer tooling, learning documentation, productivity, media and plugins. This repository turns several of those patterns into small beginner-friendly tools rather than copying full projects.

See [`docs/REPO_SCAN.md`](docs/REPO_SCAN.md) for the original selection notes and inventory.

---

Made as a fan present for experimenting, learning and starting small.
