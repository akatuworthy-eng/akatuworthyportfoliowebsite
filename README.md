# akatuworthy — Portfolio

A modern, responsive personal portfolio for **akatuworthy**, an AI engineer building intelligent products with FastAPI, React, and PostgreSQL — upgraded with an immersive Three.js WebGL experience, smooth scroll choreography, and interactive 3D objects.

## What's here

- **3D Living Intelligence Core** — A Three.js WebGL scene featuring a multifaceted translucent icosahedron shell, a luminous wireframe lattice, instanced vertex knowledge nodes, a nested counter-rotating energy core, 3 gyroscopic orbital rings with an orbiting satellite beacon, and a volumetric neural particle field with harmonic wave drift.
- **Scroll-Driven Choreography** — Camera and 3D object motion synced to scroll progress using **Lenis** smooth scrolling and **GSAP ScrollTrigger**, gliding smoothly behind content as you transition between Hero, Projects, Skills, and Contact.
- **Interactive Pointer Parallax** — Subtle, non-intrusive cursor and pointer parallax with reactive point lighting tracking the cursor, without hijacking native touch gestures or links.
- **Glassmorphic HUD Cards** — High-contrast translucent cards with backdrop blur for project cards and skill chips, keeping all text crisp and WCAG compliant over the 3D canvas.
- **Hero** — Name, role line ("AI Engineer & Builder"), tagline with call-to-action buttons, and stats highlights.
- **Projects** — 7 built projects with stacks (Ask an Elder, AI Interview Coach, SmartBudgetTracker, AI Customer Service Chatbot, techmate, SmartReply, AI Travel Companion).
- **Skills & stack** — Python, FastAPI, React, PostgreSQL, Docker, OpenAI, Git, HTML/CSS/JS.
- **Contact** — Direct collaboration email CTA with luminous beacon focus.
- **Accessibility & Fallbacks** — WebGL feature detection with graceful static fallback, full keyboard navigation, skip link, ARIA states, and strict `prefers-reduced-motion` compliance.

## Running it locally

It remains a pure static site with local vendored libraries — no npm dependencies or build tools needed:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure, semantic content, and WebGL canvas container |
| `styles.css` | Theming, CSS variables, canvas layering, glassmorphic HUD styling, responsive rules |
| `three-scene.js` | Three.js scene setup, 3D geometries, particle system, lighting, pointer tracking, and cleanup |
| `script.js` | Lenis smooth scroll, GSAP ScrollTrigger choreography, mobile nav, and lifecycle management |
| `vendor/` | Vendored runtime libraries (`three.min.js`, `lenis.min.js`, `gsap.min.js`, `ScrollTrigger.min.js`) |

## Customization & Swapping 3D Models

1. **Swapping in a Custom 3D Model (GLTF / GLB)**:
   - Add `vendor/GLTFLoader.js` (from `three/examples/js/loaders/GLTFLoader.js`).
   - In `three-scene.js`, use `new THREE.GLTFLoader().load('path/to/model.glb', (gltf) => { this.coreGroup.add(gltf.scene); })`.
   - The scroll choreography and pointer parallax will automatically apply to your custom model via `this.coreGroup`.

2. **Adjusting Rotation and Motion**:
   - In `three-scene.js`, modify `baseRotY` and `baseRotX` in `Portfolio3D.animate()` to speed up or slow down idle rotation.
   - Adjust `particleCount` in `buildNeuralParticleField()` (default: 900 desktop, 420 mobile).

3. **Retheming**:
   - Color variables are defined in `:root` inside `styles.css` (`--bg`, `--accent`, `--mono`).
   - 3D lights and materials in `three-scene.js` use matching hex values (`0x5eead4` for teal accent, `0x38bdf8` for cyber cyan, `0x0b0e14` for background).
