const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeoyybyb";

async function loadPersona() {
  const res = await fetch("./persona.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load persona.json");
  return await res.json();
}

function el(id) { return document.getElementById(id); }

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text ?? "";
}

function setHTML(id, html) {
  const node = el(id);
  if (node) node.innerHTML = html ?? "";
}

/* Mirror header values into overlay spans (if present) */
function mirrorOverlays() {
  const name = el("name")?.textContent || "Name";
  const age = el("age")?.textContent || "Age";
  const location = el("location")?.textContent || "Location";

  const nO = el("nameOverlay");
  if (nO) nO.textContent = name;

  const aO = el("ageOverlay");
  if (aO) aO.textContent = age;

  const lO = el("locationOverlay");
  if (lO) lO.textContent = location;
}

/* Dynamic photo gallery */
function renderPhotos(data) {
  const gallery = el("gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  const photos = Array.isArray(data.photos) ? data.photos.filter(Boolean) : [];
  const sources = photos.length ? photos : ["./photo-1.jpg"];

  sources.forEach((src, idx) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = data.name ? `${data.name} photo ${idx + 1}` : `Profile photo ${idx + 1}`;

    slide.appendChild(img);
    gallery.appendChild(slide);
  });
}

/* Optional sections (guarded) */
function renderBadges(badges = []) {
  const wrap = el("badges");
  if (!wrap) return;

  wrap.innerHTML = "";
  badges.forEach(b => {
    const s = document.createElement("span");
    s.className = "badge";
    s.textContent = b;
    wrap.appendChild(s);
  });
}

function renderQuickDetails(details = {}) {
  const wrap = el("quickDetails");
  if (!wrap) return;

  wrap.innerHTML = "";
  Object.entries(details).forEach(([k, v]) => {
    const kDiv = document.createElement("div");
    kDiv.className = "k";
    kDiv.textContent = k;

    const vDiv = document.createElement("div");
    vDiv.className = "v";
    vDiv.textContent = v;

    wrap.appendChild(kDiv);
    wrap.appendChild(vDiv);
  });
}

/* Canonical questions */
const CANONICAL_QUESTIONS = [
  "What are your non-negotiables?",
  "What’s an area of life you are actively focused on changing?",
  "What’s your idea of a great night with friends?",
  "What’s something that surprised you recently?",
  "What’s your guilty pleasure?",
  "What does your typical workweek look like? How about your weekend?"
];

function isDraftMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "draft" || params.get("draft") === "1";
}

function countWords(text = "") {
  const cleaned = (text || "").trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

function countChars(text = "") {
  return (text || "").length;
}

function renderQA(responses = []) {
  const wrap = el("qa");
  if (!wrap) return;

  wrap.innerHTML = "";
  const draftMode = isDraftMode();

  CANONICAL_QUESTIONS.forEach((question, i) => {
    const r = responses[i] || {};

    const visibility = r.visibility || "public"; // public | private
    const status = r.status || "draft";          // public | draft
    const publicText = r.public || "";
    const draftText = r.draft || "";

    let displayed = "";

    if (!draftMode) {
      if (visibility === "private") displayed = "";
      else if (status === "public" && publicText) displayed = publicText;
      else displayed = "";
    } else {
      displayed = draftText || publicText || "";
    }

    const card = document.createElement("div");
    card.className = "qa-essay";

    const qP = document.createElement("p");
    qP.className = "qa-q";
    qP.textContent = question;

    const aP = document.createElement("p");
    aP.className = "qa-a";
    aP.textContent = displayed || (draftMode ? "(No answer yet)" : "(Answer pending)");

    const meta = document.createElement("div");
    meta.className = "qa-meta";

    const words = countWords(displayed);
    const chars = countChars(displayed);

    const pillWords = document.createElement("span");
    pillWords.className = "qa-pill";
    pillWords.textContent = `Words: ${words}`;

    const pillChars = document.createElement("span");
    pillChars.className = "qa-pill";
    pillChars.textContent = `Chars: ${chars}`;

    const pillTarget = document.createElement("span");
    pillTarget.className = "qa-pill";
    pillTarget.textContent = "Target: ~500 words";

    meta.appendChild(pillWords);
    meta.appendChild(pillChars);
    meta.appendChild(pillTarget);

    if (draftMode) {
      const pillVis = document.createElement("span");
      pillVis.className = "qa-pill";
      pillVis.textContent = `Visibility: ${visibility}`;

      const pillStatus = document.createElement("span");
      pillStatus.className = "qa-pill";
      pillStatus.textContent = `Status: ${status}`;

      meta.appendChild(pillVis);
      meta.appendChild(pillStatus);
    }

    card.appendChild(qP);
    card.appendChild(aP);
    card.appendChild(meta);
    wrap.appendChild(card);
  });
}

(async function init() {
  try {
    const data = await loadPersona();

    // Page metadata
    document.title = `${data.name ?? "Persona"} — Profile`;
    setText("name", data.name);
    setText("headline", data.headline);
    setText("location", data.location);
    setText("age", data.age);

    // Lower-right overlay traits
    setText("siblingRank", data.siblingRank);
    setText("enneagram", data.enneagram);
    setText("myersBriggs", data.myersBriggs);

    // Ensure overlays reflect loaded data
    mirrorOverlays();
    setTimeout(mirrorOverlays, 50);

    // Enforce response count (warn only)
    if (Array.isArray(data.responses) && data.responses.length !== 6) {
      console.warn("Expected exactly 6 responses. Found:", data.responses.length);
    }

    // Render page sections
    renderPhotos(data);
    renderBadges(data.badges || []);
    renderQuickDetails(data.quickDetails || {});
    renderQA(data.responses || []);

    // Persona tagging for Formspree submissions
    const personaSlug =
      data.slug || window.location.pathname.split("/").filter(Boolean).slice(-1)[0];

    const hiddenPersona = el("personaHidden");
    if (hiddenPersona) hiddenPersona.value = personaSlug;

    const personaNameHidden = el("personaNameHidden");
    if (personaNameHidden) personaNameHidden.value = data.name || personaSlug;

    // Configure Formspree endpoint (single global form)
    const interestForm = el("interestForm");
    if (interestForm) interestForm.action = FORMSPREE_ENDPOINT;

  } catch (e) {
    console.error(e);
    setHTML(
      "error",
      `<div class="card">Could not load persona profile. Check <code>persona.json</code>.</div>`
    );
  }
})();
