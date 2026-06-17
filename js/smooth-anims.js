/**
 * Smooth Anims — JavaScript core
 * @see AGENTS.md          Full guide for AI agents and developers
 * @see PROMPT.md          Copy-paste prompt template
 * @see smooth-anims.schema.json  Machine-readable API
 *
 * Usage:
 *   <script src="js/smooth-anims.js"></script>
 *   SmoothAnims.init();
 */

(function (global) {
  'use strict';

  const PRESETS = [
    'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right',
    'scale', 'scale-up', 'blur', 'blur-up', 'rotate', 'clip-up',
  ];

  const STAGGER_PRESETS = ['fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale'];

  const HOVER_PRESETS = ['lift', 'scale', 'glow'];

  const EASINGS = {
    linear: 'linear',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const DEFAULTS = {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
    once: true,
    staggerDelay: 80,
    parallaxSpeed: 0.35,
  };

  let config = { ...DEFAULTS };
  let observer = null;
  let parallaxEls = [];
  let parallaxTicking = false;
  let reducedMotion = false;

  // ── Utilities ──────────────────────────────────────────────────────

  function prefersReducedMotion() {
    return global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function parseNumber(value, fallback) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function applyTiming(el) {
    const duration = el.dataset.animateDuration;
    const delay = el.dataset.animateDelay;
    const ease = el.dataset.animateEase;

    if (duration) el.style.setProperty('--sa-duration', `${duration}ms`);
    if (delay) el.style.setProperty('--sa-delay', `${delay}ms`);
    if (ease && EASINGS[ease]) el.style.setProperty('--sa-ease', EASINGS[ease]);
  }

  function reveal(el) {
    el.classList.add('sa-visible');
    el.dispatchEvent(new CustomEvent('sa:revealed', { bubbles: true }));
  }

  function hide(el) {
    el.classList.remove('sa-visible');
    el.dispatchEvent(new CustomEvent('sa:hidden', { bubbles: true }));
  }

  // ── Stagger ────────────────────────────────────────────────────────

  function revealStagger(container) {
    const children = [...container.children];
    const baseDelay = parseNumber(container.dataset.animateStaggerDelay, config.staggerDelay);
    const duration = container.dataset.animateDuration;
    const ease = container.dataset.animateEase;

    children.forEach((child, i) => {
      if (duration) child.style.setProperty('--sa-duration', `${duration}ms`);
      if (ease && EASINGS[ease]) child.style.setProperty('--sa-ease', EASINGS[ease]);
      child.style.setProperty('--sa-delay', `${i * baseDelay}ms`);

      if (reducedMotion) {
        reveal(child);
      } else {
        requestAnimationFrame(() => reveal(child));
      }
    });

    container.dispatchEvent(new CustomEvent('sa:stagger-revealed', { bubbles: true }));
  }

  function hideStagger(container) {
    [...container.children].forEach(hide);
  }

  // ── Intersection Observer ──────────────────────────────────────────

  function createObserver() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const isStagger = el.hasAttribute('data-animate-stagger');
          const repeat = el.dataset.animateRepeat === 'true';

          if (entry.isIntersecting) {
            if (reducedMotion) {
              isStagger ? revealStagger(el) : reveal(el);
            } else {
              isStagger ? revealStagger(el) : reveal(el);
            }
            if (config.once && !repeat) observer.unobserve(el);
          } else if (repeat && !config.once) {
            isStagger ? hideStagger(el) : hide(el);
          }
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin,
      }
    );
  }

  function observeElements(root) {
    const scope = root || document;
    const targets = scope.querySelectorAll('[data-animate], [data-animate-stagger]');

    targets.forEach((el) => {
      if (el.hasAttribute('data-animate')) applyTiming(el);
      if (el.dataset.animateInstant === 'true' || reducedMotion) {
        el.hasAttribute('data-animate-stagger') ? revealStagger(el) : reveal(el);
        return;
      }
      observer.observe(el);
    });
  }

  // ── Parallax ───────────────────────────────────────────────────────

  function initParallax(root) {
    const scope = root || document;
    parallaxEls = [...scope.querySelectorAll('[data-parallax]')].map((el) => ({
      el,
      speed: parseNumber(el.dataset.parallax, config.parallaxSpeed),
    }));

    if (parallaxEls.length && !reducedMotion) {
      global.addEventListener('scroll', onParallaxScroll, { passive: true });
      updateParallax();
    }
  }

  function onParallaxScroll() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(() => {
      updateParallax();
      parallaxTicking = false;
    });
  }

  function updateParallax() {
    const viewH = global.innerHeight;
    parallaxEls.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - viewH / 2) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  // ── Programmatic API ───────────────────────────────────────────────

  function animate(el, options = {}) {
    const target = typeof el === 'string' ? document.querySelector(el) : el;
    if (!target) return Promise.resolve();

    const {
      preset = 'fade-up',
      duration = 600,
      delay = 0,
      ease = 'smooth',
      reverse = false,
    } = options;

    if (reverse) {
      target.classList.remove('sa-visible');
      return Promise.resolve();
    }

    target.setAttribute('data-animate', preset);
    target.style.setProperty('--sa-duration', `${duration}ms`);
    target.style.setProperty('--sa-delay', `${delay}ms`);
    if (EASINGS[ease]) target.style.setProperty('--sa-ease', EASINGS[ease]);

    return new Promise((resolve) => {
      const onEnd = (e) => {
        if (e.target !== target || e.propertyName !== 'opacity') return;
        target.removeEventListener('transitionend', onEnd);
        resolve(target);
      };
      target.addEventListener('transitionend', onEnd);
      requestAnimationFrame(() => reveal(target));
    });
  }

  function stagger(container, options = {}) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    const preset = options.preset || 'fade-up';
    el.setAttribute('data-animate-stagger', preset);
    if (options.delay) el.dataset.animateStaggerDelay = String(options.delay);
    if (options.duration) el.dataset.animateDuration = String(options.duration);
    if (options.ease) el.dataset.animateEase = options.ease;

    revealStagger(el);
    return el;
  }

  function refresh(root) {
    createObserver();
    observeElements(root);
    initParallax(root);
  }

  function init(options = {}) {
    config = { ...DEFAULTS, ...options };
    reducedMotion = prefersReducedMotion();

    global.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      reducedMotion = e.matches;
      refresh();
    });

    refresh();
  }

  function destroy() {
    if (observer) observer.disconnect();
    global.removeEventListener('scroll', onParallaxScroll);
    parallaxEls = [];
  }

  // ── Export ─────────────────────────────────────────────────────────

  const SmoothAnims = {
    init,
    refresh,
    destroy,
    animate,
    stagger,
    reveal,
    hide,
    PRESETS,
    STAGGER_PRESETS,
    HOVER_PRESETS,
    EASINGS,
    get reducedMotion() {
      return reducedMotion;
    },
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothAnims;
  } else {
    global.SmoothAnims = SmoothAnims;
  }
})(typeof window !== 'undefined' ? window : global);
