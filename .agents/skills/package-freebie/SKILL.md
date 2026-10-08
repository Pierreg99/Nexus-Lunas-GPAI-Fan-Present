---
name: package-freebie
description: Safely assemble a reviewed freebie into a predictable archive, extract it in isolation, and verify its manifest and recipient entry path. Use only after draft review.
---

# Package and verify a freebie

Use this workflow when reviewed deliverables need a shareable ZIP or other explicit bundle. Read the approved brief, the creator rules (`freebie-creator-kit/RULES.md` in the full pack, or `RULES.md` inside the standalone creator kit), the reviewer findings, and the target audience's first-use instructions.

## Define the package boundary

1. Confirm the exact output archive name, staging inputs, destination, and a human-approved allow-list of files. If the delivery channel or included personal data is unclear, stop and ask.
2. Inventory the intended files. Include only recipient-facing assets, required source/attribution/usage notes, and requested editable files.
3. Explicitly exclude secrets, `.env*`, credentials, private repository notes, caches, build debris, logs, browser data, unrelated source, and files outside the allow-list. Never expand the package to an entire repository by default.
4. Do not delete originals, replace a release artifact, upload, publish, email, or change access permissions without explicit authorization for that exact action.

## Build and inspect

- Preserve a valid existing archive until its replacement has been successfully produced and checked.
- Use stable relative paths and deterministic file order/timestamps when practical; avoid absolute paths and machine-specific metadata.
- Extract the finished archive into a new, isolated temporary directory—not over the source or an existing user folder.
- Compare the extracted inventory against the allow-list. Check for unexpected files and path traversal, then resolve each relative link and confirm the entry-point instructions work from the extracted location.
- Run the brief's acceptance checks against the extracted copy. Do not test only the source tree.

## Report and hand off

Provide archive path and size, file inventory, checks and results, exclusions, and unresolved issues. State any check that was not run. Ask the human to decide whether to share it. Packaging is not publication, permission to distribute third-party content, or proof of universal compatibility.
