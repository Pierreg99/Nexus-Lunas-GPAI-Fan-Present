# Project memory

## User workflow

The user requested the complete Luna First Project Pack, autonomous upgrades, and a separate Git commit after every edited file. Keep that workflow for further work on this project. Preserve unrelated changes. Commit generated files individually when their content changes.

## Current checkpoint — 2026-10-08

The pack is complete on `feat/luna-first-project-pack`: seven local tools, 20 prompts with worked examples, the editable Luna Launchpad goal tracker, a five-step walkthrough, three persisted themes, desktop and phone wallpapers in PNG and SVG, and a personalized downloadable thank-you. The feature branch has been pushed to GitHub at the user's request. Website deployment has not been performed.

This upgrade adds a linked Freebie Creator Kit: eight Markdown guides covering original prompts, agent-role profiles, reusable skills, rules, recipient profiles, a five-session plan, and a 90-day roadmap. Its four Codex-compatible skills live in `.agents/skills/{scope-freebie,build-freebie,review-freebie,package-freebie}/SKILL.md`. Keep the paths portable in both the full-pack and standalone archives.

## Sources and builds

- `index.html`, `styles.css`, and `app.js` are the main application. Keep it runnable without a build, account, backend, or external runtime calls.
- `data/prompts.js` is the single authoring source for the 20 prompts: five each for Learning, Coding, Planning, and Troubleshooting. `docs/PROMPTS.md` is generated from it.
- `starter-project/` contains the complete three-file project, README, and walkthrough.
- `assets/` contains the original wallpaper artwork and ready-to-use PNG exports.
- `docs/A-NOTE-FROM-LUNA.txt` is the plain-text keepsake; the app can personalize its own local copy.
- `freebie-creator-kit/` is the source of truth for the creator-kit guides. `.agents/skills/` contains the Codex-compatible workflow files; include these in both the standalone creator-kit ZIP and the full pack so the skills remain discoverable at the extracted project root.
- Run `node scripts/build-pack.mjs` after edits to bundled files. It requires Node.js and `zip`, validates the prompt source and skill front matter, and writes the tracked full-pack, creator-kit, and starter-project ZIPs. Fixed timestamps and file order make the output reproducible. It preserves a previous archive until a replacement has been successfully built.
- The extracted complete pack offers a quick-start guide in place of downloading itself again. Its separate starter-project ZIP remains included and downloadable.
- Keep `docs/REPO_SCAN.md` out of the public gift downloads. It is a pre-existing document containing private repository inventory. It remains in the source repository, but the website no longer links to it.

## Validation recorded

JavaScript syntax checks and Git whitespace checks passed. Browser checks passed for all seven tools, all prompt categories and examples, copying, safe literal task text, task movement and keyboard focus, cancelled board resets, stored checklist and walkthrough progress, saved themes and names, bilingual e-mails, JSON errors, missions, and personalized note downloads.

Luna Launchpad passed goal addition/completion/removal, reload persistence, invalid input, and literal HTML-text checks. Corrupted and blocked storage do not stop either app. The 375px layout has no horizontal overflow. No JavaScript errors or external runtime requests were observed.

Both extracted ZIPs were checked in a fresh browser; every local link resolves, the wallpapers have their expected dimensions, and the private inventory is excluded. Rebuilding produces byte-identical ZIPs. Workspace browser policy blocks `file://` navigation, so browser checks used local HTTP servers.

After the creator-kit integration, `node --check`, `git diff --check`, both updated ZIP integrity tests, and source/archive local-link checks passed. Rebuilding all three archives produced identical SHA-256 hashes. The new section and downloads were checked structurally; a fresh interactive browser pass for this addition was not run in the current environment.
