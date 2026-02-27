// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let searchCount = 0,
    launchCancelled = false;
let history = [],
    savedDorks = [],
    checklistState = {},
    favorites = [],
    savedTargets = [];
let exportContent = "",
    exportFilename = "";

function ls(k, d = []) {
    try {
        return JSON.parse(
            localStorage.getItem(k) || JSON.stringify(d),
        );
    } catch (x) {
        return d;
    }
}
function lsSet(k, v) {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch (x) { }
}

history = ls("bbse_history", []);
savedDorks = ls("bbse_saved", []);
checklistState = ls("bbse_checklist", {});
favorites = ls("bbse_favorites", []);
savedTargets = ls("bbse_targets", []);

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
function init() {
    const container = document.getElementById(
        "dork-sections-container",
    );
    const cats = [
        "recon",
        "files",
        "vulns",
        "cms",
        "cloud",
        "api",
        "osint",
        "flash",
    ];
    const catColors = {
        recon: "var(--cat-recon)",
        files: "var(--cat-files)",
        vulns: "var(--cat-vulns)",
        cms: "var(--cat-cms)",
        cloud: "var(--cat-cloud)",
        api: "var(--cat-api)",
        osint: "var(--cat-osint)",
        flash: "var(--cat-flash)",
    };
    container.innerHTML = cats
        .map((cat) => {
            const dorks = DORKS.filter((d) => d.cat === cat);
            return `<div class="category-section" data-cat="${cat}">
      <div class="category-header">
<div class="category-dot" style="background:${catColors[cat]}"></div>
<span class="category-title" style="color:${catColors[cat]}">${cat.toUpperCase()}</span>
<span class="category-count" id="count-${cat}">${dorks.length} dorks</span>
      </div>
      <div class="btn-grid" id="grid-${cat}">
${dorks.map((d) => dorkBtn(d)).join("")}
      </div>
    </div>`;
        })
        .join("");
    document.getElementById("stat-total").textContent =
        DORKS.length;
    document.getElementById("fav-count").textContent =
        favorites.length;
    renderHistory();
    renderSavedDorks();
    renderChecklist();
    updateChecklistStats();
    renderFavorites();
    renderTargets();
    updateBuilderPreview();
    loadNotes();
    loadScope();
    loadTheme();
}

function dorkBtn(d) {
    const isFav = favorites.includes(String(d.id));
    return `<button class="dork-btn cat-${d.cat}${isFav ? " favorited" : ""}" data-id="${d.id}" data-label="${d.label.toLowerCase()}" onclick="runSearch('${d.id}')">
    ${d.label}
    <span class="btn-actions">
      <span class="btn-action-icon" title="Copy URL" onclick="copyDork(event,'${d.id}')">Copy</span>
      <span class="btn-action-icon" title="${isFav ? "Unfavorite" : "Favorite"}" onclick="toggleFav(event,'${d.id}')">${isFav ? "*" : "+"}</span>
    </span>
  </button>`;
}

// ══════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
    init();
});
// ══════════════════════════════════════════
// DOMAIN VALIDATION
// ══════════════════════════════════════════
function cleanDomain(raw) {
    return raw
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/^\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}
function validateInput(input) {
    const cleaned = cleanDomain(input.value);
    if (cleaned !== input.value.trim()) input.value = cleaned;
    const val = cleaned,
        hint = document.getElementById("input-hint");
    if (!val) {
        input.classList.remove("invalid");
        hint.textContent = "Paste any URL — auto-cleaned. Press Enter to lock.";
        hint.className = "input-hint";
        return true;
    }
    input.classList.remove("invalid");
    hint.textContent = `Target: ${val}`;
    hint.className = "input-hint success";
    return true;
}
function handleEnter(ev) {
    if (ev.key === "Enter") {
        const d = getTarget();
        if (d) toast(`Target: ${d}`, "success");
    }
}
function getTarget() {
    const input = document.getElementById("target");
    input.value = cleanDomain(input.value);
    // Allow empty target
    return input.value;
}
// ══════════════════════════════════════════
// SAVED TARGETS
// ══════════════════════════════════════════
function saveTarget() {
    const domain = getTarget();
    if (!domain) return;
    if (savedTargets.includes(domain)) {
        toast("Target already saved", "warn");
        return;
    }
    savedTargets.push(domain);
    lsSet("bbse_targets", savedTargets);
    renderTargets();
    toast(`💾 Saved: ${domain}`, "success");
}
function loadTarget(domain) {
    document.getElementById("target").value = domain;
    validateInput(document.getElementById("target"));
    toast(`Target: ${domain}`, "success");
}
function deleteTarget(domain) {
    savedTargets = savedTargets.filter((t) => t !== domain);
    lsSet("bbse_targets", savedTargets);
    renderTargets();
}
function renderTargets() {
    const wrap = document.getElementById("targets-row-wrap");
    const pills = document.getElementById("targets-pills");
    if (!savedTargets.length) {
        wrap.classList.remove("visible");
        return;
    }
    wrap.classList.add("visible");
    pills.innerHTML = savedTargets
        .map(
            (t) => `
    <div class="target-pill" onclick="loadTarget('${t}')">
      ${t}<span class="del-pill" onclick="event.stopPropagation();deleteTarget('${t}')">✕</span>
    </div>`,
        )
        .join("");
}
// ══════════════════════════════════════════
// TABS
// ══════════════════════════════════════════
function switchTab(id, btn) {
    document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
    document
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("active"));
    if (btn) btn.classList.add("active");
    else
        document
            .querySelector(`[data-tab="${id}"]`)
            ?.classList.add("active");
    document.getElementById("tab-" + id).classList.add("active");
}

// ══════════════════════════════════════════
// THEME
// ══════════════════════════════════════════
function loadTheme() {
    const t = localStorage.getItem("bbse_theme") || "dark";
    if (t === "light") {
        document.documentElement.setAttribute(
            "data-theme",
            "light",
        );
        document.getElementById("theme-btn").textContent = "Dark";
    } else {
        document.documentElement.setAttribute(
            "data-theme",
            "dark",
        );
        document.getElementById("theme-btn").textContent = "Light";
    }
}
function toggleTheme() {
    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute(
        "data-theme",
        isDark ? "light" : "dark",
    );
    document.getElementById("theme-btn").textContent = isDark
        ? "Dark"
        : "Light";
    localStorage.setItem("bbse_theme", isDark ? "light" : "dark");
    toast(isDark ? "Light mode active" : "Dark mode active", "success");
}
// ══════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
function showKbModal() {
    document.getElementById("kb-modal").classList.add("active");
}
function closeKbModal() {
    document.getElementById("kb-modal").classList.remove("active");
}
document.addEventListener("keydown", (ev) => {
    if (
        ev.target.tagName === "INPUT" ||
        ev.target.tagName === "TEXTAREA"
    )
        return;
    if (ev.key === "?") {
        showKbModal();
        return;
    }
    if (ev.key === "Escape") {
        closeKbModal();
        document
            .getElementById("launch-overlay")
            .classList.remove("active");
        return;
    }
    if (ev.ctrlKey || ev.metaKey) {
        const tabs = [
            "dorks",
            "ai",
            "favorites",
            "builder",
            "checklist",
            "notes",
            "scope",
            "export",
            "methodology",
            "exploits",
        ];
        const num = parseInt(ev.key);
        if (num >= 1 && num <= 10) {
            ev.preventDefault();
            switchTab(tabs[num - 1], null);
            return;
        }
        if (ev.key === "k") {
            ev.preventDefault();
            document.getElementById("target").focus();
            return;
        }
        if (ev.key === "f") {
            ev.preventDefault();
            document.getElementById("dork-search")?.focus();
            return;
        }
        if (ev.key === "s") {
            ev.preventDefault();
            saveTarget();
            return;
        }
    }
});
// ══════════════════════════════════════════
// TOAST (multi-stack)
// ══════════════════════════════════════════
function toast(msg, type = "") {
    const stack = document.getElementById("toast-stack");
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    stack.appendChild(el);
    requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add("show")),
    );
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 300);
    }, 2400);
}
