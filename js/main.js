/**
 * EKA AI — Coming Soon   |   js/main.js
 */

'use strict';

/* ─── 1. Page Load Animation ───────────────────────────────────── */
function initPageLoad() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });
  });
}

/* ─── 2. Mouse Parallax (Hero Floating Chips) ──────────────────── */
function initParallax() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const chips = Array.from(document.querySelectorAll('.chip-wrap'));
  if (!chips.length) return;

  let rafId = null;
  let mouseX = 0.5;
  let mouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      chips.forEach((chip) => {
        if (chip.offsetParent === null) return;
        const depth = parseFloat(chip.dataset.depth || '2');
        const maxPx = depth * 9;
        const dx = (mouseX - 0.5) * maxPx * 2;
        const dy = (mouseY - 0.5) * maxPx * 2;
        chip.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      });
      rafId = null;
    });
  }, { passive: true });
}

/* ─── 3. Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();

  if (window.matchMedia('(pointer: fine)').matches) {
    initParallax();
  }
});
