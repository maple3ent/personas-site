// Analytics loader. Called ONLY after privacy gate grants access.
window.__enableAnalytics = function () {
  // Prevent double-loading
  if (window.__analyticsLoaded) return;
  window.__analyticsLoaded = true;

  // ---- OPTION A: Cloudflare Web Analytics (recommended, free) ----
  // 1) In Cloudflare dashboard > Web Analytics > Add a site
  // 2) Copy the beacon snippet token and paste below
  const CF_TOKEN = "PASTE_YOUR_CLOUDFLARE_TOKEN_HERE";

  if (CF_TOKEN && CF_TOKEN !== "PASTE_YOUR_CLOUDFLARE_TOKEN_HERE") {
    const s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(s);
    return;
  }

  // ---- OPTION B: Umami Cloud (has a $0 hobby plan, but you must configure it) ----
  // Pricing includes a free Hobby plan (limits apply). :contentReference[oaicite:1]{index=1}
  // If you use Umami Cloud, paste your script here instead.
};
