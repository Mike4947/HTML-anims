# Smooth Anims

**Zero-dependency scroll animations for any website.**  
Add smooth reveal effects with HTML attributes — no build step, no frameworks, ~3 KB gzipped.

[Live presets demo](./index.html) · [UI cursor demo](./demo.html) · [AI prompt template](./PROMPT.md)

---

## Why Smooth Anims?

| | Smooth Anims | Typical animation libs |
|---|---|---|
| Setup | 2 files + 1 init call | npm install, imports, config |
| Markup | `data-animate="fade-up"` | JS hooks, refs, classes |
| Weight | ~3 KB | 15–50+ KB |
| AI-friendly | `AGENTS.md` + schema included | Varies |

Built for landing pages, portfolios, and marketing sites — with first-class support for AI-assisted integration.

---

## Quick start

### 1. Get the framework

```bash
git clone https://github.com/Mike4947/HTML-anims.git
```

Copy these two files into your project:

```
css/smooth-anims.css
js/smooth-anims.js
```

### 2. Link in your HTML

```html
<link rel="stylesheet" href="/css/smooth-anims.css">

<!-- your content -->

<script src="/js/smooth-anims.js"></script>
<script>SmoothAnims.init();</script>
```

### 3. Animate elements

```html
<h1 data-animate="fade-up" data-animate-delay="100">Hello, world.</h1>
<p data-animate="fade-up" data-animate-delay="200">Scroll down to see more.</p>

<ul data-animate-stagger="fade-up" data-animate-stagger-delay="80">
  <li>Feature one</li>
  <li>Feature two</li>
  <li>Feature three</li>
</ul>
```

That's it. Elements reveal smoothly when they scroll into view.

---

## Landing page recipe

A polished hero + features section in under a minute:

```html
<section class="hero">
  <span data-animate="fade" data-animate-delay="0">New release</span>
  <h1 data-animate="fade-up" data-animate-delay="100">Build faster</h1>
  <p data-animate="fade-up" data-animate-delay="200">Ship beautiful pages without animation libraries.</p>
  <a href="#" data-animate="scale-up" data-animate-delay="300" data-animate-ease="spring">Get started</a>
</section>

<section class="features" data-animate-stagger="fade-up" data-animate-stagger-delay="80">
  <article class="card" data-hover="lift">…</article>
  <article class="card" data-hover="lift">…</article>
  <article class="card" data-hover="lift">…</article>
</section>
```

**Tip:** Use incremental delays (`0 → 100 → 200 → 300`) on hero elements for a choreographed entrance.

---

## Animation presets

| Preset | Effect | Best for |
|--------|--------|----------|
| `fade` | Opacity | Subtle text |
| `fade-up` | Rise + fade | Headings, cards *(default)* |
| `fade-down` | Drop + fade | Navbars |
| `fade-left` / `fade-right` | Slide + fade | Side content |
| `scale` | Zoom in | Cards, pricing |
| `scale-up` | Scale + rise | CTAs |
| `blur-up` | De-blur + rise | Hero moments |
| `rotate` | Tilt + scale | Playful accents |
| `clip-up` | Wipe reveal | Section titles |

### Timing & easing

```html
data-animate-duration="800"    <!-- milliseconds (default: 600) -->
data-animate-delay="200"       <!-- delay before start -->
data-animate-ease="smooth"     <!-- smooth | spring | snappy | linear | ease-out -->
data-animate-instant="true"    <!-- animate on load, skip scroll -->
data-animate-repeat="true"     <!-- re-animate when re-entering viewport -->
```

### Hover micro-interactions

```html
<div class="card" data-hover="lift">…</div>   <!-- floats up -->
<div class="card" data-hover="scale">…</div>  <!-- subtle zoom -->
<div class="card" data-hover="glow">…</div>   <!-- accent shadow -->
```

### Parallax

```html
<div data-parallax="0.35">Background element</div>
```

---

## JavaScript API

For dynamic content or programmatic control:

```javascript
SmoothAnims.init();                    // call once on page load
SmoothAnims.refresh();                 // re-scan after DOM changes
SmoothAnims.destroy();                 // cleanup observers

await SmoothAnims.animate('.hero', {
  preset: 'fade-up',
  duration: 800,
  ease: 'spring',
});

SmoothAnims.stagger('.grid', { preset: 'fade-up', delay: 100 });
```

### React / Vue / SPA

```javascript
useEffect(() => {
  SmoothAnims.init();
  return () => SmoothAnims.destroy();
}, []);

// after route change or fetch renders new content
SmoothAnims.refresh();
```

For Next.js, call `init()` inside a `"use client"` component only.

---

## Use with AI (Cursor, Claude, etc.)

This repo is optimized for AI-assisted integration. After cloning into your project:

1. Open **[PROMPT.md](./PROMPT.md)**
2. Fill in **WHERE** (file/component) and **WHAT** (elements to animate)
3. Paste the prompt into your AI chat

The AI reads **[AGENTS.md](./AGENTS.md)** and **[smooth-anims.schema.json](./smooth-anims.schema.json)** to apply animations correctly in your codebase.

**Example prompt:**

> Read AGENTS.md and smooth-anims.schema.json, then inspect my codebase. Add smooth scroll-reveal animations to **src/pages/index.html hero section** for **headline, subtext, CTA, and feature cards with staggered fade-up**. Prefer declarative data-animate attributes, wire SmoothAnims.init() if missing, and call SmoothAnims.refresh() after dynamic DOM changes.

---

## Project structure

```
HTML-anims/
├── css/
│   └── smooth-anims.css      ← core styles (required)
├── js/
│   └── smooth-anims.js       ← core script (required)
├── index.html                ← scroll-reveal demo
├── demo.html                 ← animated cursor UI tour demo
├── AGENTS.md                 ← full guide for AI agents
├── PROMPT.md                 ← copy-paste AI prompt template
└── smooth-anims.schema.json  ← machine-readable API
```

**Optional demo files** (UI cursor tour — not needed for scroll animations):

```
css/demo-app.css · js/demo-cursor.js · js/demo-app.js
```

---

## Configuration

Pass options to `init()`:

```javascript
SmoothAnims.init({
  threshold: 0.15,              // how much of element must be visible (0–1)
  rootMargin: '0px 0px -8% 0px', // trigger zone adjustment
  once: true,                    // animate only once (default)
  staggerDelay: 80,              // default ms between staggered children
});
```

Override timing per section with CSS variables:

```css
.hero {
  --sa-distance: 1.5rem;
  --sa-duration: 800ms;
}
```

---

## Accessibility

Smooth Anims respects `prefers-reduced-motion: reduce` automatically. When enabled, all elements appear instantly with no motion.

---

## Local preview

Open the demos directly in your browser — no server required:

- **index.html** — all scroll-reveal presets
- **demo.html** — animated cursor clicking through a UI mock

---

## License

MIT — use freely in personal and commercial projects.

---

<p align="center">
  <sub>Built for developers who want smooth animations without the overhead.</sub>
</p>
