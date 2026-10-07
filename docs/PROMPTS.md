# Twenty prompts to make a start

Each prompt is a starting point, not a magic answer. Replace the square-bracket instructions with your own details before using it. Examples below are illustrative and were not generated live.

## Learning

### Understand a new topic

Turn an unfamiliar idea into an explanation you can actually use.

**Prompt**

```text
Act as a patient tutor. Explain [topic] to someone who knows [what I already know]. Use plain language, one everyday analogy, and a small worked example. Define new terms. Finish with three practice questions and put the answers in a separate section. If the topic needs prerequisites, name them first.
```

**Example input:** Topic: JavaScript variables. I already know basic HTML.

**Illustrative example:** A variable is a named place to keep a value. Think of a labelled box. In `let score = 0`, the label is score and the value is 0. `score = score + 1` changes it to 1. Practice: What value remains after adding 2? Answer: 3.

### Make a seven-day learning plan

A realistic plan with a small, visible result each day.

**Prompt**

```text
Help me learn [skill] in seven days. I am starting at [level] and have [minutes] minutes per day. Give each day one goal, one short activity, and one way to check my understanding. End with a small project I can finish. Keep the scope realistic; do not promise mastery in a week.
```

**Example input:** Skill: CSS. Level: beginner. Time: 20 minutes a day.

**Illustrative example:** Day 1: Style a heading with color and font size. Check: explain which selector matches it. Day 2: Add spacing to a card. Day 3: Use flexbox for two buttons. Finish the week with a responsive profile card.

### Read code line by line

Understand what a small piece of code does before changing it.

**Prompt**

```text
Explain the following [language] code to a beginner: [paste code]. First state what it does overall. Then walk through its important lines and trace one concrete input to its output. Explain any assumptions or side effects. Do not rewrite the code unless I ask.
```

**Example input:** JavaScript: const doubled = [1, 2, 3].map(n => n * 2);

**Illustrative example:** This makes a new array by doubling every number. map visits 1, 2, and 3; the function returns 2, 4, and 6. doubled is [2, 4, 6]. The original array is not changed.

### Check what you remember

Practice recalling a topic instead of just reading it again.

**Prompt**

```text
Create five beginner questions about [topic] based on these notes: [notes]. Mix recall, explanation, and a small practical task. Show all questions first, followed by a clearly separated answer key with short explanations. Stay within the notes and flag missing information.
```

**Example input:** Topic: Git basics. Notes: status shows changes; add stages a file; commit records staged changes locally.

**Illustrative example:** Question: Which command stages README.md? Answer: git add README.md. Question: Does a local commit publish changes to GitHub? Answer: No; publishing requires a separate push.

### Tell two concepts apart

Choose between similar ideas with concrete examples.

**Prompt**

```text
Compare [concept A] and [concept B] for a beginner working on [project]. Explain what each means, where they overlap, and when I would use each. Give one example of each and a simple decision rule. Avoid presenting one as always better.
```

**Example input:** Concepts: HTML and CSS. Project: a personal homepage.

**Illustrative example:** HTML describes the content and its structure: a heading, paragraph, and link. CSS describes their appearance: colors, spacing, and layout. Use HTML to add a paragraph; use CSS to change its line spacing.

## Coding

### Build a tiny prototype

Get one useful feature working with understandable code.

**Prompt**

```text
Act as a coding mentor. Build the smallest useful version of [idea] with plain HTML, CSS, and JavaScript. It must run by opening index.html, with no libraries, accounts, or remote calls. Include labelled controls, keyboard access, and an empty state. Provide complete files, explain the event flow, and give three manual checks. Keep version one to [one feature].
```

**Example input:** Idea: a reading tracker. One feature: add a book title to a list.

**Illustrative example:** Files: index.html, styles.css, app.js. Flow: submitting the labelled form reads a trimmed title, creates a list item using textContent, then clears the field. Checks: add a title, reject blank input, and submit with Enter.

### Create a friendly form

Make a form that works with a keyboard and explains mistakes.

**Prompt**

```text
Create a small HTML form for [purpose], using only [fields]. Associate visible labels with inputs, use appropriate input types and autocomplete values, and show helpful validation messages. Include plain JavaScript only if HTML validation is insufficient. Explain how to use it with a keyboard and how to test errors.
```

**Example input:** Purpose: add a daily goal. Fields: goal text, up to 100 characters.

**Illustrative example:** Use a label for an input with id goal, required and maxlength=100. Keep a visible Add goal button. Trim the value on submit so spaces alone do not create a goal. Focus returns to the input after adding.

### Save progress locally

Add browser storage with a fallback and a clear limit.

**Prompt**

```text
Add localStorage persistence to this small app: [code]. Store only [data] under a unique versioned key. Validate restored data and handle missing, malformed, or unavailable storage without crashing. Explain that data belongs to this browser and can be cleared. Show how to test a reload and a storage failure.
```

**Example input:** Data: an array of goal objects with a string title and a boolean done flag.

**Illustrative example:** Read the key inside try/catch, parse the JSON, and check every object's fields. Use an empty array if validation fails. Save after every change. If storage is blocked, keep the app working in memory and show that progress will not survive a reload.

### Fit a page to a phone

Improve a small screen layout without hiding useful controls.

**Prompt**

```text
Review this HTML and CSS for a [page type]: [code]. Make it usable at 375px and 1280px wide. Avoid horizontal scrolling, keep controls readable, and use a single column when needed. Give the smallest CSS changes, explain why they work, and list checks for long text and keyboard focus.
```

**Example input:** Page: two tool cards in a grid. Long project names overflow.

**Illustrative example:** Use repeat(2, minmax(0, 1fr)) for the desktop grid, min-width: 0 on cards, and overflow-wrap: anywhere for long text. At 720px switch to one column. Verify that buttons remain visible and the page has no horizontal scrollbar.

### Write a useful README

Help a new person open, use, and modify your project.

**Prompt**

```text
Write a concise README for [project] using these verified facts: [facts]. Include purpose, intended user, exact local start instructions, features, storage behavior, a manual test checklist, and one next step. Do not invent deployment links, licenses, dependencies, or features.
```

**Example input:** Project: Luna Launchpad. Facts: plain HTML/CSS/JS, add and complete goals, localStorage, open index.html.

**Illustrative example:** Luna Launchpad is a small daily goal tracker. Open index.html in a browser. Add a goal, mark it complete, and reload to check persistence. Goals stay in this browser; clearing site data removes them. Next step: add a category filter.

## Planning

### Shrink an idea to version one

Choose one core outcome and postpone the extras.

**Prompt**

```text
Help me turn [idea] into a first project I can finish in [available time]. Define one user, one problem, and one success criterion. Choose at most three essential features. Put other ideas in a later list. Explain the biggest assumption and suggest a quick way to test it before building.
```

**Example input:** Idea: a productivity dashboard. Time: one afternoon.

**Illustrative example:** User: me before a study session. Problem: choosing the next task. Version one: add a task, mark it done, and keep it after reload. Success: choose and complete one task. Later: calendar sync, accounts, and analytics.

### Break work into small tasks

Create a task list where every item has a finish line.

**Prompt**

```text
Break this project into six or fewer tasks: [project scope]. Each task should take roughly [time limit], start with a concrete verb, and have a visible definition of done. Order dependencies correctly and name any task that might need to be split further.
```

**Example input:** Scope: local goal tracker. Time limit: 20 minutes per task.

**Illustrative example:** 1. Create the form: a labelled input and button appear. 2. Render a goal: submitted text appears in the list. 3. Toggle completion: a checkbox updates the count. 4. Save goals: reload restores them. 5. Check phone layout. 6. Write start instructions.

### Know when you are finished

Define a few checks that prove the first version works.

**Prompt**

```text
Make a short definition of done for [feature] in [project]. Include the expected happy path, one invalid input, keyboard use, and any persistence behavior. Use observable checks, not vague goals like 'looks good'. Keep it to six checks and separate future improvements.
```

**Example input:** Feature: add a goal. Project: a local goal tracker.

**Illustrative example:** Done when: a valid title creates one goal; blank or spaces-only input creates none; Enter submits; the input clears and regains focus; the new goal survives reload when storage is available; long text wraps on a phone.

### Plan a 30-minute build session

End a short session with a result you can show.

**Prompt**

```text
Plan a 30-minute work session to make progress on [task]. Use a five-minute setup, twenty minutes of focused building, and five minutes of checking and notes. Identify the smallest result I should aim for, one likely distraction, and a clear place to stop if I run out of time.
```

**Example input:** Task: add a completed-goals counter.

**Illustrative example:** Setup: locate the render function and current goals array. Build: count goals whose done flag is true and update a visible label. Check: toggle two goals and verify the count. Stop after the counter works; postpone charts.

### Ask for feedback that helps

Find out whether your first version solves the right problem.

**Prompt**

```text
Draft a friendly feedback request for [project] aimed at [audience]. Describe its actual purpose in one sentence, give one task to try, and ask three neutral questions about clarity and usefulness. Do not lead the reader toward praise. Keep it under 150 words.
```

**Example input:** Project: Luna Launchpad. Audience: a friend learning to code.

**Illustrative example:** I made a small goal tracker that keeps tasks in your browser. Could you add one goal and mark it complete? What did you expect to happen? Was any label confusing? Would this help you choose a next task, and why?

## Troubleshooting

### Understand an error message

Start from evidence and try the smallest useful check.

**Prompt**

```text
Help me diagnose this error: [exact error]. Environment: [browser or runtime]. Expected behavior: [expected]. Actual behavior: [actual]. Relevant code: [code]. Distinguish facts from guesses, suggest the most likely cause, and give a minimal check before proposing a fix. If information is missing, ask for it rather than inventing it.
```

**Example input:** Browser error: Cannot read properties of null (reading 'addEventListener'). Selector: #addGoal; HTML id: goalForm.

**Illustrative example:** The selector returns null because no element has id addGoal. Check document.querySelector('#addGoal') in the console and compare the HTML id. Listen on #goalForm instead, and ensure the script runs after the HTML is parsed.

### Make a bug reproducible

Turn 'it does not work' into steps someone else can follow.

**Prompt**

```text
Turn these observations into a concise bug report: [observations]. Include environment, minimal numbered steps, expected result, actual result, and any exact error. Mark unknown details as unknown. Suggest one experiment that could narrow the cause without deleting user data.
```

**Example input:** Observations: add a goal, reload, it disappears; private browser window; no visible error.

**Illustrative example:** Steps: open the tracker in a private window, add 'Read one page', then reload. Expected: goal remains. Actual: list is empty. Storage availability is unknown. Experiment: try a new non-private window and compare the visible storage status.

### Repair a JSON example

Explain a syntax problem and preserve the intended data.

**Prompt**

```text
Validate this JSON text: [JSON]. If invalid, explain each syntax issue and return the smallest corrected version. Preserve keys and values unless a change is necessary; explain any ambiguity. Distinguish JSON syntax validity from whether the data fits an application's expected shape.
```

**Example input:** JSON: {"title": "Read", "done": false,}

**Illustrative example:** JSON does not allow a trailing comma after the last property. Corrected: {"title":"Read","done":false}. This is valid JSON, but a tracker expecting an array would need [{"title":"Read","done":false}] instead.

### Understand your Git changes

Inspect a working tree before choosing what to commit.

**Prompt**

```text
Explain this git status and git diff output: [output]. Tell me which changes are staged, unstaged, or untracked, using only the evidence shown. Suggest non-destructive inspection commands and how to stage only the intended files. Do not suggest reset, clean, or force-push commands.
```

**Example input:** Status: modified: styles.css under changes not staged; new file app.js under untracked files.

**Illustrative example:** styles.css has unstaged edits; app.js is untracked. Inspect tracked edits with git diff -- styles.css. Review app.js in your editor. Stage the intended files with git add styles.css app.js, then inspect git diff --cached before committing.

### Check a feature before sharing

Find meaningful failures with a small manual test plan.

**Prompt**

```text
Create a focused manual test plan for [feature] in this app: [behavior]. Cover a normal flow, one boundary case, reload behavior if relevant, keyboard use, and phone layout. For each check, state the action and expected result. Include a way to confirm that user-entered HTML displays as text.
```

**Example input:** Feature: add and complete goals. Behavior: localStorage saves progress.

**Illustrative example:** Add 'Read' and check one new row. Toggle its checkbox and check the completion count. Reload and check the same state. Add '<b>Read</b>' and check that literal text appears, with no bold HTML. At 375px, check that the remove button stays visible.
