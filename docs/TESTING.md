# Testing and release checklist

This repository is deliberately dependency-free. The checks below are split into fast automated checks, archive checks, and a small browser pass. They test the files a recipient actually receives without pretending that a script proves universal accessibility or browser compatibility.

## Fast local checks

From the repository root:

```sh
npm test
```

`npm test` runs:

- JavaScript syntax checks for the website, starter project, build script, and repository checker.
- Required-file, prompt-count, prompt-field, generated-heading, skill-metadata, manifest, and source-link checks.
- ZIP integrity checks for all three tracked archives.
- Archive manifest checks, local Markdown-link checks, path-safety checks, and exclusion of `docs/REPO_SCAN.md`.

To regenerate the artifacts before checking them:

```sh
npm run build
npm test
```

The build is deterministic. If a source document changes, the relevant ZIP hash should change; a second build without source changes should produce the same hashes.

## Browser smoke test

Run a local server for a consistent origin:

```sh
python -m http.server 8080
```

Open <http://localhost:8080> and check:

### First use and navigation

- [ ] The hero download starts the complete pack; the standalone creator-kit and starter-project links work too.
- [ ] The skip link appears when focused, and the mobile jump links reach each section.
- [ ] The creator-kit preview, quick-start guide, prompt document, walkthrough, and wallpapers open from the source website.
- [ ] With JavaScript disabled, the page still exposes the main title, gift description, and a link to the prompt document.

### Prompt library

- [ ] Twenty prompt cards render.
- [ ] Each category filter shows five prompts; search updates the count and empty state.
- [ ] A prompt can be expanded and copied; entered text is displayed as text.

### Local tools

- [ ] Prompt Builder presets fill the fields; building and copying work.
- [ ] Terminal Quickstart filters Linux/macOS, PowerShell, and Git commands; command copying works.
- [ ] E-mail Starter produces English and German drafts without an external request.
- [ ] Mini Kanban adds, moves, removes, persists, and safely cancels a reset; literal HTML in a task remains text.
- [ ] JSON Helper reports invalid JSON and formats/minifies valid JSON.
- [ ] Checklist progress, guide progress, theme choice, supporter name, and personalized note download work locally.
- [ ] Luna Mini Missions changes to another mission.

### Responsive and resilience checks

- [ ] At 375px wide, no horizontal scrollbar appears and controls remain reachable.
- [ ] Keyboard-only navigation reaches inputs, filters, buttons, expandable prompts, and reset controls in a sensible order.
- [ ] A reload preserves local data when storage is available.
- [ ] Blocking or corrupting local storage keeps the tools usable and shows the storage notice.
- [ ] `prefers-reduced-motion: reduce` removes decorative motion.

## Starter-project smoke test

Open `starter-project/index.html` or the extracted starter ZIP and check:

- [ ] Add a goal with the button and with Enter; blank or spaces-only input is rejected.
- [ ] Complete and remove goals; focus remains useful after a removal.
- [ ] Reload with storage available; goals and completion state return.
- [ ] `<b>Read</b>` appears literally, not as HTML.
- [ ] Long goal text wraps at a narrow width; Tab and Space can operate the controls.

## Boundaries

These checks do not replace testing with real recipients, a screen reader, every browser, or every operating system. They do not create a license for the source repository or validate third-party rights. Record any unrun check in the release note and keep the public promise narrower than the evidence.
