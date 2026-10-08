# Luna Launchpad

A small daily goal tracker and an editable first project. Add a goal, mark it complete, and see your progress. It uses plain HTML, CSS, and JavaScript, with no dependencies, account, analytics, or remote requests.

## Open it

Double-click `index.html`, or open it from your browser's File menu. No terminal or installation is required. Keep `index.html`, `styles.css`, and `app.js` in the same folder; together they are the complete working source.

You can optionally run `python -m http.server 8080` in this folder and visit `http://localhost:8080`.

## Make it yours

Read [WALKTHROUGH.md](WALKTHROUGH.md) for a five-step tour and an exercise. Edit the heading in `index.html`, the colors in `styles.css`, or the behavior in `app.js`, then reload the browser. Make a copy first if you want to preserve the original reference.

## Data

Goals are saved under `luna-launchpad-goals-v1` in this browser's localStorage. This is not cloud sync or a backup. Clearing browser data removes goals; another browser or origin has separate data. If storage is blocked, the tracker works in memory and displays a notice. Browser behavior for local files can vary; the optional local server gives the project a consistent origin.

## Check your changes

1. Add a goal with the button, then another with Enter.
2. Mark one complete. Check that the count and progress bar change.
3. Reload. With storage available, both goals and the completed state remain.
4. Remove a goal. Check the count and keyboard focus.
5. Try spaces only: no goal should be created.
6. Add `<b>Read</b>`: it should appear literally, not as HTML.
7. Try a narrow phone window and navigate using Tab and Space.

The project does not include a build tool or test dependency. The checklist above is the intended manual smoke test; the parent repository's `npm test` also checks the tracked starter files and archive contents.

## Next small step

Add a button to hide completed goals. Work on a copy first, so the original remains a working reference.
