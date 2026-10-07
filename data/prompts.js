(function () {
  "use strict";

  // Plain data so the library also works when index.html is opened as a file.
  window.LUNA_PROMPTS = [
    {
      id: "learn-anything", category: "Learning", title: "Understand a new topic",
      description: "Turn an unfamiliar idea into an explanation you can actually use.",
      prompt: "Act as a patient tutor. Explain [topic] to someone who knows [what I already know]. Use plain language, one everyday analogy, and a small worked example. Define new terms. Finish with three practice questions and put the answers in a separate section. If the topic needs prerequisites, name them first.",
      input: "Topic: JavaScript variables. I already know basic HTML.",
      example: "A variable is a named place to keep a value. Think of a labelled box. In `let score = 0`, the label is score and the value is 0. `score = score + 1` changes it to 1. Practice: What value remains after adding 2? Answer: 3."
    },
    {
      id: "learning-plan", category: "Learning", title: "Make a seven-day learning plan",
      description: "A realistic plan with a small, visible result each day.",
      prompt: "Help me learn [skill] in seven days. I am starting at [level] and have [minutes] minutes per day. Give each day one goal, one short activity, and one way to check my understanding. End with a small project I can finish. Keep the scope realistic; do not promise mastery in a week.",
      input: "Skill: CSS. Level: beginner. Time: 20 minutes a day.",
      example: "Day 1: Style a heading with color and font size. Check: explain which selector matches it. Day 2: Add spacing to a card. Day 3: Use flexbox for two buttons. Finish the week with a responsive profile card."
    },
    {
      id: "explain-code", category: "Learning", title: "Read code line by line",
      description: "Understand what a small piece of code does before changing it.",
      prompt: "Explain the following [language] code to a beginner: [paste code]. First state what it does overall. Then walk through its important lines and trace one concrete input to its output. Explain any assumptions or side effects. Do not rewrite the code unless I ask.",
      input: "JavaScript: const doubled = [1, 2, 3].map(n => n * 2);",
      example: "This makes a new array by doubling every number. map visits 1, 2, and 3; the function returns 2, 4, and 6. doubled is [2, 4, 6]. The original array is not changed."
    },
    {
      id: "practice-quiz", category: "Learning", title: "Check what you remember",
      description: "Practice recalling a topic instead of just reading it again.",
      prompt: "Create five beginner questions about [topic] based on these notes: [notes]. Mix recall, explanation, and a small practical task. Show all questions first, followed by a clearly separated answer key with short explanations. Stay within the notes and flag missing information.",
      input: "Topic: Git basics. Notes: status shows changes; add stages a file; commit records staged changes locally.",
      example: "Question: Which command stages README.md? Answer: git add README.md. Question: Does a local commit publish changes to GitHub? Answer: No; publishing requires a separate push."
    },
    {
      id: "compare-concepts", category: "Learning", title: "Tell two concepts apart",
      description: "Choose between similar ideas with concrete examples.",
      prompt: "Compare [concept A] and [concept B] for a beginner working on [project]. Explain what each means, where they overlap, and when I would use each. Give one example of each and a simple decision rule. Avoid presenting one as always better.",
      input: "Concepts: HTML and CSS. Project: a personal homepage.",
      example: "HTML describes the content and its structure: a heading, paragraph, and link. CSS describes their appearance: colors, spacing, and layout. Use HTML to add a paragraph; use CSS to change its line spacing."
    },
    {
      id: "first-prototype", category: "Coding", title: "Build a tiny prototype",
      description: "Get one useful feature working with understandable code.",
      prompt: "Act as a coding mentor. Build the smallest useful version of [idea] with plain HTML, CSS, and JavaScript. It must run by opening index.html, with no libraries, accounts, or remote calls. Include labelled controls, keyboard access, and an empty state. Provide complete files, explain the event flow, and give three manual checks. Keep version one to [one feature].",
      input: "Idea: a reading tracker. One feature: add a book title to a list.",
      example: "Files: index.html, styles.css, app.js. Flow: submitting the labelled form reads a trimmed title, creates a list item using textContent, then clears the field. Checks: add a title, reject blank input, and submit with Enter."
    },
    {
      id: "accessible-form", category: "Coding", title: "Create a friendly form",
      description: "Make a form that works with a keyboard and explains mistakes.",
      prompt: "Create a small HTML form for [purpose], using only [fields]. Associate visible labels with inputs, use appropriate input types and autocomplete values, and show helpful validation messages. Include plain JavaScript only if HTML validation is insufficient. Explain how to use it with a keyboard and how to test errors.",
      input: "Purpose: add a daily goal. Fields: goal text, up to 100 characters.",
      example: "Use a label for an input with id goal, required and maxlength=100. Keep a visible Add goal button. Trim the value on submit so spaces alone do not create a goal. Focus returns to the input after adding."
    },
    {
      id: "save-progress", category: "Coding", title: "Save progress locally",
      description: "Add browser storage with a fallback and a clear limit.",
      prompt: "Add localStorage persistence to this small app: [code]. Store only [data] under a unique versioned key. Validate restored data and handle missing, malformed, or unavailable storage without crashing. Explain that data belongs to this browser and can be cleared. Show how to test a reload and a storage failure.",
      input: "Data: an array of goal objects with a string title and a boolean done flag.",
      example: "Read the key inside try/catch, parse the JSON, and check every object's fields. Use an empty array if validation fails. Save after every change. If storage is blocked, keep the app working in memory and show that progress will not survive a reload."
    },
    {
      id: "responsive-layout", category: "Coding", title: "Fit a page to a phone",
      description: "Improve a small screen layout without hiding useful controls.",
      prompt: "Review this HTML and CSS for a [page type]: [code]. Make it usable at 375px and 1280px wide. Avoid horizontal scrolling, keep controls readable, and use a single column when needed. Give the smallest CSS changes, explain why they work, and list checks for long text and keyboard focus.",
      input: "Page: two tool cards in a grid. Long project names overflow.",
      example: "Use repeat(2, minmax(0, 1fr)) for the desktop grid, min-width: 0 on cards, and overflow-wrap: anywhere for long text. At 720px switch to one column. Verify that buttons remain visible and the page has no horizontal scrollbar."
    },
    {
      id: "useful-readme", category: "Coding", title: "Write a useful README",
      description: "Help a new person open, use, and modify your project.",
      prompt: "Write a concise README for [project] using these verified facts: [facts]. Include purpose, intended user, exact local start instructions, features, storage behavior, a manual test checklist, and one next step. Do not invent deployment links, licenses, dependencies, or features.",
      input: "Project: Luna Launchpad. Facts: plain HTML/CSS/JS, add and complete goals, localStorage, open index.html.",
      example: "Luna Launchpad is a small daily goal tracker. Open index.html in a browser. Add a goal, mark it complete, and reload to check persistence. Goals stay in this browser; clearing site data removes them. Next step: add a category filter."
    },
    {
      id: "scope-idea", category: "Planning", title: "Shrink an idea to version one",
      description: "Choose one core outcome and postpone the extras.",
      prompt: "Help me turn [idea] into a first project I can finish in [available time]. Define one user, one problem, and one success criterion. Choose at most three essential features. Put other ideas in a later list. Explain the biggest assumption and suggest a quick way to test it before building.",
      input: "Idea: a productivity dashboard. Time: one afternoon.",
      example: "User: me before a study session. Problem: choosing the next task. Version one: add a task, mark it done, and keep it after reload. Success: choose and complete one task. Later: calendar sync, accounts, and analytics."
    },
    {
      id: "small-tasks", category: "Planning", title: "Break work into small tasks",
      description: "Create a task list where every item has a finish line.",
      prompt: "Break this project into six or fewer tasks: [project scope]. Each task should take roughly [time limit], start with a concrete verb, and have a visible definition of done. Order dependencies correctly and name any task that might need to be split further.",
      input: "Scope: local goal tracker. Time limit: 20 minutes per task.",
      example: "1. Create the form: a labelled input and button appear. 2. Render a goal: submitted text appears in the list. 3. Toggle completion: a checkbox updates the count. 4. Save goals: reload restores them. 5. Check phone layout. 6. Write start instructions."
    },
    {
      id: "definition-done", category: "Planning", title: "Know when you are finished",
      description: "Define a few checks that prove the first version works.",
      prompt: "Make a short definition of done for [feature] in [project]. Include the expected happy path, one invalid input, keyboard use, and any persistence behavior. Use observable checks, not vague goals like 'looks good'. Keep it to six checks and separate future improvements.",
      input: "Feature: add a goal. Project: a local goal tracker.",
      example: "Done when: a valid title creates one goal; blank or spaces-only input creates none; Enter submits; the input clears and regains focus; the new goal survives reload when storage is available; long text wraps on a phone."
    },
    {
      id: "focused-session", category: "Planning", title: "Plan a 30-minute build session",
      description: "End a short session with a result you can show.",
      prompt: "Plan a 30-minute work session to make progress on [task]. Use a five-minute setup, twenty minutes of focused building, and five minutes of checking and notes. Identify the smallest result I should aim for, one likely distraction, and a clear place to stop if I run out of time.",
      input: "Task: add a completed-goals counter.",
      example: "Setup: locate the render function and current goals array. Build: count goals whose done flag is true and update a visible label. Check: toggle two goals and verify the count. Stop after the counter works; postpone charts."
    },
    {
      id: "ask-feedback", category: "Planning", title: "Ask for feedback that helps",
      description: "Find out whether your first version solves the right problem.",
      prompt: "Draft a friendly feedback request for [project] aimed at [audience]. Describe its actual purpose in one sentence, give one task to try, and ask three neutral questions about clarity and usefulness. Do not lead the reader toward praise. Keep it under 150 words.",
      input: "Project: Luna Launchpad. Audience: a friend learning to code.",
      example: "I made a small goal tracker that keeps tasks in your browser. Could you add one goal and mark it complete? What did you expect to happen? Was any label confusing? Would this help you choose a next task, and why?"
    },
    {
      id: "debug-error", category: "Troubleshooting", title: "Understand an error message",
      description: "Start from evidence and try the smallest useful check.",
      prompt: "Help me diagnose this error: [exact error]. Environment: [browser or runtime]. Expected behavior: [expected]. Actual behavior: [actual]. Relevant code: [code]. Distinguish facts from guesses, suggest the most likely cause, and give a minimal check before proposing a fix. If information is missing, ask for it rather than inventing it.",
      input: "Browser error: Cannot read properties of null (reading 'addEventListener'). Selector: #addGoal; HTML id: goalForm.",
      example: "The selector returns null because no element has id addGoal. Check document.querySelector('#addGoal') in the console and compare the HTML id. Listen on #goalForm instead, and ensure the script runs after the HTML is parsed."
    },
    {
      id: "reproduce-bug", category: "Troubleshooting", title: "Make a bug reproducible",
      description: "Turn 'it does not work' into steps someone else can follow.",
      prompt: "Turn these observations into a concise bug report: [observations]. Include environment, minimal numbered steps, expected result, actual result, and any exact error. Mark unknown details as unknown. Suggest one experiment that could narrow the cause without deleting user data.",
      input: "Observations: add a goal, reload, it disappears; private browser window; no visible error.",
      example: "Steps: open the tracker in a private window, add 'Read one page', then reload. Expected: goal remains. Actual: list is empty. Storage availability is unknown. Experiment: try a new non-private window and compare the visible storage status."
    },
    {
      id: "check-json", category: "Troubleshooting", title: "Repair a JSON example",
      description: "Explain a syntax problem and preserve the intended data.",
      prompt: "Validate this JSON text: [JSON]. If invalid, explain each syntax issue and return the smallest corrected version. Preserve keys and values unless a change is necessary; explain any ambiguity. Distinguish JSON syntax validity from whether the data fits an application's expected shape.",
      input: "JSON: {\"title\": \"Read\", \"done\": false,}",
      example: "JSON does not allow a trailing comma after the last property. Corrected: {\"title\":\"Read\",\"done\":false}. This is valid JSON, but a tracker expecting an array would need [{\"title\":\"Read\",\"done\":false}] instead."
    },
    {
      id: "git-changes", category: "Troubleshooting", title: "Understand your Git changes",
      description: "Inspect a working tree before choosing what to commit.",
      prompt: "Explain this git status and git diff output: [output]. Tell me which changes are staged, unstaged, or untracked, using only the evidence shown. Suggest non-destructive inspection commands and how to stage only the intended files. Do not suggest reset, clean, or force-push commands.",
      input: "Status: modified: styles.css under changes not staged; new file app.js under untracked files.",
      example: "styles.css has unstaged edits; app.js is untracked. Inspect tracked edits with git diff -- styles.css. Review app.js in your editor. Stage the intended files with git add styles.css app.js, then inspect git diff --cached before committing."
    },
    {
      id: "test-feature", category: "Troubleshooting", title: "Check a feature before sharing",
      description: "Find meaningful failures with a small manual test plan.",
      prompt: "Create a focused manual test plan for [feature] in this app: [behavior]. Cover a normal flow, one boundary case, reload behavior if relevant, keyboard use, and phone layout. For each check, state the action and expected result. Include a way to confirm that user-entered HTML displays as text.",
      input: "Feature: add and complete goals. Behavior: localStorage saves progress.",
      example: "Add 'Read' and check one new row. Toggle its checkbox and check the completion count. Reload and check the same state. Add '<b>Read</b>' and check that literal text appears, with no bold HTML. At 375px, check that the remove button stays visible."
    }
  ];
}());
