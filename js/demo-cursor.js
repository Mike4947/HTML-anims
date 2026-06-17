/**
 * Demo Cursor — smooth animated pointer that drives UI interactions.
 */
(function (global) {
  'use strict';

  const EASE = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

  class DemoCursor {
    constructor(container) {
      this.container = container;
      this.el = container.querySelector('.demo-cursor');
      this.x = 0;
      this.y = 0;
      this.visible = false;
      this.running = false;
      this.aborted = false;
    }

    getCenter(el) {
      const cRect = this.container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      return {
        x: eRect.left - cRect.left + eRect.width / 2,
        y: eRect.top - cRect.top + eRect.height / 2,
      };
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
      this.el.style.transform = `translate(${x}px, ${y}px)`;
    }

    show() {
      this.el.classList.add('visible');
      this.visible = true;
    }

    hide() {
      this.el.classList.remove('visible');
      this.visible = false;
    }

    moveTo(x, y, duration = 700) {
      return new Promise((resolve) => {
        const startX = this.x;
        const startY = this.y;
        const start = performance.now();

        const tick = (now) => {
          if (this.aborted) return resolve();
          const t = Math.min((now - start) / duration, 1);
          const e = EASE(t);
          this.setPosition(
            startX + (x - startX) * e,
            startY + (y - startY) * e
          );
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    }

    moveToEl(el, duration = 700) {
      const { x, y } = this.getCenter(el);
      return this.moveTo(x, y, duration);
    }

    ripple(x, y) {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      this.container.appendChild(ripple);
      requestAnimationFrame(() => ripple.classList.add('animate'));
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    click(duration = 120) {
      return new Promise((resolve) => {
        this.el.classList.add('clicking');
        this.ripple(this.x, this.y);
        setTimeout(() => {
          this.el.classList.remove('clicking');
          resolve();
        }, duration);
      });
    }

    clickEl(el, moveDuration = 700) {
      return this.moveToEl(el, moveDuration).then(() => this.click());
    }

    wait(ms) {
      return new Promise((resolve) => {
        if (this.aborted) return resolve();
        setTimeout(resolve, ms);
      });
    }

    stop() {
      this.aborted = true;
      this.running = false;
    }
  }

  global.DemoCursor = DemoCursor;
})(window);
