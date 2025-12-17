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

function renderPhotos(data) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  const photos = Array.isArray(data.photos) ? data.photos.filter(Boolean) : [];

  // Fallback: if no photos array, show a single default
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

function renderBadges(badges = []) {
  const wrap = el("badges");
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
  const wrap = document.getElementById("qa");
  wrap.innerHTML = "";

  const draftMode = isDraftMode();

  CANONICAL_QUESTIONS.forEach((question, i) => {
    const r = responses[i] || {};

    const visibility = r.visibility || "public"; // public | private
    const status = r.status || "draft";          // public | draft
    const publicText = r.public || "";
    const draftText = r.draft || "";

    // Decide what to display
    let displayed = "";

    if (!draftMode) {
      // Normal visitors:
      if (visibility === "private") {
        displayed = ""; // hide entirely
      } else if (status === "public" && publicText) {
        displayed = publicText;
      } else {
        displayed = ""; // not ready
      }
    } else {
      // Draft mode (you):
      // Prefer draft if present, otherwise public
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

    // Meta pills (counts + flags)
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

    document.title = `${data.name ?? "Persona"} — Profile`;
    setText("name", data.name);
    setText("headline", data.headline);
    setText("location", data.location);
    setText("age", data.age);
    setText("siblingRank", data.siblingRank);
    setText("enneagram", data.enneagram);
    setText("myersBriggs", data.myersBriggs);

    const img = el("photo");
    img.src = data.photoPath || "./photo.jpg";
    img.alt = data.name ? `${data.name} photo` : "Persona photo";

    renderBadges(data.badges || []);
    renderQuickDetails(data.quickDetails || {});
    renderQA(data.responses || []);

    // Email capture persona identifier
    const personaSlug = data.slug || window.location.pathname.split("/").filter(Boolean).slice(-1)[0];
    const hiddenPersona = el("personaHidden");
    hiddenPersona.value = personaSlug;

    // Optional: show slug
    setText("slug", personaSlug);

    // Optional: configure form endpoint
    if (data.formspreeEndpoint) {
      el("emailForm").action = data.formspreeEndpoint;
    }
  } catch (e) {
    console.error(e);
    setHTML("error", `<div class="card">Could not load persona profile. Check <code>persona.json</code>.</div>`);
  }
})();
