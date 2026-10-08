import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const checks = [];
const creatorDocuments = [
  "README.md", "PROMPTS.md", "AGENT-PROFILES.md", "SKILLS.md",
  "RULES.md", "PROFILES.md", "PLAN.md", "ROADMAP.md",
];
const skillNames = ["scope-freebie", "build-freebie", "review-freebie", "package-freebie"];
const skillFiles = skillNames.map((name) => `.agents/skills/${name}/SKILL.md`);
const archives = [
  { file: "downloads/luna-first-project-pack.zip", prefix: "luna-first-project-pack" },
  { file: "downloads/luna-freebie-creator-kit.zip", prefix: "luna-freebie-creator-kit" },
  { file: "downloads/luna-launchpad-starter.zip", prefix: "luna-launchpad-starter" },
];

function read(relative) {
  return readFileSync(path.join(root, relative), "utf8");
}

function exists(relative) {
  return existsSync(path.join(root, relative));
}

function requireFile(relative) {
  if (!exists(relative)) failures.push(`Missing required file: ${relative}`);
}

function record(label) {
  checks.push(label);
}

function isExternal(target) {
  return !target || target.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target);
}

function withoutFragment(target) {
  return target.split(/[?#]/, 1)[0];
}

function checkSourceLinks(relative, expression, label) {
  const file = path.join(root, relative);
  const source = read(relative);
  for (const match of source.matchAll(expression)) {
    const target = withoutFragment(match[1].trim().replace(/^<|>$/g, ""));
    if (isExternal(target)) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!resolved.startsWith(root + path.sep) || !existsSync(resolved)) {
      failures.push(`${label} points to a missing local path: ${relative} -> ${match[1]}`);
    }
  }
}

function checkArchive(archive) {
  if (!exists(archive.file)) {
    failures.push(`Missing built archive: ${archive.file}`);
    return;
  }
  try {
    execFileSync("unzip", ["-t", path.join(root, archive.file)], { stdio: "ignore" });
  } catch (error) {
    failures.push(`Archive integrity check failed: ${archive.file}`);
    return;
  }
  const entries = execFileSync("unzip", ["-Z1", path.join(root, archive.file)], { encoding: "utf8" })
    .trim().split("\n").filter(Boolean);
  const members = new Set(entries);
  for (const entry of entries) {
    if (entry.startsWith("/") || entry.split("/").includes("..")) {
      failures.push(`Unsafe archive path in ${archive.file}: ${entry}`);
    }
  }
  const expected = [`${archive.prefix}/README.md`];
  if (archive.prefix !== "luna-freebie-creator-kit") expected.push(`${archive.prefix}/index.html`);
  if (archive.prefix === "luna-first-project-pack") {
    expected.push(`${archive.prefix}/freebie-creator-kit/README.md`, `${archive.prefix}/.agents/skills/scope-freebie/SKILL.md`);
  }
  if (archive.prefix === "luna-freebie-creator-kit") {
    expected.push(`${archive.prefix}/RULES.md`, `${archive.prefix}/.agents/skills/package-freebie/SKILL.md`);
  }
  if (archive.prefix === "luna-launchpad-starter") {
    expected.push(`${archive.prefix}/app.js`, `${archive.prefix}/WALKTHROUGH.md`);
  }
  expected.forEach((entry) => {
    if (!members.has(entry)) failures.push(`Missing expected archive entry: ${archive.file} -> ${entry}`);
  });
  if (entries.some((entry) => entry.endsWith("docs/REPO_SCAN.md") || entry.endsWith("REPO_SCAN.md"))) {
    failures.push(`Private repository scan leaked into archive: ${archive.file}`);
  }

  for (const entry of entries.filter((item) => item.endsWith(".md"))) {
    const markdown = execFileSync("unzip", ["-p", path.join(root, archive.file), entry], { encoding: "utf8" });
    for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = withoutFragment(match[1].trim().replace(/^<|>$/g, ""));
      if (isExternal(target)) continue;
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(entry), target));
      if (!members.has(resolved)) failures.push(`Archive Markdown link is missing: ${archive.file} -> ${entry} -> ${match[1]}`);
    }
  }
  record(`${archive.file} integrity, manifest, links, and exclusion checks`);
}

[
  "README.md", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "data/prompts.js", "docs/START-HERE.md", "docs/PROMPTS.md", "docs/TESTING.md",
  ...creatorDocuments.map((name) => `freebie-creator-kit/${name}`),
  ...skillFiles,
  "starter-project/index.html", "starter-project/styles.css", "starter-project/app.js",
  "starter-project/README.md", "starter-project/WALKTHROUGH.md",
].forEach(requireFile);

const promptContext = { window: {} };
vm.runInNewContext(read("data/prompts.js"), promptContext, { timeout: 1000 });
const prompts = promptContext.window.LUNA_PROMPTS;
if (!Array.isArray(prompts) || prompts.length !== 20) failures.push("Prompt source must contain exactly 20 prompts.");
else {
  const ids = new Set(prompts.map((prompt) => prompt.id));
  if (ids.size !== prompts.length) failures.push("Prompt source contains duplicate IDs.");
  ["Learning", "Coding", "Planning", "Troubleshooting"].forEach((category) => {
    if (prompts.filter((prompt) => prompt.category === category).length !== 5) failures.push(`Prompt category is not five items: ${category}`);
  });
  const promptFields = ["id", "category", "title", "description", "prompt", "input", "example"];
  prompts.forEach((prompt) => promptFields.forEach((field) => {
    if (typeof prompt[field] !== "string" || !prompt[field].trim()) failures.push(`Prompt ${prompt.id || "unknown"} has an empty ${field}.`);
  }));
  const promptDoc = read("docs/PROMPTS.md");
  prompts.forEach((prompt) => {
    if (!promptDoc.includes(`### ${prompt.title}`)) failures.push(`Generated prompt document is missing: ${prompt.title}`);
  });
  record("20 prompts, four five-item categories, required fields, and generated headings");
}

const manifest = JSON.parse(read("manifest.webmanifest"));
if (!manifest.name || !manifest.short_name || !manifest.start_url || !Array.isArray(manifest.icons) || !manifest.icons.length) {
  failures.push("Web manifest is missing a name, start URL, or icon.");
}
record("web manifest structure");

skillFiles.forEach((relative, index) => {
  const source = read(relative);
  if (!source.startsWith("---\n") || !source.includes(`name: ${skillNames[index]}\n`) || !/^description: .+$/m.test(source)) {
    failures.push(`Skill metadata is incomplete: ${relative}`);
  }
});
record("four skill metadata headers");

checkSourceLinks("index.html", /\b(?:href|src)="([^"]+)"/g, "Website");
checkSourceLinks("README.md", /\[[^\]]+\]\(([^)]+)\)/g, "README");
checkSourceLinks("docs/START-HERE.md", /\[[^\]]+\]\(([^)]+)\)/g, "Quick start");
checkSourceLinks("freebie-creator-kit/README.md", /\[[^\]]+\]\(([^)]+)\)/g, "Creator kit README");
record("local links in source website and primary guides");

if (/both downloads/i.test(read("docs/START-HERE.md"))) failures.push("Quick-start guide still refers to only two downloads.");
if (!read("index.html").includes("downloads/luna-freebie-creator-kit.zip")) failures.push("Website is missing the standalone creator-kit download.");
if (read("docs/REPO_SCAN.md").length === 0) failures.push("Repository scan note is unexpectedly empty.");
record("content consistency and private-note boundary");

archives.forEach(checkArchive);

if (failures.length) {
  console.error(`Repository check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Repository check passed (${checks.length} checks).`);
  checks.forEach((check) => console.log(`✓ ${check}`));
}
