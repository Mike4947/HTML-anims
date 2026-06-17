# Copy-paste AI prompt

Use this after cloning smooth-anims into your project. Replace the **bold placeholders**, paste into Cursor / Claude / etc.

---

## System prompt (2–3 sentences)

```
This project includes smooth-anims (css/smooth-anims.css, js/smooth-anims.js). Read AGENTS.md and smooth-anims.schema.json, then inspect my codebase. Add smooth scroll-reveal animations to **[WHERE — file, route, or component, e.g. src/pages/index.html hero section]** for **[WHAT — elements and feel, e.g. headline, subtext, CTA, and feature cards with staggered fade-up]**. Prefer declarative data-animate attributes, wire SmoothAnims.init() if missing, and call SmoothAnims.refresh() after any dynamic DOM changes.
```

---

## Shorter variant

```
Read AGENTS.md + smooth-anims in this repo. Animate **[WHAT]** on **[WHERE]** using data-animate / data-animate-stagger. Match existing styles; minimal diff.
```

---

## UI cursor demo variant

For a product-tour style demo (animated fake cursor clicking through a UI mock), add:

```
Also read demo.html, js/demo-cursor.js, and js/demo-app.js for the cursor choreography pattern.
```

---

## Checklist (for you, before sending)

- [ ] Framework files copied into project (`css/smooth-anims.css`, `js/smooth-anims.js`)
- [ ] **WHERE** points to a real file or component in your repo
- [ ] **WHAT** describes specific elements, not just "make it animated"
- [ ] Your AI has access to both the framework folder and your page source
