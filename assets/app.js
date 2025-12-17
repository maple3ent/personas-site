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

function renderQA(items = []) {
  const wrap = el("qa");
  wrap.innerHTML = "";
  items.forEach(({ q, a }) => {
    const card = document.createElement("div");
    card.className = "qa-item";

    const qP = document.createElement("p");
    qP.className = "qa-q";
    qP.textContent = q;

    const aP = document.createElement("p");
    aP.className = "qa-a";
    aP.textContent = a;

    card.appendChild(qP);
    card.appendChild(aP);
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
    setText("pronouns", data.pronouns);

    const img = el("photo");
    img.src = data.photoPath || "./photo.jpg";
    img.alt = data.name ? `${data.name} photo` : "Persona photo";

    renderBadges(data.badges || []);
    renderQuickDetails(data.quickDetails || {});
    renderQA(data.questions || []);

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
