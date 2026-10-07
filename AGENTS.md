# Project memory

## User workflow

The user requested the complete Luna First Project Pack, autonomous upgrades, and a separate Git commit after every edited file. Keep that workflow for further work on this project. Preserve unrelated changes. Commit generated files individually when their content changes.

## Current checkpoint — 2026-10-07

The pack is complete on `feat/luna-first-project-pack`: seven local tools, 20 prompts with worked examples, the editable Luna Launchpad goal tracker, a five-step walkthrough, three persisted themes, desktop and phone wallpapers in PNG and SVG, and a personalized downloadable thank-you. The feature branch has been pushed to GitHub at the user's request. Website deployment has not been performed.

## Sources and builds

- `index.html`, `styles.css`, and `app.js` are the main application. Keep it runnable without a build, account, backend, or external runtime calls.
- `data/prompts.js` is the single authoring source for the 20 prompts: five each for Learning, Coding, Planning, and Troubleshooting. `docs/PROMPTS.md` is generated from it.
- `starter-project/` contains the complete three-file project, README, and walkthrough.
- `assets/` contains the original wallpaper artwork and ready-to-use PNG exports.
- `docs/A-NOTE-FROM-LUNA.txt` is the plain-text keepsake; the app can personalize its own local copy.
- Run `node scripts/build-pack.mjs` after edits to bundled files. It requires Node.js and `zip`, writes both tracked ZIP downloads, and uses fixed timestamps and file order for reproducible output. It preserves a previous archive until a replacement is successfully built.
- The extracted complete pack offers a quick-start guide in place of downloading itself again. Its separate starter-project ZIP remains included and downloadable.
- Keep `docs/REPO_SCAN.md` out of the public gift downloads. It is a pre-existing document containing private repository inventory. It remains in the source repository, but the website no longer links to it.

## Validation recorded

JavaScript syntax checks and Git whitespace checks passed. Browser checks passed for all seven tools, all prompt categories and examples, copying, safe literal task text, task movement and keyboard focus, cancelled board resets, stored checklist and walkthrough progress, saved themes and names, bilingual e-mails, JSON errors, missions, and personalized note downloads.

Luna Launchpad passed goal addition/completion/removal, reload persistence, invalid input, and literal HTML-text checks. Corrupted and blocked storage do not stop either app. The 375px layout has no horizontal overflow. No JavaScript errors or external runtime requests were observed.

Both extracted ZIPs were checked in a fresh browser; every local link resolves, the wallpapers have their expected dimensions, and the private inventory is excluded. Rebuilding produces byte-identical ZIPs. Workspace browser policy blocks `file://` navigation, so browser checks used local HTTP servers.
