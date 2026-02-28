// ══════════════════════════════════════════
// CHECKLIST
// ══════════════════════════════════════════
function renderChecklist() {
    const c = document.getElementById("checklist-container");
    c.innerHTML = CHECKLIST.map(
        (s) => `
    <div class="checklist-section-header">${s.section}</div>
    <div class="checklist-grid">${s.items
                .map((item) => {
                    const done = !!checklistState[item.id];
                    return `
      <div class="checklist-item${done ? " done" : ""}" onclick="toggleCheck('${item.id}')">
<div class="check-box">${done ? "✓" : ""}</div>
<div><div class="check-text">${item.label}</div><div class="check-sub">${item.sub}</div></div>
      </div>`;
                })
                .join("")}
    </div>`,
    ).join("");
}
function toggleCheck(id) {
    checklistState[id] = !checklistState[id];
    lsSet("bbse_checklist", checklistState);
    renderChecklist();
    updateChecklistStats();
}
function updateChecklistStats() {
    const total = CHECKLIST.reduce((s, c) => s + c.items.length, 0);
    const done =
        Object.values(checklistState).filter(Boolean).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("checklist-bar").style.width =
        pct + "%";
    document.getElementById("checklist-prog-text").textContent =
        `${done} / ${total}`;
    document.getElementById("checklist-pct").textContent =
        pct + "%";
}
function resetChecklist() {
    if (!confirm("Reset?")) return;
    checklistState = {};
    lsSet("bbse_checklist", {});
    renderChecklist();
    updateChecklistStats();
    toast("Reset", "warn");
}

// ══════════════════════════════════════════
// NOTES
// ══════════════════════════════════════════
function loadNotes() {
    const notes = localStorage.getItem("bbse_notes") || "";
    document.getElementById("notes-area").value = notes;
    updateNotesCount(notes);
    document.getElementById("notes-save-status").textContent = notes
        ? "Loaded from storage"
        : "Empty";
}
function saveNotes() {
    const val = document.getElementById("notes-area").value;
    localStorage.setItem("bbse_notes", val);
    updateNotesCount(val);
    document.getElementById("notes-save-status").textContent =
        "Saved " +
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
}
function updateNotesCount(val) {
    document.getElementById("notes-char-count").textContent =
        val.length +
        " chars / " +
        val.split("\n").length +
        " lines";
}
function insertNote(text) {
    const ta = document.getElementById("notes-area");
    const start = ta.selectionStart;
    ta.value =
        ta.value.slice(0, start) + text + ta.value.slice(start);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.focus();
    saveNotes();
}
function copyNotes() {
    navigator.clipboard
        .writeText(document.getElementById("notes-area").value)
        .then(() => toast(" Copied", "success"));
}
function clearNotes() {
    if (!confirm("Clear all notes?")) return;
    document.getElementById("notes-area").value = "";
    saveNotes();
    toast("Notes cleared", "warn");
}
function exportNotes() {
    const val = document.getElementById("notes-area").value;
    if (!val) {
        toast("No notes", "error");
        return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([val], { type: "text/plain" }),
    );
    a.download = `recon-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    toast("⬇ Exported", "success");
}

// ══════════════════════════════════════════
// SCOPE CHECKER
// ══════════════════════════════════════════
function loadScope() {
    document.getElementById("scope-input").value =
        localStorage.getItem("bbse_scope") || "";
    document.getElementById("program-notes").value =
        localStorage.getItem("bbse_program") || "";
}
function saveScopeList() {
    localStorage.setItem(
        "bbse_scope",
        document.getElementById("scope-input").value,
    );
}
function saveProgramNotes() {
    localStorage.setItem(
        "bbse_program",
        document.getElementById("program-notes").value,
    );
}
function checkScope() {
    const raw = document
        .getElementById("scope-check-input")
        .value.trim();
    const result = document.getElementById("scope-result");
    if (!raw) {
        result.textContent = "Enter a domain above.";
        result.className = "";
        return;
    }
    const domain = cleanDomain(raw);
    const scopeLines = document
        .getElementById("scope-input")
        .value.split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    if (!scopeLines.length) {
        result.innerHTML =
            '<span class="scope-warn">⚠ No scope defined above.</span>';
        return;
    }

    const matched = scopeLines.find((s) => {
        const pattern = s
            .replace(/\./g, "\\.")
            .replace(/\*/g, "[^.]+");
        return new RegExp("^" + pattern + "$", "i").test(domain);
    });

    if (matched) {
        result.innerHTML = `<span class="scope-in">✓ IN SCOPE — matches "${matched}"</span>`;
    } else {
        result.innerHTML = `<span class="scope-out">✗ OUT OF SCOPE — no matching pattern found</span>`;
    }
}

// ══════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════
function runExport(type) {
    const domain = document.getElementById("target").value
        ? cleanDomain(document.getElementById("target").value)
        : "TARGET";
    const ts = new Date().toISOString().slice(0, 10);
    let content = "",
        filename = "";
    if (type === "txt") {
        content =
            `# DorkHunt Export — ${domain} — ${ts}\n\n` +
            DORKS.map(
                (d) =>
                    `[${d.cat.toUpperCase()}] ${d.label}\n${getDorkUrl(d, domain || "TARGET")}`,
            ).join("\n\n");
        filename = `dorks-${domain}-${ts}.txt`;
    } else if (type === "markdown") {
        content = `# 🎯 DorkHunt Report\n**Target:** \`${domain}\`  \n**Date:** ${ts}\n\n`;
        [...new Set(DORKS.map((d) => d.cat))].forEach((cat) => {
            content += `## ${cat.toUpperCase()}\n\n`;
            DORKS.filter((d) => d.cat === cat).forEach((d) => {
                content += `- [${d.label}](${getDorkUrl(d, domain || "TARGET")})\n`;
            });
            content += "\n";
        });
        filename = `dorks-${domain}-${ts}.md`;
    } else if (type === "urls") {
        content = DORKS.map((d) =>
            getDorkUrl(d, domain || "TARGET"),
        ).join("\n");
        filename = `dork-urls-${domain}-${ts}.txt`;
    } else if (type === "json") {
        content = JSON.stringify(
            {
                target: domain,
                exported: ts,
                total: DORKS.length,
                dorks: DORKS.map((d) => ({
                    id: d.id,
                    cat: d.cat,
                    label: d.label,
                    url: getDorkUrl(d, domain || "TARGET"),
                })),
            },
            null,
            2,
        );
        filename = `dorks-${domain}-${ts}.json`;
    } else if (type === "history") {
        content = history.length
            ? history
                .map(
                    (h) =>
                        `[${h.time}] ${h.domain} | ${h.action}\n${h.url}`,
                )
                .join("\n\n")
            : "No history.";
        filename = `history-${ts}.txt`;
    } else if (type === "saved") {
        content = savedDorks.length
            ? savedDorks
                .map(
                    (d) =>
                        `# ${d.name} [${d.engine}]\n${d.query}`,
                )
                .join("\n\n")
            : "No saved dorks.";
        filename = `saved-dorks-${ts}.txt`;
    } else if (type === "notes") {
        content = localStorage.getItem("bbse_notes") || "No notes.";
        filename = `recon-notes-${domain}-${ts}.txt`;
    } else if (type === "favorites") {
        const favDorks = DORKS.filter((d) =>
            favorites.includes(String(d.id)),
        );
        content = favDorks.length
            ? favDorks
                .map(
                    (d) =>
                        `[${d.cat}] ${d.label}\n${getDorkUrl(d, domain || "TARGET")}`,
                )
                .join("\n\n")
            : "No favorites.";
        filename = `favorites-${ts}.txt`;
    }
    exportContent = content;
    exportFilename = filename;
    const area = document.getElementById("export-preview");
    area.textContent =
        content.slice(0, 2500) +
        (content.length > 2500 ? "\n\n...(truncated)" : "");
    area.classList.add("visible");
    document.getElementById("export-action-btns").style.display =
        "flex";
    toast(`Preview ready — ${filename}`, "success");
}
function downloadExport() {
    if (!exportContent) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([exportContent], { type: "text/plain" }),
    );
    a.download = exportFilename;
    a.click();
    toast("⬇ Downloaded", "success");
}
function copyExport() {
    if (!exportContent) return;
    navigator.clipboard
        .writeText(exportContent)
        .then(() => toast(" Copied", "success"))
        .catch(() => toast("Failed", "error"));
}

// ══════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════
function addHistory(domain, action, url) {
    history.unshift({
        domain,
        action,
        url,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    });
    if (history.length > 50) history = history.slice(0, 50);
    lsSet("bbse_history", history);
    renderHistory();
}
function renderHistory() {
    const list = document.getElementById("history-list");
    if (!history.length) {
        list.innerHTML =
            '<div class="empty-history">No searches yet.</div>';
        return;
    }
    list.innerHTML = history
        .map(
            (item) => `
    <div class="history-item" onclick="window.open(${JSON.stringify(item.url)},'_blank')">
      <span class="history-domain">${item.domain}</span>
      <span class="history-action">${item.action}</span>
      <span class="history-time">${item.time}</span>
    </div>`,
        )
        .join("");
}
function clearHistory() {
    history = [];
    lsSet("bbse_history", []);
    renderHistory();
    toast("Cleared", "warn");
}
function exportHistory() {
    if (!history.length) {
        toast("No history", "error");
        return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob(
            [
                history
                    .map(
                        (h) =>
                            `[${h.time}] ${h.domain} | ${h.action}\n${h.url}`,
                    )
                    .join("\n\n"),
            ],
            { type: "text/plain" },
        ),
    );
    a.download = `history-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    toast("⬇ Exported", "success");
}
