---
layout: persona
title: Demo Persona
privacy: public
---

<div class="container">
  <header class="page-header">
    <p class="muted">Profile ID: <span id="slug"></span></p>
    <h1 id="name">Loading...</h1>
    <p class="muted" id="headline"></p>
  </header>

  <div id="error"></div>

  <section class="card">
    <div class="profile-card">
      <div class="photo">
        <div class="gallery" id="gallery" aria-label="Profile photos"></div>
      </div>

      <div class="profile-info">
        <div class="info-block">
          <div class="info-title">Name</div>
          <div class="info-value"><span id="nameOverlay">Name</span></div>

          <div class="info-title" style="margin-top:6px;">Age</div>
          <div class="info-value"><span id="ageOverlay">Age</span></div>

          <div class="info-title" style="margin-top:6px;">Location</div>
          <div class="info-value"><span id="locationOverlay">Location</span></div>
        </div>

        <div></div>
        <div></div>

        <div class="info-block bottom right">
          <div class="info-title">Sibling Rank</div>
          <div class="info-value"><span id="siblingRank">Sibling Rank</span></div>

          <div class="info-title" style="margin-top:6px;">Enneagram</div>
          <div class="info-value"><span id="enneagram">Enneagram</span></div>

          <div class="info-title" style="margin-top:6px;">Myers Briggs</div>
          <div class="info-value"><span id="myersBriggs">Myers Briggs</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="card">
    <h2>Questions</h2>
    <div class="qa" id="qa"></div>
  </section>

  <section class="card">
    <h2>Details</h2>
    <div class="kv" id="quickDetails"></div>
    <p class="footer-note">This section will be populated per persona, but the structure stays the same.</p>
  </section>

  <!-- Keep your interest form section here (same as before) -->
  <!-- (no change needed other than removing the outer HTML document wrapper) -->

  <p class="footer-note muted" style="margin-top:16px;">
    Back to <a href="{{ '/' | relative_url }}">all personas</a>
  </p>
</div>
