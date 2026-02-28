// ══════════════════════════════════════════
// RUN SEARCH
// ══════════════════════════════════════════
function runSearch(id) {
    const domain = getTarget();
    if (domain === null) return;
    const dork = DORKS.find((d) => String(d.id) === String(id));
    if (!dork) {
        toast("Unknown dork", "error");
        return;
    }
    const url = getDorkUrl(dork, domain);
    window.open(url, "_blank");
    searchCount++;
    document.getElementById("search-count").textContent =
        searchCount;
    addHistory(domain || "(no target)", dork.label, url);
    toast(` ${dork.label}`, "success");
}
function getDorkUrl(dork, domain) {
    if (dork.url) return dork.url(domain);
    if (dork.query)
        return (
            "https://www.google.com/search?q=" +
            enc(dork.query(domain))
        );
    return "#";
}
function copyDork(ev, id) {
    ev.stopPropagation();
    const domain = getTarget();
    if (domain === null) return;
    const dork = DORKS.find((d) => String(d.id) === String(id));
    if (!dork) return;
    navigator.clipboard
        .writeText(getDorkUrl(dork, domain))
        .then(() => toast(" Copied!", "success"))
        .catch(() => toast("Copy failed", "error"));
}
// ══════════════════════════════════════════
// FAVORITES
// ══════════════════════════════════════════
function toggleFav(ev, id) {
    ev.stopPropagation();
    const sid = String(id);
    if (favorites.includes(sid))
        favorites = favorites.filter((f) => f !== sid);
    else favorites.push(sid);
    lsSet("bbse_favorites", favorites);
    document.getElementById("fav-count").textContent =
        favorites.length;
    init(); // re-render
    toast(
        favorites.includes(sid)
            ? " Added to favorites"
            : "Removed from favorites",
        "success",
    );
}
function renderFavorites() {
    const grid = document.getElementById("favorites-grid");
    const favDorks = DORKS.filter((d) =>
        favorites.includes(String(d.id)),
    );
    if (!favDorks.length) {
        grid.innerHTML =
            '<div class="fav-empty" style="grid-column:1/-1">No favorites yet. Hover any dork and click ☆ to add it here.</div>';
        return;
    }
    grid.innerHTML = favDorks.map((d) => dorkBtn(d)).join("");
}
async function launchFavorites() {
    const domain = getTarget();
    if (domain === null) return;
    const favDorks = DORKS.filter((d) =>
        favorites.includes(String(d.id)),
    );
    if (!favDorks.length) {
        toast("No favorites yet!", "warn");
        return;
    }
    launchDorks(favDorks, domain, "Favorites");
}

// ══════════════════════════════════════════
// LAUNCH ALL / CATEGORY
// ══════════════════════════════════════════
function launchAll() {
    const domain = getTarget();
    if (domain === null) return;
    launchDorks(DORKS, domain, "All");
}
function launchCategory() {
    const domain = getTarget();
    if (domain === null) return;
    const cat =
        document.querySelector(".filter-btn.active")?.dataset
            ?.cat || "all";
    const list =
        cat === "all" ? DORKS : DORKS.filter((d) => d.cat === cat);
    launchDorks(list, domain, cat.toUpperCase());
}
async function launchDorks(list, domain, label) {
    if (
        !confirm(
            `Open ${list.length} tabs${domain ? ` for "${domain}"` : ""}?\n\nAllow popups if your browser blocks them.`,
        )
    )
        return;
    launchCancelled = false;
    const overlay = document.getElementById("launch-overlay"),
        fill = document.getElementById("launch-fill"),
        status = document.getElementById("launch-status");
    overlay.classList.add("active");
    for (let i = 0; i < list.length; i++) {
        if (launchCancelled) break;
        const d = list[i];
        fill.style.width =
            Math.round(((i + 1) / list.length) * 100) + "%";
        status.textContent = `[${i + 1}/${list.length}] ${d.label}`;
        window.open(getDorkUrl(d, domain), "_blank");
        searchCount++;
        addHistory(domain, d.label, getDorkUrl(d, domain));
        await new Promise((r) => setTimeout(r, 800));
    }
    document.getElementById("search-count").textContent =
        searchCount;
    overlay.classList.remove("active");
    if (!launchCancelled)
        toast(`✅ Launched ${list.length} dorks`, "success");
}
function cancelLaunch() {
    launchCancelled = true;
    document
        .getElementById("launch-overlay")
        .classList.remove("active");
    toast("Cancelled", "warn");
}

// ══════════════════════════════════════════
// FILTERS + DORK SEARCH
// ══════════════════════════════════════════
function filterCategory(cat) {
    document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
    document
        .querySelector(`[data-cat="${cat}"]`)
        .classList.add("active");
    document
        .querySelectorAll(".category-section[data-cat]")
        .forEach((s) =>
            s.classList.toggle(
                "hidden",
                cat !== "all" && s.dataset.cat !== cat,
            ),
        );
    document.getElementById("dork-search").value = "";
    searchDorks("");
}
function searchDorks(q) {
    q = q.toLowerCase().trim();
    document
        .querySelectorAll(".dork-btn")
        .forEach((btn) =>
            btn.classList.toggle(
                "btn-hidden",
                !!(q && !btn.dataset.label.includes(q)),
            ),
        );
}
