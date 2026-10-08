# Reusable freebie-making skills

This kit includes four Codex-compatible `SKILL.md` workflows. In this source repository they live in `.agents/skills/`. The standalone creator-kit ZIP places the same `.agents/skills/` tree at its root; copy that folder into a project root where you use Codex. For another AI tool, paste a skill's steps into a chat or adapt them to that tool's format.

Each skill is intentionally narrow. A skill can prepare work or inspect it; the human keeps decisions about brief approval, third-party rights, release, and external actions.

## Choose the workflow

| Skill | Invoke when… | Main result |
| --- | --- | --- |
| `scope-freebie` | An idea needs a clear recipient, modest promise, and version-one boundary. | Draft brief, assumptions, risks, and acceptance checks. |
| `build-freebie` | A human-approved brief is ready to become a real resource. | Small complete draft and file/test manifest. |
| `review-freebie` | A draft and its source files are ready for independent review. | Evidence-based release findings, not an assumed approval. |
| `package-freebie` | Reviewed files are ready to bundle and verify. | Extracted archive with checked contents and working entry path. |

Recommended sequence:

```text
scope-freebie → human approves brief → build-freebie → review-freebie → fix blockers → package-freebie → human decides whether to share
```

If a task does not need software packaging, skip `package-freebie`. If the idea is a one-page checklist, keep the build proportionate. For all four workflows, supply relevant parts of `freebie-creator-kit/RULES.md`, the selected audience profile, and the approved brief.
