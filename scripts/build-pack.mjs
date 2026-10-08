import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloads = path.join(root, "downloads");
const temporary = mkdtempSync(path.join(os.tmpdir(), "luna-first-pack-"));
const promptsContext = { window: {} };
const categories = ["Learning", "Coding", "Planning", "Troubleshooting"];
const creatorKitDocuments = [
  "README.md", "PROMPTS.md", "AGENT-PROFILES.md", "SKILLS.md",
  "RULES.md", "PROFILES.md", "PLAN.md", "ROADMAP.md",
];
const skillNames = ["scope-freebie", "build-freebie", "review-freebie", "package-freebie"];
const skillFiles = skillNames.map((name) => `.agents/skills/${name}/SKILL.md`);

function writeArchive(folder, filename) {
  const entries = [];
  const timestamp = new Date("2000-01-01T00:00:00Z");
  function collect(relative) {
    const children = readdirSync(path.join(temporary, relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en"));
    for (const child of children) {
      const name = path.posix.join(relative, child.name);
      if (child.isDirectory()) collect(name);
      else {
        const file = path.join(temporary, name);
        chmodSync(file, 0o644);
        utimesSync(file, timestamp, timestamp);
        entries.push(name);
      }
    }
  }
  collect(folder);
  const stagedArchive = path.join(temporary, filename);
  execFileSync("zip", ["-q", "-X", stagedArchive, ...entries], { cwd: temporary, env: { ...process.env, TZ: "UTC" } });
  const destination = path.join(downloads, filename);
  copyFileSync(stagedArchive, destination);
  chmodSync(destination, 0o644);
  return destination;
}

try {
  const promptsSource = readFileSync(path.join(root, "data/prompts.js"), "utf8");
  vm.runInNewContext(promptsSource, promptsContext, { timeout: 1000 });
  const prompts = promptsContext.window.LUNA_PROMPTS;
  if (!Array.isArray(prompts) || prompts.length !== 20) {
    throw new Error("The prompt library must contain exactly 20 prompts.");
  }
  if (new Set(prompts.map((prompt) => prompt.id)).size !== 20 || !categories.every((category) => prompts.filter((prompt) => prompt.category === category).length === 5)) {
    throw new Error("Prompts need unique IDs and five entries in each category.");
  }
  if (!prompts.every((prompt) => ["id", "title", "description", "prompt", "input", "example"].every((field) => typeof prompt[field] === "string" && prompt[field].trim()))) {
    throw new Error("Every prompt needs its content and a worked example.");
  }
  for (const [index, relative] of skillFiles.entries()) {
    const skill = readFileSync(path.join(root, relative), "utf8");
    if (!skill.startsWith("---\n") || !skill.includes(`name: ${skillNames[index]}\n`) || !skill.includes("description:")) {
      throw new Error(`The ${skillNames[index]} skill needs valid name and description front matter.`);
    }
  }

  const promptMarkdown = [
    "# Twenty prompts to make a start",
    "",
    "Each prompt is a starting point, not a magic answer. Replace the square-bracket instructions with your own details before using it. Examples below are illustrative and were not generated live.",
    "",
  ];
  for (const category of categories) {
    promptMarkdown.push(`## ${category}`, "");
    for (const prompt of prompts.filter((item) => item.category === category)) {
      promptMarkdown.push(
        `### ${prompt.title}`,
        "",
        prompt.description,
        "",
        "**Prompt**",
        "",
        "```text",
        prompt.prompt,
        "```",
        "",
        `**Example input:** ${prompt.input}`,
        "",
        `**Illustrative example:** ${prompt.example}`,
        "",
      );
    }
  }
  const promptDoc = path.join(root, "docs/PROMPTS.md");
  mkdirSync(path.dirname(promptDoc), { recursive: true });
  writeFileSync(promptDoc, promptMarkdown.join("\n"), "utf8");

  const creatorFolder = "luna-freebie-creator-kit";
  const creatorStage = path.join(temporary, creatorFolder);
  mkdirSync(creatorStage, { recursive: true });
  for (const relative of creatorKitDocuments) {
    copyFileSync(path.join(root, "freebie-creator-kit", relative), path.join(creatorStage, relative));
  }
  for (const relative of skillFiles) {
    const destination = path.join(creatorStage, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(root, relative), destination);
  }

  const starterFolder = "luna-launchpad-starter";
  const starterStage = path.join(temporary, starterFolder);
  mkdirSync(starterStage, { recursive: true });
  for (const name of ["index.html", "styles.css", "app.js", "README.md", "WALKTHROUGH.md"]) {
    copyFileSync(path.join(root, "starter-project", name), path.join(starterStage, name));
  }

  mkdirSync(downloads, { recursive: true });
  const creatorZip = writeArchive(creatorFolder, `${creatorFolder}.zip`);
  const starterZip = writeArchive(starterFolder, `${starterFolder}.zip`);

  const packFolder = "luna-first-project-pack";
  const packStage = path.join(temporary, packFolder);
  const packFiles = [
    "README.md", "index.html", "styles.css", "app.js", "manifest.webmanifest",
    "data/prompts.js", "docs/START-HERE.md", "docs/PROMPTS.md", "docs/TESTING.md", "docs/A-NOTE-FROM-LUNA.txt",
    ...creatorKitDocuments.map((name) => `freebie-creator-kit/${name}`),
    ...skillFiles,
    "assets/moon.svg", "assets/luna-pack-hero.png", "assets/luna-pack-hero.webp",
    "assets/luna-wallpaper-desktop.svg", "assets/luna-wallpaper-phone.svg",
    "assets/luna-wallpaper-desktop.png", "assets/luna-wallpaper-phone.png",
    "starter-project/index.html", "starter-project/styles.css", "starter-project/app.js",
    "starter-project/README.md", "starter-project/WALKTHROUGH.md",
  ];
  for (const name of packFiles) {
    const destination = path.join(packStage, name);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(root, name), destination);
  }

  // The complete archive is already on the visitor's device, so its embedded
  // copy of the page offers the quick-start guide in place of downloading
  // the archive again. Keep the separate starter-project download working.
  const bundledIndex = path.join(packStage, "index.html");
  const page = readFileSync(bundledIndex, "utf8")
    .replace('href="downloads/luna-first-project-pack.zip" download>Download the whole pack ↓', 'href="docs/START-HERE.md">Read your quick start →')
    .replace('href="downloads/luna-first-project-pack.zip" download>Take the whole pack ↓', 'href="docs/START-HERE.md">Read the quick start →');
  writeFileSync(bundledIndex, page, "utf8");

  const bundledReadme = path.join(packStage, "README.md");
  const standaloneReadme = readFileSync(bundledReadme, "utf8")
    .replace(
      '<a href="downloads/luna-first-project-pack.zip"><strong>Download the complete pack</strong></a>',
      '<a href="docs/START-HERE.md"><strong>Open the quick start</strong></a>'
    )
    .replace(
      "| [`luna-first-project-pack.zip`](downloads/luna-first-project-pack.zip) | The whole experience | The website, all tools, prompts, Launchpad, Creator Kit, guides, wallpapers, and the two focused ZIPs. |",
      "| This extracted folder | The whole experience | The website, all tools, prompts, Launchpad, Creator Kit, guides, wallpapers, and the two focused ZIPs. |"
    );
  writeFileSync(bundledReadme, standaloneReadme, "utf8");

  const packagedStarterZip = path.join(packStage, "downloads/luna-launchpad-starter.zip");
  mkdirSync(path.dirname(packagedStarterZip), { recursive: true });
  copyFileSync(starterZip, packagedStarterZip);
  const packagedCreatorZip = path.join(packStage, "downloads/luna-freebie-creator-kit.zip");
  copyFileSync(creatorZip, packagedCreatorZip);

  const wholeZip = writeArchive(packFolder, `${packFolder}.zip`);
  console.log(`Built ${path.relative(root, wholeZip)} (${prompts.length} prompts, all seven tools, and the creator kit).`);
  console.log(`Built ${path.relative(root, creatorZip)} (${creatorKitDocuments.length} guides and ${skillFiles.length} Codex-compatible skills).`);
  console.log(`Built ${path.relative(root, starterZip)} (the complete editable starter project).`);
  console.log(`Wrote ${path.relative(root, promptDoc)} from the prompt data source.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
