# Smooth Anims — AI agent guide

**Read this file first.** It tells you how to add animations to the user's site using this framework.

Machine-readable API: `smooth-anims.schema.json`

---

## What this framework is

Zero-dependency scroll-reveal animations via HTML `data-*` attributes + one JS init call.

| File | Role |
|------|------|
| `css/smooth-anims.css` | Presets, timing, hover, reduced-motion |
| `js/smooth-anims.js` | IntersectionObserver, stagger, `SmoothAnims` API |
| `index.html` | Scroll-reveal examples |
| `demo.html` + `js/demo-cursor.js` + `js/demo-app.js` | **Separate** — fake cursor UI tour demo. Use only when user asks for animated cursor / app walkthrough |

**Do not rewrite the framework.** Integrate it into the user's existing files.

---

## Integration checklist

1. **Copy** `css/smooth-anims.css` and `js/smooth-anims.js` into the user's project (or reference existing copy).
2. **Link** in layout / `<head>` + before `</body>`:

```html
<link rel="stylesheet" href="/path/to/css/smooth-anims.css">
<script src="/path/to/js/smooth-anims.js"></script>
<script>SmoothAnims.init();</script>
```

3. **Annotate** target elements with `data-animate` (see below).
4. **Refresh** after dynamic content: `SmoothAnims.refresh()` or `SmoothAnims.refresh(containerEl)`.

### SPA / React / Vue

```javascript
// once on mount
useEffect(() => {
  SmoothAnims.init();
  return () => SmoothAnims.destroy();
}, []);

// after route change or data fetch renders new DOM
SmoothAnims.refresh();
```

For Next.js, init in a client component only (`"use client"`).

---

## Declarative API (prefer this)

### Single element — `data-animate`

| Preset | Effect | Best for |
|--------|--------|----------|
| `fade` | Opacity | Subtle text |
| `fade-up` | Rise + fade | **Default** — headings, cards, sections |
| `fade-down` | Drop + fade | Navbars, dropdowns |
| `fade-left` / `fade-right` | Slide + fade | Side content, alternating rows |
| `scale` | Zoom in | Cards, buttons, pricing |
| `scale-up` | Scale + rise | Hero CTAs |
| `blur-up` | De-blur + rise | Premium hero moments |
| `rotate` | Tilt + scale | Playful accents |
| `clip-up` | Wipe reveal | Section titles |

### Timing attributes

```html
data-animate-duration="800"   <!-- ms -->
data-animate-delay="200"      <!-- ms — use for hero sequence: 0, 100, 200, 300 -->
data-animate-ease="smooth"    <!-- linear | ease-out | ease-in-out | spring | smooth | snappy -->
data-animate-instant="true"   <!-- animate on load, skip scroll -->
data-animate-repeat="true"    <!-- re-animate when re-entering viewport -->
```

### Stagger — `data-animate-stagger` on **parent**

```html
<ul data-animate-stagger="fade-up" data-animate-stagger-delay="80">
  <li>Item 1</li>  <!-- auto delay 0ms -->
  <li>Item 2</li>  <!-- auto delay 80ms -->
  <li>Item 3</li>  <!-- auto delay 160ms -->
</ul>
```

Direct children only. Presets: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale`.

### Hover (no JS)

```html
data-hover="lift"   <!-- translateY(-4px) -->
data-hover="scale"  <!-- scale(1.03) -->
data-hover="glow"  <!-- accent box-shadow -->
```

### Parallax

```html
<div data-parallax="0.35">…</div>
```

---

## Programmatic API (when attributes aren't enough)

```javascript
SmoothAnims.init({ threshold: 0.15, once: true });

await SmoothAnims.animate('.hero-title', { preset: 'fade-up', duration: 800, ease: 'spring' });

SmoothAnims.stagger('.features-grid', { preset: 'fade-up', delay: 100 });

SmoothAnims.reveal(el);  // force visible
SmoothAnims.hide(el);    // force hidden
SmoothAnims.refresh();   // re-scan DOM
SmoothAnims.destroy();   // cleanup
```

Events: `sa:revealed`, `sa:hidden`, `sa:stagger-revealed` (bubble).

Constants: `SmoothAnims.PRESETS`, `SmoothAnims.EASINGS`, `SmoothAnims.HOVER_PRESETS`.

---

## Landing page recipes

Apply these patterns to the user's **WHERE** (hero, features, pricing, etc.):

### Hero

```html
<section class="hero">
  <span data-animate="fade" data-animate-delay="0">Badge</span>
  <h1 data-animate="fade-up" data-animate-delay="100">Headline</h1>
  <p data-animate="fade-up" data-animate-delay="200">Subtext</p>
  <a data-animate="scale-up" data-animate-delay="300" data-animate-ease="spring">CTA</a>
</section>
```

### Feature grid

```html
<div class="features" data-animate-stagger="fade-up" data-animate-stagger-delay="80">
  <article class="card" data-hover="lift">…</article>
  <article class="card" data-hover="lift">…</article>
</div>
```

### Pricing

```html
<div data-animate-stagger="scale" data-animate-stagger-delay="100" data-animate-ease="spring">
  …pricing cards…
</div>
```

### Footer / above-fold nav

```html
<nav data-animate="fade-down" data-animate-instant="true">…</nav>
```

### Social proof / logos

```html
<div data-animate-stagger="fade" data-animate-stagger-delay="60">…logos…</div>
```

---

## Decision rules

1. **Prefer `data-animate`** over custom `@keyframes` or animation libraries.
2. **Stagger the parent**, not manual delays on every sibling (unless hero sequencing).
3. **Match the site** — don't change colors, fonts, or layout; only add attributes + init.
4. **Minimal diff** — touch only files related to **WHERE**.
5. **`fade-up` + `smooth` ease** is the safe default; use `spring` sparingly (CTAs, pricing).
6. **Reduced motion** is handled automatically — don't disable it.
7. **Don't animate everything** — hero, section headings, cards, CTAs. Skip dense body text.
8. After **modals, tabs, SPA routes, fetch** → `SmoothAnims.refresh()`.

---

## Anti-patterns

| Don't | Do instead |
|-------|------------|
| Inline `style="animation:…"` for scroll reveals | `data-animate` |
| Import GSAP/AOS/Framer for simple fades | This framework |
| Put `data-animate` on every `<p>` | Stagger container or key elements only |
| Edit `smooth-anims.js` for one-off effects | Attributes or user CSS overrides on `--sa-*` vars |
| Forget `SmoothAnims.init()` | Add script tag + init in layout |
| Use demo-cursor for landing pages | Use `data-animate` unless user wants UI tour |

---

## CSS variables (override per section if needed)

```css
.hero {
  --sa-distance: 1.5rem;
  --sa-duration: 800ms;
}
```

Available: `--sa-duration`, `--sa-delay`, `--sa-ease`, `--sa-distance`, `--sa-scale-from`, `--sa-blur-from`.

---

## UI cursor demo (optional subsystem)

Only when user wants an **animated mouse** clicking through a UI reproduction:

- `demo.html` — full example
- `js/demo-cursor.js` — `DemoCursor` class (move, click, ripple)
- `js/demo-app.js` — app state + choreography script

This is independent of scroll-reveal. Combine both on a marketing page if needed.

---

## Output expectations

When the user gives **WHERE** + **WHAT**:

1. Locate the file(s) in their codebase.
2. Add framework links if missing.
3. Add appropriate `data-animate` / `data-animate-stagger` / `data-hover`.
4. Set sensible delays for sequential hero elements.
5. Add `SmoothAnims.refresh()` if their stack renders dynamically.
6. Show a concise summary of what was animated and where.
