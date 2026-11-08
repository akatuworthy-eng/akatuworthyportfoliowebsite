/* akatuworthy — portfolio interactions
   Enhanced with Three.js 3D visuals, Lenis smooth scroll & GSAP ScrollTrigger choreography.
   Progressive enhancement: gracefully degrades if WebGL or external scripts are unavailable. */

(function () {
  "use strict";

  /* ---------- Motion Preference & Device Check ---------- */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    if (toggle) {
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", String(open));
    }
  }
  window.setMenu = setMenu;

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });

    // Close the menu after clicking a link (mobile).
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setMenu(false);
      }
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        if (toggle) toggle.focus();
      }
    });
  }

  /* ---------- Auto-update footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 1. Initialize Three.js 3D Scene ---------- */
  var sceneInitialized = false;
  if (window.Portfolio3D && typeof window.Portfolio3D.init === "function") {
    sceneInitialized = window.Portfolio3D.init("#canvas-container");
  }

  /* ---------- 2. Initialize Lenis Smooth Scroll ---------- */
  var lenis = null;
  if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.25,
    });
    window.lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger if available
    if (
      typeof window.gsap !== "undefined" &&
      typeof window.ScrollTrigger !== "undefined"
    ) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      lenis.on("scroll", window.ScrollTrigger.update);

      window.gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- 3. Smooth Anchor Navigation ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target =
        targetId === "#top"
          ? document.body
          : document.querySelector(targetId);

      if (target) {
        if (lenis) {
          e.preventDefault();
          var offset = targetId === "#top" ? 0 : -70;
          lenis.scrollTo(target, { offset: offset, duration: 1.2 });
        }
        setMenu(false);
      }
    });
  });

  /* Handle initial hash on page load */
  if (window.location.hash) {
    setTimeout(function () {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        if (lenis) {
          lenis.scrollTo(hashTarget, { immediate: true, offset: -70 });
        } else {
          hashTarget.scrollIntoView();
        }
        if (typeof window.ScrollTrigger !== "undefined") {
          window.ScrollTrigger.update();
        }
      }
    }, 150);
  }

  /* ---------- 4. Scroll-Driven 3D Choreography & Reveals ---------- */
  var hasGSAP =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  if (!prefersReducedMotion && hasGSAP && sceneInitialized && window.Portfolio3D.coreGroup) {
    setupScrollChoreography();
  } else if (sceneInitialized) {
    // Simple native scroll listener fallback for 3D response
    setupScrollFallback();
  }

  function setupScrollChoreography() {
    var core = window.Portfolio3D.coreGroup;
    var root = window.Portfolio3D.rootGroup;
    var cam = window.Portfolio3D.camera;
    var isMobile = window.innerWidth < 900;

    // A. Transition from Hero to Projects
    window.gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      })
      .to(
        root.position,
        {
          x: isMobile ? -0.3 : -2.6,
          y: -0.3,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        core.scale,
        {
          x: isMobile ? 0.95 : 1.3,
          y: isMobile ? 0.95 : 1.3,
          z: isMobile ? 0.95 : 1.3,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        core.rotation,
        {
          y: "+=1.6",
          x: "+=0.35",
          ease: "power1.inOut",
        },
        0
      );

    // B. Projects Section Scroll — Continuous Dynamic Orbit & Lateral Shift
    window.gsap
      .timeline({
        scrollTrigger: {
          trigger: "#projects",
          start: "top center",
          end: "bottom center",
          scrub: 1.4,
        },
      })
      .to(
        root.position,
        {
          x: isMobile ? 0.35 : 2.5,
          y: 0.1,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        core.rotation,
        {
          y: "+=2.4",
          z: "+=0.4",
          ease: "power1.inOut",
        },
        0
      );

    // C. Transition from Skills into Contact Section
    window.gsap
      .timeline({
        scrollTrigger: {
          trigger: "#skills",
          start: "bottom bottom",
          endTrigger: "#contact",
          end: "center center",
          scrub: 1.2,
        },
      })
      .to(
        root.position,
        {
          x: 0,
          y: isMobile ? -0.2 : -0.35,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        core.scale,
        {
          x: isMobile ? 0.9 : 1.2,
          y: isMobile ? 0.9 : 1.2,
          z: isMobile ? 0.9 : 1.2,
          ease: "power1.inOut",
        },
        0
      )
      .to(
        core.rotation,
        {
          y: "+=1.8",
          ease: "power1.inOut",
        },
        0
      );

    // D. Interactive Light Focus on Contact
    if (window.Portfolio3D.interactiveLight) {
      window.gsap.to(window.Portfolio3D.interactiveLight, {
        intensity: 4.2,
        scrollTrigger: {
          trigger: "#contact",
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

    // Refresh ScrollTrigger when window resizes
    window.addEventListener("resize", function () {
      window.ScrollTrigger.refresh();
    });
  }

  function setupScrollFallback() {
    window.addEventListener(
      "scroll",
      function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        var progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        if (window.Portfolio3D.rootGroup) {
          var isMobile = window.innerWidth < 900;
          if (progress < 0.33) {
            var p0 = progress / 0.33;
            var startX = isMobile ? 0 : 1.9;
            var endX = isMobile ? -0.3 : -2.6;
            window.Portfolio3D.rootGroup.position.x =
              startX + (endX - startX) * p0;
          } else if (progress < 0.66) {
            var p1 = (progress - 0.33) / 0.33;
            var startX1 = isMobile ? -0.3 : -2.6;
            var endX1 = isMobile ? 0.35 : 2.5;
            window.Portfolio3D.rootGroup.position.x =
              startX1 + (endX1 - startX1) * p1;
          } else {
            var p2 = (progress - 0.66) / 0.34;
            var startX2 = isMobile ? 0.35 : 2.5;
            window.Portfolio3D.rootGroup.position.x =
              startX2 + (0 - startX2) * p2;
          }
        }
      },
      { passive: true }
    );
  }

  /* ---------- 5. Reveal-on-scroll (Enhanced with GSAP / IO) ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && hasGSAP) {
    revealEls.forEach(function (el) {
      window.gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  } else if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Immediate fallback: make everything visible
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 6. Proper Lifecycle Cleanup ---------- */
  window.addEventListener("beforeunload", function () {
    if (
      window.Portfolio3D &&
      typeof window.Portfolio3D.destroy === "function"
    ) {
      window.Portfolio3D.destroy();
    }
    if (lenis && typeof lenis.destroy === "function") {
      lenis.destroy();
    }
    if (typeof window.ScrollTrigger !== "undefined") {
      window.ScrollTrigger.getAll().forEach(function (t) {
        t.kill();
      });
    }
  });
})();
