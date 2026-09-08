/**
 * EKA AI — Coming Soon   |   js/main.js
 *
 * Sections:
 *   1. Configuration
 *   2. Page Load Animation
 *   3. Countdown Timer
 *   4. Mouse Parallax (hero chips)
 *   5. Scroll Reveal (IntersectionObserver)
 *   6. Model Wall SVG Animation
 *   7. SVG Chip Hover Interactions
 *   8. Nav Scroll Behaviour
 *   9. Utilities
 *  10. Init
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────────
   Change LAUNCH_DATE to update the countdown everywhere.
   Format: ISO 8601 with timezone offset.
   BDT (Bangladesh Standard Time) = UTC+6  →  +06:00
   ═══════════════════════════════════════════════════════════════════ */
const CONFIG = {
  launchDate: new Date('2027-03-31T00:00:00+06:00'),
};


/* ═══════════════════════════════════════════════════════════════════
   2. PAGE LOAD ANIMATION
   ═══════════════════════════════════════════════════════════════════ */
function initPageLoad() {
  // Small rAF delay ensures CSSOM is ready before transitions fire
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });
  });

  // Update footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ═══════════════════════════════════════════════════════════════════
   3. COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════════════ */
function initCountdown() {
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
    label: document.getElementById('countdown-label'),
  };

  if (!els.days) return;

  const pad = (n) => String(n).padStart(2, '0');

  let prevSecs = -1;

  function tick() {
    const diff = CONFIG.launchDate.getTime() - Date.now();

    if (diff <= 0) {
      // Launch date passed
      if (els.label) els.label.textContent = 'EKA is live';
      els.days.textContent  = '00';
      els.hours.textContent = '00';
      els.mins.textContent  = '00';
      els.secs.textContent  = '00';
      return;
    }

    const totalSec  = Math.floor(diff / 1000);
    const secs  = totalSec % 60;
    const mins  = Math.floor(totalSec / 60) % 60;
    const hours = Math.floor(totalSec / 3600) % 24;
    const days  = Math.floor(totalSec / 86400);

    // Only update DOM when seconds change (saves reflows)
    if (secs === prevSecs) return;
    prevSecs = secs;

    els.days.textContent  = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent  = pad(mins);
    els.secs.textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 250); // Poll 4× per second for sub-second accuracy
}


/* ═══════════════════════════════════════════════════════════════════
   4. MOUSE PARALLAX — hero floating chips
   ═══════════════════════════════════════════════════════════════════ */
function initParallax() {
  // Only activate for fine-pointer devices (mouse/trackpad)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const chips = Array.from(document.querySelectorAll('.chip-wrap'));
  if (!chips.length) return;

  let rafId = null;
  let mouseX = 0.5;
  let mouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (rafId) return; // debounce to one RAF per frame
    rafId = requestAnimationFrame(() => {
      chips.forEach((chip) => {
        if (chip.offsetParent === null) return; // skip hidden chips
        const depth = parseFloat(chip.dataset.depth || '2');
        const maxPx = depth * 9;
        const dx = (mouseX - 0.5) * maxPx * 2;
        const dy = (mouseY - 0.5) * maxPx * 2;
        // translate3d hints the GPU without will-change memory overhead
        chip.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      });
      rafId = null;
    });
  }, { passive: true });
}


/* ═══════════════════════════════════════════════════════════════════
   5. SCROLL REVEAL — IntersectionObserver
   ═══════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-elem');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '-48px 0px' });

  targets.forEach((el) => io.observe(el));
}


/* ═══════════════════════════════════════════════════════════════════
   6. MODEL WALL SVG ANIMATION
   ═══════════════════════════════════════════════════════════════════ */
function initModelWall() {
  const section = document.getElementById('model-wall');
  if (!section) return;

  const hub         = document.getElementById('hub-group');
  const connections = Array.from(section.querySelectorAll('.conn'));
  const chipGroups  = Array.from(section.querySelectorAll('.chip-grp'));

  let animated = false;

  function runAnimation() {
    if (animated) return;
    animated = true;

    // Step 1 — Hub scales in first
    if (hub) hub.classList.add('is-visible');

    // Step 2 — Connection lines draw in (staggered)
    // The transition is already defined in CSS; we just change the values.
    connections.forEach((conn, i) => {
      setTimeout(() => {
        conn.style.strokeDashoffset = '0';
        conn.style.opacity = '1';
      }, 80 + i * 52);
    });

    // Step 3 — Chip groups fade/scale in (delay comes from CSS --chip-delay)
    chipGroups.forEach((chip) => {
      chip.classList.add('is-visible');
    });
  }

  // Trigger when 20% of the section is visible
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runAnimation();
      io.disconnect();
    }
  }, { threshold: 0.15 });

  io.observe(section);
}


/* ═══════════════════════════════════════════════════════════════════
   7. SVG CHIP HOVER INTERACTIONS
   ═══════════════════════════════════════════════════════════════════ */
function initChipHover() {
  const wrap = document.querySelector('.model-wall__svg-wrap');
  if (!wrap) return;

  const connections = Array.from(wrap.querySelectorAll('.conn'));
  const chipGroups  = Array.from(wrap.querySelectorAll('.chip-grp'));

  chipGroups.forEach((chip) => {
    const connIdx = parseInt(chip.dataset.conn || '0', 10);
    const conn = connections[connIdx];
    const bg   = chip.querySelector('.chip-bg');

    function highlight() {
      if (conn) conn.style.stroke = 'rgba(124,124,248,0.35)';
      if (bg) {
        bg.style.fill   = 'rgba(124,124,248,0.07)';
        bg.style.stroke = 'rgba(124,124,248,0.28)';
      }
    }

    function reset() {
      if (conn) conn.style.stroke = '';
      if (bg) { bg.style.fill = ''; bg.style.stroke = ''; }
    }

    chip.addEventListener('mouseenter', highlight);
    chip.addEventListener('mouseleave', reset);
    chip.addEventListener('focus',      highlight);
    chip.addEventListener('blur',       reset);
  });
}


/* ═══════════════════════════════════════════════════════════════════
   8. NAV SCROLL BEHAVIOUR
   ═══════════════════════════════════════════════════════════════════ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;

  function update() {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('nav--scrolled', scrolled);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // Initial check
}


/* ═══════════════════════════════════════════════════════════════════
   9. UTILITIES
   ═══════════════════════════════════════════════════════════════════ */

// Smooth-scroll anchor links (polyfill for browsers that ignore CSS scroll-behavior)
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Progress bar fill animation for the launch-progress section
function initProgressBars() {
  const wrap = document.querySelector('.progress-wrap');
  if (!wrap) return;

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      wrap.classList.add('is-visible');
      io.disconnect();
    }
  }, { threshold: 0.25 });

  io.observe(wrap);
}


/* ═══════════════════════════════════════════════════════════════════
   10. INIT
   ═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initCountdown();
  initScrollReveal();
  initModelWall();
  initNavScroll();
  initSmoothScroll();
  initProgressBars();

  // Parallax & hover only for pointer devices (skip on touch/mobile)
  if (window.matchMedia('(pointer: fine)').matches) {
    initParallax();
    initChipHover();
  }
});
