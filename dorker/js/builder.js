// ══════════════════════════════════════════
// CUSTOM BUILDER
// ══════════════════════════════════════════
function updateBuilderPreview() {
    const domain = document.getElementById("target").value
        ? cleanDomain(document.getElementById("target").value)
        : "target.com";
    const op = document.getElementById("b-op").value,
        val = document.getElementById("b-val").value.trim(),
        mod = document.getElementById("b-mod").value.trim();
    let q =
        op === "custom"
            ? (val + (mod ? " " + mod : "")).trim()
            : val
                ? `site:${domain} ${op}${val}${mod ? " " + mod : ""}`
                : "";
    document.getElementById("builder-preview").textContent =
        q || "Fill in fields above...";
}
function getBuilderQuery() {
    const domain = getTarget() || "target.com",
        op = document.getElementById("b-op").value;
    const val = document.getElementById("b-val").value.trim(),
        mod = document.getElementById("b-mod").value.trim();
    if (!val && op !== "custom") {
        toast("Enter a value first", "error");
        return null;
    }
    return op === "custom"
        ? val + (mod ? " " + mod : "")
        : `site:${domain} ${op}${val}${mod ? " " + mod : ""}`;
}
function getBuilderUrl(q) {
    const e2 = {
        google: "https://www.google.com/search?q=",
        bing: "https://www.bing.com/search?q=",
        duckduckgo: "https://duckduckgo.com/?q=",
        yandex: "https://yandex.com/search/?text=",
    };
    return (
        (e2[document.getElementById("b-engine").value] ||
            e2.google) + enc(q)
    );
}
function runBuilderSearch() {
    const q = getBuilderQuery();
    if (!q) return;
    window.open(getBuilderUrl(q), "_blank");
    addHistory(getTarget() || "custom", q, getBuilderUrl(q));
    searchCount++;
    document.getElementById("search-count").textContent =
        searchCount;
    toast(" Launched", "success");
}
function copyBuilderQuery() {
    const q = getBuilderQuery();
    if (!q) return;
    navigator.clipboard
        .writeText(q)
        .then(() => toast(" Copied", "success"))
        .catch(() => toast("Failed", "error"));
}
function saveBuilderDork() {
    const q = getBuilderQuery();
    if (!q) return;
    const name = prompt("Name this dork:");
    if (!name) return;
    savedDorks.unshift({
        name: name.trim(),
        query: q,
        engine: document.getElementById("b-engine").value,
        ts: Date.now(),
    });
    if (savedDorks.length > 50)
        savedDorks = savedDorks.slice(0, 50);
    lsSet("bbse_saved", savedDorks);
    renderSavedDorks();
    toast(" Saved", "success");
}
function clearBuilder() {
    ["b-val", "b-mod"].forEach(
        (id) => (document.getElementById(id).value = ""),
    );
    document.getElementById("b-op").value = "site:";
    document.getElementById("b-engine").value = "google";
    updateBuilderPreview();
}
function renderSavedDorks() {
    const list = document.getElementById("saved-dorks-list");
    document.getElementById("saved-count").textContent =
        savedDorks.length ? `(${savedDorks.length})` : "";
    if (!savedDorks.length) {
        list.innerHTML =
            '<div class="empty-saved">No saved dorks yet.</div>';
        return;
    }
    list.innerHTML = savedDorks
        .map(
            (d, i) => `
    <div class="saved-dork-item" onclick="runSavedDork(${i})">
      <span class="saved-dork-name" style="color:var(--accent)">${d.name}</span>
      <span class="saved-dork-query">${d.query}</span>
      <span style="font-size:10px;color:var(--muted);flex-shrink:0;">${d.engine || "google"}</span>
      <button class="saved-dork-del" onclick="deleteSavedDork(event,${i})">x</button>
    </div>`,
        )
        .join("");
}
function runSavedDork(i) {
    const d = savedDorks[i];
    const e2 = {
        google: "https://www.google.com/search?q=",
        bing: "https://www.bing.com/search?q=",
        duckduckgo: "https://duckduckgo.com/?q=",
        yandex: "https://yandex.com/search/?text=",
    };
    const url = (e2[d.engine] || e2.google) + enc(d.query);
    window.open(url, "_blank");
    addHistory(getTarget() || "custom", d.name, url);
    searchCount++;
    document.getElementById("search-count").textContent =
        searchCount;
    toast(` ${d.name}`, "success");
}
function deleteSavedDork(ev, i) {
    ev.stopPropagation();
    savedDorks.splice(i, 1);
    lsSet("bbse_saved", savedDorks);
    renderSavedDorks();
    toast("Deleted", "warn");
}
