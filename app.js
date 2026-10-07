(function () {
  "use strict";

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  var memoryStore = {};
  var store = {
    get: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return memoryStore[key] || null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { memoryStore[key] = value; }
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) { delete memoryStore[key]; }
    }
  };

  var KEYS = {
    theme: "luna-toolkit-theme",
    kanban: "luna-toolkit-kanban-v2",
    checklist: "luna-toolkit-checklist-v2",
    drafts: "luna-toolkit-drafts-v2",
    usage: "luna-toolkit-usage-v2"
  };

  var toastTimer;
  function toast(message) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1900);
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
    toast("In die Zwischenablage kopiert.");
  }

  function copyText(text) {
    if (!text || !String(text).trim()) {
      toast("Noch nichts zum Kopieren.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("In die Zwischenablage kopiert.");
      }).catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  function safeJson(raw, fallback) {
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function loadUsage() {
    var parsed = safeJson(store.get(KEYS.usage), {});
    return parsed && typeof parsed === "object" ? parsed : {};
  }
  var usage = loadUsage();

  function markUse(tool) {
    usage[tool] = (usage[tool] || 0) + 1;
    store.set(KEYS.usage, JSON.stringify(usage));
    updateDashboard();
  }

  function usageTotal() {
    return Object.keys(usage).reduce(function (sum, key) { return sum + Number(usage[key] || 0); }, 0);
  }

  function currentTheme() {
    return document.documentElement.dataset.theme || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store.set(KEYS.theme, theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f3f7fb" : "#06101a");
  }

  var savedTheme = store.get(KEYS.theme);
  if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);

  $("#themeToggle").addEventListener("click", function () {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
  });

  function updateConnection() {
    var badge = $("#connectionBadge");
    var online = navigator.onLine;
    badge.classList.toggle("offline", !online);
    badge.lastChild.nodeValue = online ? "lokal" : "offline";
    $("#dashboardStatus").textContent = online ? "Ready" : "Offline";
  }
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  updateConnection();

  var launcherCards = $$(".launch-card");
  function filterLauncher() {
    var term = $("#toolSearch").value.trim().toLowerCase();
    var visible = 0;
    launcherCards.forEach(function (card) {
      var haystack = (card.textContent + " " + (card.dataset.search || "")).toLowerCase();
      var match = !term || haystack.indexOf(term) !== -1;
      card.hidden = !match;
      if (match) visible += 1;
    });
    $("#emptySearch").hidden = visible !== 0;
  }
  $("#toolSearch").addEventListener("input", filterLauncher);

  function focusSearch() {
    $("#launcher").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { $("#toolSearch").focus(); }, 280);
  }
  $("#searchShortcut").addEventListener("click", focusSearch);
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      focusSearch();
    }
  });

  var toolIds = ["prompt-tool","terminal-tool","email-tool","kanban-tool","json-tool","project-tool","mission-tool"];
  $("#randomTool").addEventListener("click", function () {
    var id = toolIds[Math.floor(Math.random() * toolIds.length)];
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  var drafts = safeJson(store.get(KEYS.drafts), {}) || {};
  $$('[data-draft]').forEach(function (field) {
    var key = field.dataset.draft;
    if (Object.prototype.hasOwnProperty.call(drafts, key)) field.value = drafts[key];
    field.addEventListener("input", function () {
      drafts[key] = field.value;
      store.set(KEYS.drafts, JSON.stringify(drafts));
      if (key.indexOf("prompt") === 0) updatePromptQuality();
    });
    field.addEventListener("change", function () {
      drafts[key] = field.value;
      store.set(KEYS.drafts, JSON.stringify(drafts));
    });
  });

  var promptPresets = {
    learn: {
      role: "geduldiger Lerncoach",
      goal: "Erkläre mir das Thema so, dass ich es wirklich verstehe.",
      context: "Ich bin Anfänger und kenne nur die Grundlagen.",
      rules: "Nutze einfache Sprache. Erkläre Fachbegriffe. Teile große Schritte in kleine Schritte.",
      output: "Kurze Erklärung, Beispiel, dann 3 kleine Übungen mit Lösungen."
    },
    code: {
      role: "freundlicher Senior-Developer und Mentor",
      goal: "Hilf mir, eine kleine funktionierende Lösung zu bauen.",
      context: "Ich lerne noch und möchte verstehen, warum jeder Schritt nötig ist.",
      rules: "Keine unnötigen Abhängigkeiten. Zeige sichere Defaults. Erkläre Fehlerquellen.",
      output: "Schritt-für-Schritt-Plan, Code, Testanleitung und häufige Fehler."
    },
    plan: {
      role: "pragmatischer Projekt-Mentor",
      goal: "Verwandle meine Idee in ein kleines umsetzbares erstes Projekt.",
      context: "Das Projekt soll in kleinen Etappen wachsen können.",
      rules: "Starte mit einem MVP. Priorisiere Verständlichkeit vor Feature-Menge.",
      output: "MVP-Ziel, 5–7 Aufgaben, Definition of Done und 3 spätere Erweiterungen."
    },
    review: {
      role: "gründlicher Reviewer mit Fokus auf Verständlichkeit und Risiken",
      goal: "Prüfe meinen Entwurf und nenne die wichtigsten Verbesserungen.",
      context: "Ich möchte konkrete Hinweise statt allgemeiner Kritik.",
      rules: "Priorisiere Probleme nach Wirkung. Erkläre kurz das Warum. Erfinde keine fehlenden Fakten.",
      output: "Stärken, wichtigste Probleme, konkrete Verbesserungen und eine kurze überarbeitete Fassung."
    }
  };

  var promptFieldIds = ["promptRole","promptGoal","promptContext","promptRules","promptOutput"];
  function syncPromptDrafts() {
    promptFieldIds.forEach(function (id) { drafts[id] = $("#" + id).value; });
    store.set(KEYS.drafts, JSON.stringify(drafts));
  }
  $$(".prompt-preset").forEach(function (button) {
    button.addEventListener("click", function () {
      var p = promptPresets[button.dataset.preset];
      $("#promptRole").value = p.role;
      $("#promptGoal").value = p.goal;
      $("#promptContext").value = p.context;
      $("#promptRules").value = p.rules;
      $("#promptOutput").value = p.output;
      syncPromptDrafts();
      updatePromptQuality();
      toast("Vorlage eingesetzt.");
    });
  });

  function updatePromptQuality() {
    var filled = promptFieldIds.filter(function (id) { return $("#" + id).value.trim().length > 0; }).length;
    var percent = Math.round((filled / promptFieldIds.length) * 100);
    $("#promptQuality").textContent = percent + "%";
    $("#promptQualityBar").style.width = percent + "%";
  }
  updatePromptQuality();

  function buildPrompt() {
    var values = [
      ["Rolle", $("#promptRole").value.trim()],
      ["Aufgabe / Ziel", $("#promptGoal").value.trim()],
      ["Kontext", $("#promptContext").value.trim()],
      ["Regeln / Grenzen", $("#promptRules").value.trim()],
      ["Gewünschte Ausgabe", $("#promptOutput").value.trim()]
    ];
    var parts = values.filter(function (item) { return item[1]; }).map(function (item) { return item[0] + ":\n" + item[1]; });
    $("#promptResult").textContent = parts.length ? parts.join("\n\n") : "Fülle mindestens ein Feld aus.";
    if (parts.length) markUse("prompt");
  }
  $("#buildPrompt").addEventListener("click", buildPrompt);
  $("#copyPrompt").addEventListener("click", function () { copyText($("#promptResult").textContent); });
  $("#clearPrompt").addEventListener("click", function () {
    promptFieldIds.forEach(function (id) { $("#" + id).value = ""; delete drafts[id]; });
    store.set(KEYS.drafts, JSON.stringify(drafts));
    $("#promptResult").textContent = "Dein strukturierter Prompt erscheint hier.";
    updatePromptQuality();
    toast("Prompt-Felder geleert.");
  });

  var commands = [
    { type:"linux", cmd:"pwd", note:"Zeigt den aktuellen Ordner." },
    { type:"linux", cmd:"ls -la", note:"Listet Dateien inklusive versteckter Einträge." },
    { type:"linux", cmd:"cd <ordner>", note:"Wechselt in einen Ordner. <ordner> ersetzen." },
    { type:"linux", cmd:"mkdir <name>", note:"Erstellt einen neuen Ordner." },
    { type:"linux", cmd:"cat <datei>", note:"Zeigt den Inhalt einer Textdatei an." },
    { type:"windows", cmd:"Get-Location", note:"Zeigt den aktuellen Ordner in PowerShell." },
    { type:"windows", cmd:"Get-ChildItem", note:"Listet Dateien und Ordner." },
    { type:"windows", cmd:"Set-Location <ordner>", note:"Wechselt in einen Ordner." },
    { type:"windows", cmd:"New-Item -ItemType Directory <name>", note:"Erstellt einen neuen Ordner." },
    { type:"windows", cmd:"Get-Content <datei>", note:"Zeigt den Inhalt einer Textdatei." },
    { type:"git", cmd:"git status", note:"Zeigt, welche Dateien geändert wurden." },
    { type:"git", cmd:"git diff", note:"Zeigt noch nicht committete Änderungen." },
    { type:"git", cmd:"git log --oneline -5", note:"Zeigt die letzten fünf Commits kompakt." },
    { type:"git", cmd:"git branch", note:"Zeigt lokale Branches; der aktuelle ist markiert." },
    { type:"git", cmd:"git add <datei>", note:"Nimmt eine Datei in den nächsten Commit auf." },
    { type:"git", cmd:"git commit -m \"kurze Nachricht\"", note:"Erstellt einen lokalen Commit mit Beschreibung." },
    { type:"git", cmd:"git restore <datei>", note:"Verwirft uncommittete Änderungen an einer Datei. Vorher git diff prüfen." }
  ];

  function makeCopyButton(text) {
    var button = document.createElement("button");
    button.className = "copy-mini";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", function () { copyText(text); markUse("terminal"); });
    return button;
  }
  function renderCommands() {
    var filter = $("#commandFilter").value;
    var query = $("#commandSearch").value.trim().toLowerCase();
    var box = $("#commandList");
    box.textContent = "";
    var filtered = commands.filter(function (c) {
      var typeMatch = filter === "all" || c.type === filter;
      var searchMatch = !query || (c.cmd + " " + c.note).toLowerCase().indexOf(query) !== -1;
      return typeMatch && searchMatch;
    });
    filtered.forEach(function (c) {
      var item = document.createElement("div");
      item.className = "command-item";
      var copy = document.createElement("div");
      var code = document.createElement("code");
      var note = document.createElement("small");
      code.textContent = c.cmd;
      note.textContent = c.note;
      copy.appendChild(code); copy.appendChild(note);
      item.appendChild(copy); item.appendChild(makeCopyButton(c.cmd));
      box.appendChild(item);
    });
    if (!filtered.length) {
      var empty = document.createElement("small");
      empty.className = "column-count";
      empty.textContent = "Kein passender Befehl.";
      box.appendChild(empty);
    }
  }
  $("#commandFilter").addEventListener("change", renderCommands);
  $("#commandSearch").addEventListener("input", renderCommands);
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
    markUse("email");
  });
  $("#copyEmail").addEventListener("click", function () { copyText($("#emailResult").textContent); });

  var defaultBoard = { todo:[{id:"sample-1",text:"Eine kleine Idee auswählen"}], doing:[], done:[] };
  var columns = [{id:"todo",title:"To do"},{id:"doing",title:"Doing"},{id:"done",title:"Done"}];
  function cloneDefaultBoard() { return JSON.parse(JSON.stringify(defaultBoard)); }
  function loadBoard() {
    var parsed = safeJson(store.get(KEYS.kanban), null);
    return parsed && Array.isArray(parsed.todo) && Array.isArray(parsed.doing) && Array.isArray(parsed.done) ? parsed : cloneDefaultBoard();
  }
  var board = loadBoard();
  function saveBoard() { store.set(KEYS.kanban, JSON.stringify(board)); updateDashboard(); }
  function boardCount() { return columns.reduce(function (sum, col) { return sum + board[col.id].length; }, 0); }
  function moveTask(from, index, direction) {
    var colIndex = columns.findIndex(function (c) { return c.id === from; });
    var targetIndex = colIndex + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    var task = board[from].splice(index, 1)[0];
    board[columns[targetIndex].id].push(task); saveBoard(); renderBoard(); markUse("kanban");
  }
  function removeTask(from, index) { board[from].splice(index, 1); saveBoard(); renderBoard(); }
  function taskButton(label, title, handler, disabled, className) {
    var button = document.createElement("button");
    button.type = "button"; button.textContent = label; button.setAttribute("aria-label", title);
    if (disabled) button.disabled = true; if (className) button.className = className;
    button.addEventListener("click", handler); return button;
  }
  function renderBoard() {
    var root = $("#kanbanBoard"); root.textContent = "";
    columns.forEach(function (col, colIndex) {
      var section = document.createElement("section"); section.className = "kanban-column"; section.setAttribute("aria-label", col.title);
      var head = document.createElement("div"); head.className = "column-head";
      var title = document.createElement("h4"); title.textContent = col.title;
      var count = document.createElement("span"); count.className = "column-count"; count.textContent = board[col.id].length;
      head.appendChild(title); head.appendChild(count); section.appendChild(head);
      if (!board[col.id].length) { var empty = document.createElement("small"); empty.className = "column-count"; empty.textContent = "Noch leer."; section.appendChild(empty); }
      board[col.id].forEach(function (task, taskIndex) {
        var card = document.createElement("div"); card.className = "task-card";
        var p = document.createElement("p"); p.textContent = task.text;
        var actions = document.createElement("div"); actions.className = "task-actions";
        actions.appendChild(taskButton("←","Aufgabe nach links verschieben",function(){moveTask(col.id,taskIndex,-1);},colIndex===0));
        actions.appendChild(taskButton("→","Aufgabe nach rechts verschieben",function(){moveTask(col.id,taskIndex,1);},colIndex===columns.length-1));
        actions.appendChild(taskButton("×","Aufgabe löschen",function(){removeTask(col.id,taskIndex);},false,"remove"));
        card.appendChild(p); card.appendChild(actions); section.appendChild(card);
      });
      root.appendChild(section);
    });
    $("#taskCountTag").textContent = boardCount() + (boardCount() === 1 ? " TASK" : " TASKS");
    updateDashboard();
  }
  $("#taskForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var input = $("#taskInput"); var text = input.value.trim(); if (!text) return;
    var col = $("#taskColumn").value; board[col].push({id:String(Date.now()),text:text}); input.value = ""; saveBoard(); renderBoard(); input.focus(); markUse("kanban");
  });
  $("#resetKanban").addEventListener("click", function () { board = cloneDefaultBoard(); saveBoard(); renderBoard(); toast("Board zurückgesetzt."); });
  renderBoard();

  function parseJson() {
    var raw = $("#jsonInput").value.trim(); if (!raw) throw new Error("Bitte zuerst JSON einfügen."); return JSON.parse(raw);
  }
  function setJsonStatus(message, type) { var status = $("#jsonStatus"); status.textContent = message; status.className = "status " + (type || ""); }
  $("#validateJson").addEventListener("click", function () { try { parseJson(); setJsonStatus("Gültiges JSON.","ok"); markUse("json"); } catch(e){ setJsonStatus("Fehler: "+e.message,"error"); } });
  $("#formatJson").addEventListener("click", function () { try { $("#jsonInput").value = JSON.stringify(parseJson(),null,2); setJsonStatus("Gültiges JSON — formatiert.","ok"); markUse("json"); } catch(e){ setJsonStatus("Fehler: "+e.message,"error"); } });
  $("#minifyJson").addEventListener("click", function () { try { $("#jsonInput").value = JSON.stringify(parseJson()); setJsonStatus("Gültiges JSON — verkleinert.","ok"); markUse("json"); } catch(e){ setJsonStatus("Fehler: "+e.message,"error"); } });
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
    var parsed = safeJson(store.get(KEYS.checklist), null);
    return Array.isArray(parsed) && parsed.length === checklistItems.length ? parsed : checklistItems.map(function(){return false;});
  }
  var checklistState = loadChecklist();
  function saveChecklist() { store.set(KEYS.checklist, JSON.stringify(checklistState)); updateDashboard(); }
  function checklistDone() { return checklistState.filter(Boolean).length; }
  function updateChecklistProgress() {
    var done = checklistDone(); var percent = Math.round((done / checklistItems.length) * 100);
    $("#checkProgress").textContent = done + " von " + checklistItems.length + " erledigt";
    $("#checkProgressBar").style.width = percent + "%"; updateDashboard();
  }
  function renderChecklist() {
    var root = $("#projectChecklist"); root.textContent = "";
    checklistItems.forEach(function (item,index) {
      var label = document.createElement("label"); label.className = "check-row";
      var input = document.createElement("input"); input.type = "checkbox"; input.checked = checklistState[index];
      var span = document.createElement("span"); var strong = document.createElement("strong"); var small = document.createElement("small");
      strong.textContent = item[0]; small.textContent = item[1]; span.appendChild(strong); span.appendChild(small); label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () { checklistState[index] = input.checked; saveChecklist(); updateChecklistProgress(); markUse("project"); });
      root.appendChild(label);
    });
    updateChecklistProgress();
  }
  $("#resetChecklist").addEventListener("click", function () { checklistState = checklistItems.map(function(){return false;}); saveChecklist(); renderChecklist(); toast("Checkliste zurückgesetzt."); });
  renderChecklist();

  var missions = [
    ["BEGINNER","Baue eine HTML-Seite mit einer Überschrift, einem Absatz und einem Button. Der Button soll den Text ändern."],
    ["BEGINNER","Erstelle drei Git-Commits für drei kleine Änderungen und lies danach git log --oneline -5."],
    ["BEGINNER","Nimm einen langen Prompt und strukturiere ihn in Rolle, Ziel, Kontext, Regeln und Ausgabe."],
    ["BEGINNER","Lege eine JSON-Datei mit drei Lieblingsprojekten an und validiere sie mit dem JSON Lab."],
    ["BEGINNER+","Baue einen lokalen Zähler mit + und − und speichere den Wert in localStorage."],
    ["BEGINNER+","Erstelle für ein Mini-Projekt ein README mit Ziel, Startanleitung, Features und nächstem Schritt."],
    ["BEGINNER+","Baue eine kleine Suchleiste, die eine Liste von fünf Einträgen live filtert."],
    ["CREATIVE","Entwirf eine Startseite für ein fiktives Tool: ein klares Problem, ein Hero-Text und genau drei Features."],
    ["CREATIVE","Erfinde ein 30-Minuten-Mini-Tool, das dir selbst jeden Tag einen Klick spart."]
  ];
  var lastMission = -1;
  function newMission() {
    var index = Math.floor(Math.random() * missions.length); if (missions.length > 1 && index === lastMission) index = (index + 1) % missions.length;
    lastMission = index; $("#missionLevel").textContent = missions[index][0]; $("#missionText").textContent = missions[index][1]; markUse("mission");
  }
  $("#newMission").addEventListener("click", newMission);
  $("#copyMission").addEventListener("click", function () { copyText($("#missionLevel").textContent + ": " + $("#missionText").textContent); });

  function updateDashboard() {
    if (!$("#dashboardProgress")) return;
    var progress = Math.round((checklistDone() / checklistItems.length) * 100);
    $("#dashboardProgress").textContent = progress + "%";
    $("#dashboardTasks").textContent = boardCount();
    $("#dashboardUses").textContent = usageTotal();
  }
  updateDashboard();

  function exportBackup() {
    var payload = {
      app: "Nexus Luna Toolkit",
      version: 2,
      exportedAt: new Date().toISOString(),
      data: {
        theme: currentTheme(),
        kanban: board,
        checklist: checklistState,
        drafts: drafts,
        usage: usage
      }
    };
    var blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    var url = URL.createObjectURL(blob); var a = document.createElement("a");
    a.href = url; a.download = "nexus-luna-toolkit-backup.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); toast("Backup exportiert.");
  }
  $("#exportData").addEventListener("click", exportBackup);

  $("#importData").addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var payload = JSON.parse(reader.result); var data = payload && payload.data;
        if (!data || !data.kanban || !Array.isArray(data.checklist)) throw new Error("Ungültiges Backup-Format.");
        if (data.theme === "light" || data.theme === "dark") applyTheme(data.theme);
        board = data.kanban; checklistState = data.checklist; drafts = data.drafts || {}; usage = data.usage || {};
        store.set(KEYS.kanban,JSON.stringify(board)); store.set(KEYS.checklist,JSON.stringify(checklistState)); store.set(KEYS.drafts,JSON.stringify(drafts)); store.set(KEYS.usage,JSON.stringify(usage));
        renderBoard(); renderChecklist(); updateDashboard();
        $$('[data-draft]').forEach(function(field){ var key=field.dataset.draft; if(Object.prototype.hasOwnProperty.call(drafts,key)) field.value=drafts[key]; });
        updatePromptQuality(); toast("Backup importiert.");
      } catch (e) { toast("Import fehlgeschlagen: " + e.message); }
      event.target.value = "";
    };
    reader.readAsText(file);
  });

  $("#resetAllData").addEventListener("click", function () {
    if (!window.confirm("Wirklich alle lokalen Toolkit-Daten löschen?")) return;
    Object.keys(KEYS).forEach(function (key) { store.remove(KEYS[key]); });
    board = cloneDefaultBoard(); checklistState = checklistItems.map(function(){return false;}); drafts = {}; usage = {};
    applyTheme("dark"); renderBoard(); renderChecklist(); updateDashboard();
    $$('[data-draft]').forEach(function(field){ field.value = ""; });
    $("#promptResult").textContent = "Dein strukturierter Prompt erscheint hier."; $("#emailResult").textContent = "Dein E-Mail-Starter erscheint hier."; updatePromptQuality();
    toast("Lokale Daten gelöscht.");
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").catch(function () {});
    });
  }
}());
