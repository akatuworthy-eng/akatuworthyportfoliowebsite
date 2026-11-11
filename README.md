# akatuworthy — Portfolio

A responsive multi-page portfolio for **akatuworthy**, an AI engineer and product builder. Its visual direction uses an immersive 3D opening, editorial project previews, oversized typography, a full-screen lime navigation, and a bright contact close. The static site uses the existing Three.js, Lenis, and GSAP stack, with a CSS transition fallback between pages.

## What's here

- **Scroll-led 3D chapters** — The Three.js scene changes position, scale, lighting, and camera distance in sync with Lenis and GSAP ScrollTrigger.
- **Pinned project reel** — Seven projects move horizontally through a full-screen desktop gallery, with a vertical card layout on mobile.
- **Immersive details** — Full-screen transition chapter, animated marquee, scroll progress indicator, and responsive reveal motion.
- **Selected work** — Seven projects presented with custom CSS artwork and compact project descriptions.
- **Four pages** — Home, project archive, About, and Contact, each with shared navigation and footer links.
- **Page transitions** — A color curtain transition with reduced-motion support and same-origin navigation handling.
- **About** — A short statement about the product approach and areas of focus.
- **Contact** — A high contrast closing section with a direct email link.
- **Full-screen navigation** — Responsive menu with keyboard support, Escape handling, and accessible state updates.
- **Motion and fallback support** — Lenis smooth scrolling, GSAP ScrollTrigger choreography, native reveal fallback, WebGL detection, and reduced-motion handling.

## Running it locally

It remains a pure static site with local vendored libraries — no npm dependencies or build tools needed:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page, project reel, and WebGL canvas container |
| `work.html` | Full project archive |
| `about.html` | Approach and capabilities |
| `contact.html` | Contact page |
| `styles.css` | Shared visual theme, project artwork, and responsive home page styles |
| `pages.css` | Shared page layouts and route transition styles |
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
   - Color variables are defined in `:root` inside `styles.css` (`--bg`, `--acid`, `--mono`).
   - 3D lights and materials in `three-scene.js` use a matching lime and olive palette.
