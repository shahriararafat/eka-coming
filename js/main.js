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

/* ─── 2. Mouse & Touch Parallax (Hero Floating Chips) ────────── */
function initParallax() {
  const chips = Array.from(document.querySelectorAll('.chip-wrap'));
  if (!chips.length) return;

  let rafId = null;
  let targetX = 0.5;
  let targetY = 0.5;

  function updateTransform() {
    chips.forEach((chip) => {
      if (chip.offsetParent === null) return;
      const depth = parseFloat(chip.dataset.depth || '2');
      const isMobile = window.innerWidth <= 640;
      const maxPx = isMobile ? depth * 4 : depth * 9;
      const dx = (targetX - 0.5) * maxPx * 2;
      const dy = (targetY - 0.5) * maxPx * 2;
      chip.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0)`;
    });
    rafId = null;
  }

  function handleMove(clientX, clientY) {
    targetX = clientX / window.innerWidth;
    targetY = clientY / window.innerHeight;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTransform);
    }
  }

  window.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

/* ─── 3. Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initParallax();
});
