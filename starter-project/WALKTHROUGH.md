# Build your first project with Luna

**Project:** Luna Launchpad, a daily goal tracker. **Suggested time:** 30–45 minutes. **You need:** a browser and any text editor. No previous JavaScript project is required.

You have a complete working example. Open it first, then follow this tour to understand and customize it. The numbered comments in `app.js` match the steps below.

## 1. Open it and meet the three files

Open `index.html` and add “Build my first button”. The HTML defines the heading, labelled form, goal list, and progress bar. `styles.css` gives them colors and spacing. `app.js` reacts to your actions.

**Try:** find `<h1>` in `index.html`, replace “One small step.” with your own message, save, and reload. **Done when:** your words appear on the page.

## 2. Follow the data

A goal is a JavaScript object: `{ title: "Read one page", done: false }`. The `goals` array holds all the objects. `loadGoals()` reads saved JSON and checks that each goal has a title and a boolean completion flag. Malformed or unavailable storage falls back without crashing.

**Try:** write a sample array of two goals in the toolkit's JSON Helper and format it. **Done when:** you can explain which goal is complete and which is not.

## 3. Trace one click

The form's `submit` listener prevents a page navigation, trims the input, rejects spaces-only text, adds an object to `goals`, saves, and calls `renderGoals()`. The rendering function creates one list item per goal. It assigns the title with `textContent` so a title never becomes executable HTML.

**Try:** add `<b>Read</b>`. **Done when:** you see the literal angle brackets. Add a second goal with Enter instead of the mouse.

## 4. Understand progress and storage

The checkbox listener changes `goal.done`, saves the array, and calls `updateProgress()`. That function counts complete goals and updates the visible label and the native `<progress>` element. `saveGoals()` uses `JSON.stringify` to turn the array into text for localStorage. If saving fails, the status explains that the goals are only in memory.

**Try:** complete one of two goals and reload. **Done when:** the same checkbox stays checked and the label says “1 of 2 complete”, when browser storage is available. Clearing browser data removes saved goals.

## 5. Make one change and check it

Choose a tiny change: a new heading, a different accent color, or a better empty-state message. In `styles.css`, change the mint color `#c6f4d9` to another readable color. Check the page at phone width, use Tab to reach the form, and use Space to toggle a goal. Confirm long text wraps and buttons remain visible.

**Done when:** you can show your change and all checks in README.md still pass.

## Your next mission: hide completed goals

Work on a copy of the folder. Add a labelled checkbox called “Hide completed goals” to the HTML. Store its state in a separate variable. Have `renderGoals()` skip completed goals only when that checkbox is selected. Keep the progress count based on the entire array, not just visible goals. Do not delete hidden goals.

**Checks:** hiding completed goals does not remove them from storage; switching the filter off shows them again; a remaining visible goal's Remove button removes that goal, not one at a different array index.

## Optional: your first Git commit

In this project folder, run `git init`, then `git status`. Review your files before staging them with `git add index.html styles.css app.js README.md WALKTHROUGH.md`. Run `git diff --cached` to inspect staged changes, then `git commit -m "Build my first Luna Launchpad"`. Git may ask you to configure your author name and email. A local commit does not publish your project online.

Small is enough. A working change you understand is a real first project.
