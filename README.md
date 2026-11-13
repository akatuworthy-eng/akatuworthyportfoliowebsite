# akatuworthy — AI Engineer & Builder

A responsive, multi-page software portfolio built around the work on [github.com/akatuworthy-eng](https://github.com/akatuworthy-eng). It uses page transitions, a Three.js home hero, a keyboard-operable project reel, a searchable and filterable project archive, custom interface illustrations for all eight projects, and data-driven case-study routes with scroll-linked project workflows.

## Pages

- index.html — cinematic intro, interactive project reel, featured projects, capabilities, contact
- about.html — approach, principles, skills, and an animated visual chapter
- work.html — filterable archive of selected projects
- project.html?project=slug — unique case-study content rendered by a reusable template
- contact.html — email and social contact links

The visual direction is a cohesive cyberpunk interface: midnight surfaces, cyan and magenta signal colors, technical grid details, and a recolored Three.js scene. The visual system is applied consistently across the home, about, project archive, contact, and case-study routes. Navigation uses a full-screen keyboard-accessible menu and animated curtain transitions. Reduced-motion preferences simplify the animation sequences. The project reel is manually browsed and never autoplays.

## Run locally

No install or build step is needed. Three.js, Lenis, GSAP, and ScrollTrigger are vendored in vendor/.

    python3 -m http.server 8000

Open http://localhost:8000.

## Update content

Edit portfolio-data.js to update the profile, page copy, services, links, and project records. Each project's slug determines its URL, for example project.html?project=smartreply. Replace the associated SVG in assets/projects/ to change a project's visual; the current illustrations are interface concepts, not product screenshots. Project descriptions are based on the GitHub profile README and public repository READMEs.

## Source layout

    .
    ├── index.html
    ├── about.html
    ├── work.html
    ├── contact.html
    ├── project.html
    ├── portfolio-data.js
    ├── script.js
    ├── styles.css
    ├── pages.css
    ├── reference.css
    ├── cyberpunk.css
    ├── three-scene.js
    ├── assets/projects/
    └── vendor/
        ├── three.min.js
        ├── lenis.min.js
        ├── gsap.min.js
        └── ScrollTrigger.min.js
