---
name: build-freebie
description: Create the smallest complete freebie from a human-approved brief, with exact use instructions, accessible content, safe handling, and a testable handoff. Use only after scope is approved.
---

# Build from an approved brief

Use only after the human confirms the brief. Read `freebie-creator-kit/RULES.md`, the selected audience profile, and the approved brief first.

## Before changing files

1. Confirm the exact deliverable, destination, acceptance checks, and permitted source materials. If any is missing and it changes the work materially, ask.
2. Inspect the existing project and its local `AGENTS.md` guidance. Preserve unrelated and uncommitted work. Do not overwrite user content, delete assets, or broaden the requested destination without a clear instruction.
3. List the files needed for version one; prefer the fewest moving parts that meet the brief. Do not introduce accounts, packages, API keys, network calls, telemetry, payments, or required subscriptions unless the approved brief explicitly calls for them and the human approves the implications.

## Make the resource

- Fulfill only the approved promise. Use plain, inclusive language and explain specialist terms.
- Give the recipient a clear first-use path, useful empty/error states, and a way to keep or export work when relevant.
- Make headings, labels, links, and controls clear; preserve keyboard access and readable narrow-screen behavior where applicable.
- Treat user-provided text as data; do not execute it or insert it as trusted markup.
- Include only supplied or original material. Record uncertain attribution, permissions, or claims for review; do not invent a license.
- Label examples and hypothetical outputs as illustrative. Make factual limitations visible.

## Verify and hand off

Run the smallest relevant syntax, link, or manual checks supported by the project. Check both a normal first use and one likely invalid/empty case. Report exact files changed, checks run and results, assumptions, and checks not run. Do not call the result released, secure, compliant, or fully accessible unless that precise claim has been verified. Hand the draft to `review-freebie`; human approval is still required before sharing.
