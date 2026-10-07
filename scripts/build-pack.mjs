import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloads = path.join(root, "downloads");
const temporary = mkdtempSync(path.join(os.tmpdir(), "luna-first-pack-"));
const promptsContext = { window: {} };

try {
  const promptsSource = readFileSync(path.join(root, "data/prompts.js"), "utf8");
  vm.runInNewContext(promptsSource, promptsContext, { timeout: 1000 });
  const prompts = promptsContext.window.LUNA_PROMPTS;
  if (!Array.isArray(prompts) || prompts.length !== 20) {
    throw new Error("The prompt library must contain exactly 20 prompts.");
  }

  const promptMarkdown = [
    "# Twenty prompts to make a start",
    "",
    "Each prompt is a starting point, not a magic answer. Replace the square-bracket instructions with your own details before using it. Examples below are illustrative and were not generated live.",
    "",
  ];
  for (const category of ["Learning", "Coding", "Planning", "Troubleshooting"]) {
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

  const starterFolder = "luna-launchpad-starter";
  const starterStage = path.join(temporary, starterFolder);
  mkdirSync(starterStage, { recursive: true });
  for (const name of ["index.html", "styles.css", "app.js", "README.md", "WALKTHROUGH.md"]) {
    copyFileSync(path.join(root, "starter-project", name), path.join(starterStage, name));
  }

  mkdirSync(downloads, { recursive: true });
  const starterZip = path.join(downloads, `${starterFolder}.zip`);
  if (existsSync(starterZip)) rmSync(starterZip);
  execFileSync("zip", ["-q", "-X", "-r", starterZip, starterFolder], { cwd: temporary });

  const packFolder = "luna-first-project-pack";
  const packStage = path.join(temporary, packFolder);
  const packFiles = [
    "README.md", "index.html", "styles.css", "app.js", "manifest.webmanifest",
    "data/prompts.js", "docs/START-HERE.md", "docs/PROMPTS.md",
    "assets/moon.svg", "assets/luna-wallpaper-desktop.svg", "assets/luna-wallpaper-phone.svg",
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
    .replace('href="downloads/luna-first-project-pack.zip" download>Download the whole pack ↓', 'href="docs/START-HERE.md">Read your quick start ↗')
    .replace('href="downloads/luna-first-project-pack.zip" download>Take the whole pack ↓', 'href="docs/START-HERE.md">Read the quick start ↗');
  writeFileSync(bundledIndex, page, "utf8");

  const packagedStarterZip = path.join(packStage, "downloads/luna-launchpad-starter.zip");
  mkdirSync(path.dirname(packagedStarterZip), { recursive: true });
  copyFileSync(starterZip, packagedStarterZip);

  const wholeZip = path.join(downloads, `${packFolder}.zip`);
  if (existsSync(wholeZip)) rmSync(wholeZip);
  execFileSync("zip", ["-q", "-X", "-r", wholeZip, packFolder], { cwd: temporary });
  console.log(`Built ${path.relative(root, wholeZip)} (${prompts.length} prompts and all seven tools).`);
  console.log(`Built ${path.relative(root, starterZip)} (the complete editable starter project).`);
  console.log(`Wrote ${path.relative(root, promptDoc)} from the prompt data source.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
