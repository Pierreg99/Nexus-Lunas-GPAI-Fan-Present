# Project memory

## User workflow

The user requested the complete Luna First Project Pack, autonomous upgrades, and a separate Git commit after every edited file. Keep that workflow for further work on this project. Preserve unrelated changes. Commit generated files individually when their content changes.

## Current checkpoint — 2026-10-08

The pack is complete on `feat/luna-first-project-pack`: seven local tools, 20 prompts with worked examples, the editable Luna Launchpad goal tracker, a five-step walkthrough, three persisted themes, desktop and phone wallpapers in PNG and SVG, and a personalized downloadable thank-you. The feature branch has been pushed to GitHub at the user's request. Website deployment has not been performed.

This upgrade adds a linked Freebie Creator Kit: eight Markdown guides covering original prompts, agent-role profiles, reusable skills, rules, recipient profiles, a five-session plan, and a 90-day roadmap. Its four Codex-compatible skills live in `.agents/skills/{scope-freebie,build-freebie,review-freebie,package-freebie}/SKILL.md`. Keep the paths portable in both the full-pack and standalone archives.

The repository refinement adds a maintainer-ready README, `package.json` scripts, a dependency-free repository checker, a testing/release guide, a clearer website start path, improved landmarks/no-JavaScript messaging, print styles, starter-project progress semantics, and repository hygiene ignores. The three tracked ZIPs are regenerated after source or guide changes.

The visual refresh gives the README and website an editorial, moonlit art direction. `assets/luna-pack-hero.png` is the source hero visual and `assets/luna-pack-hero.webp` is the optimized web delivery version. They are used in the main hero and Creator Kit panel, included in the full-pack ZIP, and described transparently as AI-assisted original artwork in the README.

## Sources and builds

- `index.html`, `styles.css`, and `app.js` are the main application. Keep it runnable without a build, account, backend, or external runtime calls.
- `data/prompts.js` is the single authoring source for the 20 prompts: five each for Learning, Coding, Planning, and Troubleshooting. `docs/PROMPTS.md` is generated from it.
- `starter-project/` contains the complete three-file project, README, and walkthrough.
- `assets/` contains the original wallpaper artwork, ready-to-use PNG exports, and the README/website hero image in PNG and WebP.
- `docs/A-NOTE-FROM-LUNA.txt` is the plain-text keepsake; the app can personalize its own local copy.
- `freebie-creator-kit/` is the source of truth for the creator-kit guides. `.agents/skills/` contains the Codex-compatible workflow files; include these in both the standalone creator-kit ZIP and the full pack so the skills remain discoverable at the extracted project root.
- Run `node scripts/build-pack.mjs` after edits to bundled files. It requires Node.js and `zip`, validates the prompt source and skill front matter, and writes the tracked full-pack, creator-kit, and starter-project ZIPs. Fixed timestamps and file order make the output reproducible. It preserves a previous archive until a replacement has been successfully built.
- `npm run build` is the archive/document build alias. `npm test` runs syntax checks plus `scripts/check-repository.mjs`, which validates required files, content counts, source/archive links, ZIP integrity, safe paths, and the private-file boundary.
- `docs/TESTING.md` is the manual release checklist. It records the browser, keyboard, mobile, storage-failure, starter-project, and archive checks expected before sharing.
- The extracted complete pack offers a quick-start guide in place of downloading itself again. Its separate starter-project ZIP remains included and downloadable.
- The packer rewrites the full-pack download CTA, download-table row, and first quick-start instruction inside the extracted README. Keep these rewrites in sync if the root README changes its recipient-facing wording.
- Keep `docs/REPO_SCAN.md` out of the public gift downloads. It is a pre-existing document containing private repository inventory. It remains in the source repository, but the website no longer links to it.

## Validation recorded

JavaScript syntax checks and Git whitespace checks passed. Browser checks passed for all seven tools, all prompt categories and examples, copying, safe literal task text, task movement and keyboard focus, cancelled board resets, stored checklist and walkthrough progress, saved themes and names, bilingual e-mails, JSON errors, missions, and personalized note downloads.

Luna Launchpad passed goal addition/completion/removal, reload persistence, invalid input, and literal HTML-text checks. Corrupted and blocked storage do not stop either app. The 375px layout has no horizontal overflow. No JavaScript errors or external runtime requests were observed.

Both extracted ZIPs were checked in a fresh browser; every local link resolves, the wallpapers have their expected dimensions, and the private inventory is excluded. Rebuilding produces byte-identical ZIPs. Workspace browser policy blocks `file://` navigation, so browser checks used local HTTP servers.

After the creator-kit integration, `node --check`, `git diff --check`, both updated ZIP integrity tests, and source/archive local-link checks passed. Rebuilding all three archives produced identical SHA-256 hashes. The new section and downloads were checked structurally; a fresh interactive browser pass for this addition was not run in the current environment.

After the repository refinement, `npm test` passed with all eight automated checks, the local HTTP server returned the page and its primary assets with HTTP 200, and the extracted archive link maps remained clean. A headless Chromium process loaded the revised resources but did not terminate cleanly for DOM extraction in this environment, so interactive browser assertions for the new path panel remain a documented follow-up rather than a claimed pass.

After the visual refresh, `npm run build` and `npm test` again passed all eight automated checks. Headless Chromium rendered the refreshed page over local HTTP at 1440px and 390px wide with the hero artwork loading and no horizontal overflow. The rebuilt complete ZIP was inspected for both hero formats and its rewritten extracted README links.
