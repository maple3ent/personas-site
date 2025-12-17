(function () {
  // Hide page immediately to prevent flash of content before gate runs
  try {
    const style = document.createElement("style");
    style.id = "privacy-hide";
    style.textContent = "html{visibility:hidden}";
    document.head.appendChild(style);
  } catch (_) {}

  function meta(name) {
    return document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || "";
  }

  function showPage() {
    const style = document.getElementById("privacy-hide");
    if (style) style.remove();
    document.documentElement.style.visibility = "visible";
  }

  function blockPage(message) {
    // Replace the entire body with a simple blocked message
    showPage();
    document.body.innerHTML = `
      <main class="container">
        <section class="card">
          <h2>Access restricted</h2>
          <p class="muted">${message}</p>
          <p class="footer-note">If you believe this is an error, contact the team.</p>
        </section>
      </main>
    `;
  }

  function getPersonaSlugFromPath() {
    // /personas/<slug>/... -> slug
    const parts = window.location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("personas");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    // fallback: last segment
    return parts[parts.length - 1] || "unknown";
  }

  function isDraftMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode") === "draft" || params.get("draft") === "1";
  }

  // Allow bypass in draft mode (you can remove this if you want stricter behavior)
  const allowDraftBypass = true;

  const privacy = (meta("privacy") || "public").toLowerCase();
  const pin = meta("pin");
  const slug = getPersonaSlugFromPath();
  const sessionKey = `pin_ok_${slug}`;

  // Private pages: block unless in draft mode (optional bypass)
  if (privacy === "private") {
    if (allowDraftBypass && isDraftMode()) {
      showPage();
      window.__enableAnalytics?.();
      return;
    }
    blockPage("This profile is currently private.");
    return;
  }

  // Public pages: show immediately
  if (privacy === "public") {
    showPage();
    window.__enableAnalytics?.();
    return;
  }

  // PIN-gated pages
  if (privacy === "pin") {
    // Already unlocked this session?
    if (sessionStorage.getItem(sessionKey) === "1") {
      showPage();
      window.__enableAnalytics?.();
      return;
    }

    // If pin isn't configured, block safely
    if (!pin) {
      blockPage("This profile requires a PIN, but none is configured.");
      return;
    }

    // Prompt user
    const entered = prompt("Enter PIN to view this profile:");
    if (entered === null) {
      blockPage("PIN entry was cancelled.");
      return;
    }

    if (String(entered).trim() === String(pin).trim()) {
      sessionStorage.setItem(sessionKey, "1");
      showPage();
      window.__enableAnalytics?.();
    } else {
      blockPage("Incorrect PIN.");
    }
    return;
  }

  // Unknown privacy value
  showPage();
  window.__enableAnalytics?.();
})();
