(function () {
  "use strict";

  // Step 1: give this project its own storage key and find its HTML controls.
  var STORAGE_KEY = "luna-launchpad-goals-v1";
  var form = document.querySelector("#goalForm");
  var input = document.querySelector("#goalInput");
  var list = document.querySelector("#goalList");
  var count = document.querySelector("#goalCount");
  var progress = document.querySelector("#goalProgress");
  var empty = document.querySelector("#emptyState");
  var status = document.querySelector("#storageStatus");
  var storageAvailable = true;
  var goals = loadGoals();

  // Step 2: restore only data with the shape our app understands.
  function loadGoals() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      var parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(function (goal) {
        return goal && typeof goal.title === "string" && goal.title.trim().length > 0 && goal.title.length <= 100 && typeof goal.done === "boolean";
      })) throw new Error("Invalid goal data");
      return parsed;
    } catch (error) {
      storageAvailable = false;
      status.textContent = "Saved goals could not be read. You can still use this page; new goals stay in memory until a save succeeds.";
      return [];
    }
  }

  function saveGoals() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      storageAvailable = true;
      status.textContent = "Saved in this browser. Clearing browser data removes your goals.";
    } catch (error) {
      storageAvailable = false;
      status.textContent = "Browser storage is unavailable. Your goals work here, but will not survive a reload.";
    }
  }

  // Step 3: build the list from data. textContent keeps titles as plain text.
  function renderGoals() {
    list.textContent = "";
    goals.forEach(function (goal, index) {
      var row = document.createElement("li");
      row.className = "goal" + (goal.done ? " done" : "");
      var label = document.createElement("label");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = goal.done;
      var title = document.createElement("span");
      title.textContent = goal.title;
      checkbox.addEventListener("change", function () {
        goal.done = checkbox.checked;
        saveGoals();
        // Keep the checkbox in place so keyboard focus does not disappear.
        row.classList.toggle("done", goal.done);
        updateProgress();
      });
      label.appendChild(checkbox);
      label.appendChild(title);
      var remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", "Remove goal: " + goal.title);
      remove.addEventListener("click", function () {
        goals.splice(index, 1);
        saveGoals();
        renderGoals();
        var next = list.querySelectorAll(".goal button");
        if (next.length) next[Math.min(index, next.length - 1)].focus();
        else input.focus();
      });
      row.appendChild(label);
      row.appendChild(remove);
      list.appendChild(row);
    });
    empty.hidden = goals.length > 0;
    updateProgress();
  }

  // Step 4: count completed goals and update the accessible progress element.
  function updateProgress() {
    var completed = goals.filter(function (goal) { return goal.done; }).length;
    count.textContent = completed + " of " + goals.length + " complete";
    progress.max = Math.max(1, goals.length);
    progress.value = completed;
  }

  // Step 5: adding a goal changes data, saves it, then refreshes the view.
  input.addEventListener("input", function () { input.setCustomValidity(""); });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = input.value.trim();
    if (!title) {
      input.setCustomValidity("Write a small goal, not just spaces.");
      input.reportValidity();
      return;
    }
    goals.push({ title: title, done: false });
    saveGoals();
    renderGoals();
    form.reset();
    input.focus();
  });

  renderGoals();
  if (storageAvailable) status.textContent = "Goals stay in this browser. Clearing browser data removes them.";
}());
