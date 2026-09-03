# akatuworthy — Portfolio

A clean, modern, responsive one-page personal portfolio for **akatuworthy**, an AI engineer building intelligent products with FastAPI, React, and PostgreSQL.

## What's here

- **Hero** — name, role line ("AI Engineer & Builder"), and a short tagline with call-to-action buttons.
- **Projects** — a selection of built work, each with a one-line description and its stack:
  - Ask an Elder (Idoma Living Knowledge Engine)
  - AI Interview Coach
  - SmartBudgetTracker
  - AI Customer Service Chatbot
  - techmate
  - SmartReply
  - AI Travel Companion
- **Skills & stack** — Python, FastAPI, React, PostgreSQL, Docker, OpenAI, Git, HTML/CSS/JS.
- **Contact** — email link to akatuworthy@gmail.com.
- **Responsive layout** — a working mobile hamburger nav and a layout that adapts to narrow screens, plus a consistent dark theme built on CSS custom properties.

## Running it locally

It's a pure static site — no frameworks, no build step, no external CDNs. Just serve the folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `styles.css` | Theming (CSS custom properties), layout, responsive rules |
| `script.js` | Mobile nav toggle, auto-updating year, reveal-on-scroll |

## Tech notes

- All styling is inline/local — nothing is fetched from a CDN.
- The dark theme uses CSS custom properties defined in `:root` for easy retheming.
- Accessibility-minded: skip link, ARIA labels on the nav toggle, keyboard-closable menu, `prefers-reduced-motion` support.
