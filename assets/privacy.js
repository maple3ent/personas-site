(function () {
  // Configure per-page by adding a <meta name="privacy" content="public|unlisted|pin">
  // and (optional) <meta name="pin" content="1234">
  const privacy = document.querySelector('meta[name="privacy"]')?.content || "public";
  const pin = document.querySelector('meta[name="pin"]')?.content || "";

  if (privacy === "unlisted") {
    // Soft privacy: discourage indexing
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex,nofollow";
    document.head.appendChild(robots);
    return;
  }

  if (privacy === "pin" && pin) {
    const key = "persona_access_" + location.pathname;
    if (localStorage.getItem(key) === "granted") return;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,.88)";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";
    overlay.style.zIndex = "9999";
    overlay.innerHTML = `
      <div style="max-width:420px;width:92%;border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:18px;background:rgba(255,255,255,.06);">
        <h2 style="margin:0 0 8px;">Private profile</h2>
        <p style="margin:0 0 12px;opacity:.8;">Enter PIN to view.</p>
        <input id="pinInput" type="password" inputmode="numeric"
               style="width:100%;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.25);color:#fff;"
               placeholder="PIN" />
        <button id="pinBtn"
          style="margin-top:10px;width:100%;padding:12px;border-radius:12px;border:1px solid rgba(124,92,255,.6);background:rgba(124,92,255,.22);color:#fff;cursor:pointer;">
          Unlock
        </button>
        <p id="pinErr" style="margin:10px 0 0;color:#ffb4b4;display:none;">Wrong PIN.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    function tryUnlock() {
      const val = document.getElementById("pinInput").value;
      if (val === pin) {
        localStorage.setItem(key, "granted");
        overlay.remove();
      } else {
        document.getElementById("pinErr").style.display = "block";
      }
    }

    overlay.querySelector("#pinBtn").addEventListener("click", tryUnlock);
    overlay.querySelector("#pinInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryUnlock();
    });
  }
})();
