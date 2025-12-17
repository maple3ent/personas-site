# Persona Profiles (maple3ent)

This repo hosts a lightweight, scalable “persona profile” site on GitHub Pages (Jekyll Minimal theme for the homepage + custom HTML for persona pages).

- Homepage: `/index.md` (Jekyll)
- Persona pages: `/personas/<slug>/index.html` (static HTML + `assets/app.js` + `persona.json`)
- Each persona has:
  - Standard photo gallery (scroll/snap)
  - Locked overlay layout (Name/Age/Location + Sibling Rank/Enneagram/Myers-Briggs)
  - 6 canonical questions (locked order), with draft/private controls + word/char counters
  - Optional details section
  - Email capture (Formspree endpoint per persona)

---

## Add a new persona in under 5 minutes

### 1) Duplicate the demo persona folder
Create a new folder by copying:

`/personas/demo/` → `/personas/<slug>/`

Example:
- New persona slug: `alex`
- New folder: `/personas/alex/`

Make sure the new folder includes:
- `index.html`
- `persona.json`
- any `photo-*.jpg` you want to use

### 2) Update `persona.json`
Open: `/personas/<slug>/persona.json`

Edit at minimum:
- `slug`
- `name`
- `headline`
- `location`
- `age`
- `siblingRank`
- `enneagram`
- `myersBriggs`
- `photos` (array of image paths in that same folder)

Example:

```json
{
  "slug": "alex",
  "name": "Alex",
  "headline": "Short, compelling one-liner.",
  "location": "Nashville, TN",
  "age": "31",
  "siblingRank": "Oldest of 3",
  "enneagram": "3w2",
  "myersBriggs": "ENFJ",
  "formspreeEndpoint": "",
  "photos": ["./photo-1.jpg", "./photo-2.jpg"],
  "quickDetails": {
    "Love language": "Quality time",
    "Favorite cuisine": "Thai"
  },
  "responses": [
    { "public": "", "draft": "", "visibility": "public", "status": "draft" },
    { "public": "", "draft": "", "visibility": "public", "status": "draft" },
    { "public": "", "draft": "", "visibility": "public", "status": "draft" },
    { "public": "", "draft": "", "visibility": "public", "status": "draft" },
    { "public": "", "draft": "", "visibility": "public", "status": "draft" },
    { "public": "", "draft": "", "visibility": "public", "status": "draft" }
  ]
}
