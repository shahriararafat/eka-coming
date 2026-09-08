# EKA AI — Coming Soon Page

> **Every AI. One Workspace.** — Premium launch page for [eka.bd](https://eka.bd)

A cinematic, animated coming-soon page built as a fully static website — no server, no build step, ready to publish directly to GitHub Pages.

---

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose `main` (or `master`) and the `/ (root)` folder.
5. Save — the site will be live at `https://username.github.io/repository-name/`.

That's it. No build required.

---

## Configuration

All launch-critical settings are at the top of **`js/main.js`**:

```js
const CONFIG = {
  // Change this single value to update the countdown everywhere.
  // Format: ISO 8601 with timezone offset.
  // BDT (Bangladesh Standard Time) = UTC+6 → +06:00
  launchDate: new Date('2027-03-31T00:00:00+06:00'),
};
```

Social links, nav links, feature copy, and model names are in **`index.html`** — search for the relevant section comments.

---

## Project Structure

```
eka-bd-comming-soon/
├── index.html          ← Single page (all sections inline)
├── css/
│   └── styles.css      ← All styles + animations + responsive
├── js/
│   └── main.js         ← Countdown, parallax, scroll reveal, model wall
└── README.md
```

---

## What's Inside

| Section | Description |
|---------|-------------|
| **Navigation** | Fixed nav, transparent → frosted on scroll, EKA logo + Follow button |
| **Hero** | Full-screen with 9 floating model name chips, mouse parallax, badge, headline, scroll cue |
| **Countdown** | Live Days/Hrs/Min/Sec countdown to `CONFIG.launchDate` |
| **What's Coming** | Numbered feature list with scroll-reveal and hover interactions |
| **Model Wall** | Radial SVG visualization: 10 AI models converging into EKA hub. Desktop full SVG; mobile simplified grid |
| **Launch Progress** | Subtle 4-step progress indicator |
| **Footer** | Logo, domain, nav links, social links, copyright |

---

## Design Details

- **Background:** `#060608` — near-black, very slightly blue-tinted
- **Accent:** `#7C7CF8` — restrained soft violet
- **Fonts:** Outfit (display headings) + Inter (body) via Google Fonts CDN
- **Animations:** CSS `transform`/`opacity` only — GPU-friendly, no layout triggers
- **Reduced motion:** All animations disabled when `prefers-reduced-motion: reduce` is set
- **Responsive:** 5 breakpoints — 1200px / 900px / 768px / 640px / 480px / 360px

---

## No Server Required

- No PHP, Python, Node.js, Express, or database
- No Appwrite, authentication, or payment integration  
- No build tools — edit and publish directly
- Works via `file://` in the browser for local development
- All asset paths are relative — works at any subdirectory URL path
