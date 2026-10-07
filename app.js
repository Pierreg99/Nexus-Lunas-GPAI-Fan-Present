(function () {
  "use strict";

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  var memoryStore = {};
  var store = {
    get: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return memoryStore[key] || null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { memoryStore[key] = value; }
    }
  };

  var KEYS = {
    theme: "luna-present-theme",
    kanban: "luna-present-kanban-v1",
    checklist: "luna-present-checklist-v1",
    guide: "luna-launchpad-guide-v1",
    supporter: "luna-first-pack-name-v1"
  };

  var toastTimer;
  function toast(message) {
    var el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  function copyText(text) {
    if (!text || !String(text).trim()) {
      toast("There is nothing to copy yet.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("Copied to your clipboard.");
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
    toast("Copied to your clipboard.");
  }

  var savedTheme = store.get(KEYS.theme);
  function useTheme(theme) {
    if (["dark", "light", "aurora"].indexOf(theme) === -1) theme = "dark";
    document.documentElement.dataset.theme = theme;
    store.set(KEYS.theme, theme);
    $$("[data-theme-choice]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
    });
    var labels = {dark:"Midnight",light:"Daybreak",aurora:"Luna Aurora"};
    $("#themeToggle").setAttribute("aria-label", "Switch color theme. Current theme: " + labels[theme]);
    var meta = $("meta[name='theme-color']");
    if (meta) meta.content = theme === "light" ? "#f4f7fb" : theme === "aurora" ? "#141222" : "#0b0f16";
  }
  useTheme(savedTheme || "dark");
  $("#themeToggle").addEventListener("click", function () {
    var choices = ["dark", "light", "aurora"];
    var current = document.documentElement.dataset.theme || "dark";
    useTheme(choices[(choices.indexOf(current) + 1) % choices.length]);
  });
  $$("[data-theme-choice]").forEach(function (button) {
    button.addEventListener("click", function () { useTheme(button.dataset.themeChoice); });
  });

  var promptPresets = {
    learn: {
      role: "a patient learning coach",
      goal: "Explain this topic so I can really understand it.",
      context: "I am a beginner and know the basics.",
      rules: "Use plain language. Explain new terms. Break big steps into small ones.",
      output: "A short explanation, a worked example, and three practice questions with answers."
    },
    code: {
      role: "a friendly senior developer and mentor",
      goal: "Help me build a small working solution.",
      context: "I am still learning and want to understand why each step is needed.",
      rules: "Avoid unnecessary dependencies. Choose safe defaults. Explain likely errors.",
      output: "A step-by-step plan, code, a test guide, and common mistakes."
    },
    plan: {
      role: "a practical project mentor",
      goal: "Turn my idea into a small, achievable first project.",
      context: "The project should grow one small step at a time.",
      rules: "Start with an MVP. Prioritize clarity over the number of features.",
      output: "The MVP goal, five to seven tasks, a definition of done, and three future ideas."
    }
  };

  $$(".prompt-preset").forEach(function (button) {
    button.addEventListener("click", function () {
      var p = promptPresets[button.dataset.preset];
      $("#promptRole").value = p.role;
      $("#promptGoal").value = p.goal;
      $("#promptContext").value = p.context;
      $("#promptRules").value = p.rules;
      $("#promptOutput").value = p.output;
      toast("Starter prompt added.");
    });
  });

  function buildPrompt() {
    var values = [
      ["Rolle", $("#promptRole").value.trim()],
      ["Aufgabe / Ziel", $("#promptGoal").value.trim()],
      ["Kontext", $("#promptContext").value.trim()],
      ["Regeln / Grenzen", $("#promptRules").value.trim()],
      ["Gewünschte Ausgabe", $("#promptOutput").value.trim()]
    ];
    var parts = [];
    values.forEach(function (item) {
      if (item[1]) parts.push(item[0] + ":\n" + item[1]);
    });
    $("#promptResult").textContent = parts.length ? parts.join("\n\n") : "Fülle mindestens ein Feld aus.";
  }
  $("#buildPrompt").addEventListener("click", buildPrompt);
  $("#copyPrompt").addEventListener("click", function () { copyText($("#promptResult").textContent); });

  var commands = [
    { type:"linux", cmd:"pwd", note:"Zeigt den aktuellen Ordner." },
    { type:"linux", cmd:"ls -la", note:"Listet Dateien inklusive versteckter Einträge." },
    { type:"linux", cmd:"cd <ordner>", note:"Wechselt in einen Ordner. <ordner> ersetzen." },
    { type:"linux", cmd:"mkdir <name>", note:"Erstellt einen neuen Ordner." },
    { type:"windows", cmd:"Get-Location", note:"Zeigt den aktuellen Ordner in PowerShell." },
    { type:"windows", cmd:"Get-ChildItem", note:"Listet Dateien und Ordner." },
    { type:"windows", cmd:"Set-Location <ordner>", note:"Wechselt in einen Ordner." },
    { type:"windows", cmd:"New-Item -ItemType Directory <name>", note:"Erstellt einen neuen Ordner." },
    { type:"git", cmd:"git status", note:"Zeigt, welche Dateien geändert wurden." },
    { type:"git", cmd:"git diff", note:"Zeigt noch nicht committete Änderungen." },
    { type:"git", cmd:"git log --oneline -5", note:"Zeigt die letzten fünf Commits kompakt." },
    { type:"git", cmd:"git branch", note:"Zeigt lokale Branches; der aktuelle ist markiert." },
    { type:"git", cmd:"git add <datei>", note:"Nimmt eine Datei in den nächsten Commit auf." },
    { type:"git", cmd:"git commit -m \"kurze Nachricht\"", note:"Erstellt einen lokalen Commit mit Beschreibung." }
  ];

  function makeCopyButton(text) {
    var button = document.createElement("button");
    button.className = "copy-mini";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", function () { copyText(text); });
    return button;
  }

  function renderCommands() {
    var filter = $("#commandFilter").value;
    var box = $("#commandList");
    box.textContent = "";
    commands.filter(function (c) {
      return filter === "all" || c.type === filter;
    }).forEach(function (c) {
      var item = document.createElement("div");
      item.className = "command-item";
      var copy = document.createElement("div");
      var code = document.createElement("code");
      var note = document.createElement("small");
      code.textContent = c.cmd;
      note.textContent = c.note;
      copy.appendChild(code);
      copy.appendChild(note);
      item.appendChild(copy);
      item.appendChild(makeCopyButton(c.cmd));
      box.appendChild(item);
    });
  }
  $("#commandFilter").addEventListener("change", renderCommands);
  renderCommands();

  function emailDE(purpose, name, point) {
    var hello = "Hallo " + (name || "zusammen") + ",\n\n";
    var close = "\n\nFreundliche Grüße\n[Dein Name]";
    if (purpose === "question") return hello + "ich habe eine kurze Frage: " + (point || "[Kernpunkt ergänzen]") + ".\n\nKönnten Sie mir dazu bitte kurz weiterhelfen?\n\nVielen Dank." + close;
    if (purpose === "feedback") return hello + "ich möchte kurz Feedback geben: " + (point || "[Kernpunkt ergänzen]") + ".\n\nIch hoffe, das hilft für die nächsten Schritte." + close;
    if (purpose === "meeting") return hello + "ich würde gern einen kurzen Termin abstimmen. Thema: " + (point || "[Thema ergänzen]") + ".\n\nWelche Zeit passt Ihnen in den nächsten Tagen gut?" + close;
    return hello + "vielen Dank für " + (point || "[Grund ergänzen]") + ". Das hat mir sehr geholfen." + close;
  }

  function emailEN(purpose, name, point) {
    var hello = "Hello " + (name || "there") + ",\n\n";
    var close = "\n\nBest regards,\n[Your name]";
    if (purpose === "question") return hello + "I have a quick question: " + (point || "[add the key point]") + ".\n\nCould you please help me with this?\n\nThank you." + close;
    if (purpose === "feedback") return hello + "I wanted to share a quick piece of feedback: " + (point || "[add the key point]") + ".\n\nI hope this is useful for the next steps." + close;
    if (purpose === "meeting") return hello + "I would like to arrange a short meeting about " + (point || "[add the topic]") + ".\n\nWhat time would work well for you in the next few days?" + close;
    return hello + "Thank you for " + (point || "[add the reason]") + ". It was very helpful." + close;
  }

  $("#buildEmail").addEventListener("click", function () {
    var lang = $("#emailLang").value;
    var purpose = $("#emailPurpose").value;
    var name = $("#emailName").value.trim();
    var point = $("#emailPoint").value.trim();
    $("#emailResult").textContent = lang === "de" ? emailDE(purpose, name, point) : emailEN(purpose, name, point);
  });
  $("#copyEmail").addEventListener("click", function () { copyText($("#emailResult").textContent); });

  var defaultBoard = { todo:[{id:"sample-1",text:"Eine kleine Idee auswählen"}], doing:[], done:[] };
  var columns = [
    {id:"todo",title:"To do"},
    {id:"doing",title:"Doing"},
    {id:"done",title:"Done"}
  ];

  function cloneDefaultBoard() { return JSON.parse(JSON.stringify(defaultBoard)); }
  function loadBoard() {
    try {
      var parsed = JSON.parse(store.get(KEYS.kanban));
      return parsed && parsed.todo && parsed.doing && parsed.done ? parsed : cloneDefaultBoard();
    } catch (e) { return cloneDefaultBoard(); }
  }
  var board = loadBoard();
  function saveBoard() { store.set(KEYS.kanban, JSON.stringify(board)); }

  function moveTask(from, index, direction) {
    var colIndex = columns.findIndex(function (c) { return c.id === from; });
    var targetIndex = colIndex + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    var task = board[from].splice(index, 1)[0];
    board[columns[targetIndex].id].push(task);
    saveBoard();
    renderBoard();
  }

  function removeTask(from, index) {
    board[from].splice(index, 1);
    saveBoard();
    renderBoard();
  }

  function taskButton(label, title, handler, disabled, className) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", title);
    if (disabled) button.disabled = true;
    if (className) button.className = className;
    button.addEventListener("click", handler);
    return button;
  }

  function renderBoard() {
    var root = $("#kanbanBoard");
    root.textContent = "";
    columns.forEach(function (col, colIndex) {
      var section = document.createElement("section");
      section.className = "kanban-column";
      section.setAttribute("aria-label", col.title);

      var head = document.createElement("div");
      head.className = "column-head";
      var title = document.createElement("h4");
      title.textContent = col.title;
      var count = document.createElement("span");
      count.className = "column-count";
      count.textContent = board[col.id].length;
      head.appendChild(title);
      head.appendChild(count);
      section.appendChild(head);

      if (!board[col.id].length) {
        var empty = document.createElement("small");
        empty.className = "column-count";
        empty.textContent = "Noch leer.";
        section.appendChild(empty);
      }

      board[col.id].forEach(function (task, taskIndex) {
        var card = document.createElement("div");
        card.className = "task-card";
        var p = document.createElement("p");
        p.textContent = task.text;
        var actions = document.createElement("div");
        actions.className = "task-actions";
        actions.appendChild(taskButton("←", "Aufgabe nach links verschieben", function () { moveTask(col.id, taskIndex, -1); }, colIndex === 0));
        actions.appendChild(taskButton("→", "Aufgabe nach rechts verschieben", function () { moveTask(col.id, taskIndex, 1); }, colIndex === columns.length - 1));
        actions.appendChild(taskButton("×", "Aufgabe löschen", function () { removeTask(col.id, taskIndex); }, false, "remove"));
        card.appendChild(p);
        card.appendChild(actions);
        section.appendChild(card);
      });
      root.appendChild(section);
    });
  }

  $("#taskForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var input = $("#taskInput");
    var text = input.value.trim();
    if (!text) return;
    var col = $("#taskColumn").value;
    board[col].push({id:String(Date.now()),text:text});
    input.value = "";
    saveBoard();
    renderBoard();
    input.focus();
  });

  $("#resetKanban").addEventListener("click", function () {
    board = cloneDefaultBoard();
    saveBoard();
    renderBoard();
    toast("Board zurückgesetzt.");
  });
  renderBoard();

  function parseJson() {
    var raw = $("#jsonInput").value.trim();
    if (!raw) throw new Error("Bitte zuerst JSON einfügen.");
    return JSON.parse(raw);
  }
  function setJsonStatus(message, type) {
    var status = $("#jsonStatus");
    status.textContent = message;
    status.className = "status " + (type || "");
  }
  $("#formatJson").addEventListener("click", function () {
    try {
      $("#jsonInput").value = JSON.stringify(parseJson(), null, 2);
      setJsonStatus("Gültiges JSON — formatiert.", "ok");
    } catch (e) { setJsonStatus("Fehler: " + e.message, "error"); }
  });
  $("#minifyJson").addEventListener("click", function () {
    try {
      $("#jsonInput").value = JSON.stringify(parseJson());
      setJsonStatus("Gültiges JSON — verkleinert.", "ok");
    } catch (e) { setJsonStatus("Fehler: " + e.message, "error"); }
  });
  $("#copyJson").addEventListener("click", function () { copyText($("#jsonInput").value); });

  var checklistItems = [
    ["Eine kleine Idee wählen","Ein Problem oder eine Funktion reicht für Version 1."],
    ["README mit Ziel schreiben","In zwei bis drei Sätzen: Was ist es, für wen, wie startet man es?"],
    ["Kleinsten funktionierenden Prototyp bauen","Lieber eine Sache komplett als fünf halbfertige Features."],
    ["Git-Status prüfen","Mit git status sehen, was du wirklich geändert hast."],
    ["Ersten verständlichen Commit erstellen","Eine kurze Nachricht, die die Änderung beschreibt."],
    ["Projekt selbst testen","Starte es so, wie ein neuer Nutzer es starten würde."],
    ["Nächsten Mini-Schritt notieren","Eine klare nächste Aufgabe verhindert Feature-Chaos."]
  ];

  function loadChecklist() {
    try {
      var parsed = JSON.parse(store.get(KEYS.checklist));
      return Array.isArray(parsed) && parsed.length === checklistItems.length ? parsed : checklistItems.map(function () { return false; });
    } catch (e) { return checklistItems.map(function () { return false; }); }
  }
  var checklistState = loadChecklist();

  function saveChecklist() { store.set(KEYS.checklist, JSON.stringify(checklistState)); }
  function updateChecklistProgress() {
    var done = checklistState.filter(Boolean).length;
    $("#checkProgress").textContent = done + " von " + checklistItems.length + " erledigt";
    $("#checkProgressBar").style.width = ((done / checklistItems.length) * 100) + "%";
  }

  function renderChecklist() {
    var root = $("#projectChecklist");
    root.textContent = "";
    checklistItems.forEach(function (item, index) {
      var label = document.createElement("label");
      label.className = "check-row";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = checklistState[index];
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      var small = document.createElement("small");
      strong.textContent = item[0];
      small.textContent = item[1];
      span.appendChild(strong);
      span.appendChild(small);
      label.appendChild(input);
      label.appendChild(span);
      input.addEventListener("change", function () {
        checklistState[index] = input.checked;
        saveChecklist();
        updateChecklistProgress();
      });
      root.appendChild(label);
    });
    updateChecklistProgress();
  }

  $("#resetChecklist").addEventListener("click", function () {
    checklistState = checklistItems.map(function () { return false; });
    saveChecklist();
    renderChecklist();
    toast("Checkliste zurückgesetzt.");
  });
  renderChecklist();

  var missions = [
    ["BEGINNER","Baue eine HTML-Seite mit einer Überschrift, einem Absatz und einem Button. Der Button soll den Text ändern."],
    ["BEGINNER","Erstelle drei Git-Commits für drei kleine Änderungen und lies danach git log --oneline -5."],
    ["BEGINNER","Nimm einen langen Prompt und strukturiere ihn in Rolle, Ziel, Kontext, Regeln und Ausgabe."],
    ["BEGINNER","Lege eine JSON-Datei mit drei Lieblingsprojekten an und validiere sie mit dem JSON Helper."],
    ["BEGINNER+","Baue einen lokalen Zähler mit + und − und speichere den Wert in localStorage."],
    ["BEGINNER+","Erstelle für ein Mini-Projekt ein README mit Ziel, Startanleitung, Features und nächstem Schritt."],
    ["BEGINNER+","Baue eine kleine Suchleiste, die eine Liste von fünf Einträgen live filtert."],
    ["CREATIVE","Entwirf eine Startseite für ein fiktives Tool: ein klares Problem, ein Hero-Text und genau drei Features."],
    ["CREATIVE","Erfinde ein 30-Minuten-Mini-Tool, das dir selbst jeden Tag einen Klick spart."]
  ];
  var lastMission = -1;
  $("#newMission").addEventListener("click", function () {
    var index = Math.floor(Math.random() * missions.length);
    if (missions.length > 1 && index === lastMission) index = (index + 1) % missions.length;
    lastMission = index;
    $("#missionLevel").textContent = missions[index][0];
    $("#missionText").textContent = missions[index][1];
  });
}());
