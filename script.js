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
    menu.setAttribute("aria-hidden", String(!open));
    if (toggle) {
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    document.body.classList.toggle("menu-open", open);
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
    if (open) {
      var firstMenuLink = menu.querySelector(".menu-links a");
      if (firstMenuLink) firstMenuLink.focus();
    }
  }
  window.setMenu = setMenu;

  if (toggle && menu) {
    var closeButton = document.getElementById("menuClose");
    menu.querySelectorAll(".menu-links a").forEach(function (link) {
      var targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.pathname === window.location.pathname) link.setAttribute("aria-current", "page");
    });
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    if (closeButton) closeButton.addEventListener("click", function () {
      setMenu(false);
      toggle.focus();
    });

    // Close the menu after choosing a destination.
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setMenu(false);
        if (toggle) toggle.focus();
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

  var progressBar = document.getElementById("scrollProgressBar");
  var progressPending = false;
  function updatePageProgress() {
    if (!progressBar || progressPending) return;
    progressPending = true;
    window.requestAnimationFrame(function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.transform = "scaleX(" + Math.max(0, Math.min(1, progress)) + ")";
      progressPending = false;
    });
  }
  window.addEventListener("scroll", updatePageProgress, { passive: true });
  window.addEventListener("resize", updatePageProgress, { passive: true });
  updatePageProgress();

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
          lenis.scrollTo(target, { duration: 1.2 });
        }
        setMenu(false);
      }
    });
  });

  // Keep same-origin page changes intentional and cinematic while allowing
  // modified clicks, external links, and reduced-motion users to behave natively.
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target || link.hasAttribute("download")) return;
    var destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || !/\.html$/.test(destination.pathname)) return;
    if (destination.pathname === window.location.pathname) {
      e.preventDefault();
      if (destination.hash) {
        var samePageTarget = document.querySelector(destination.hash);
        if (samePageTarget && lenis) lenis.scrollTo(samePageTarget, { duration: 1.1 });
        else if (samePageTarget) samePageTarget.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        else if (lenis) lenis.scrollTo(0, { duration: 1.1 });
        else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      } else if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }
    if (prefersReducedMotion) return;
    e.preventDefault();
    document.body.classList.add("route-leaving");
    window.setTimeout(function () { window.location.assign(destination.href); }, 480);
  });

  /* Handle initial hash on page load */
  if (window.location.hash) {
    setTimeout(function () {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        if (lenis) {
          lenis.scrollTo(hashTarget, { immediate: true });
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
  if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);

  if (!prefersReducedMotion && hasGSAP && sceneInitialized && window.Portfolio3D.coreGroup && document.querySelector(".hero")) {
    setupScrollChoreography();
  } else if (sceneInitialized && !prefersReducedMotion) {
    // Simple native scroll listener fallback for 3D response
    setupScrollFallback();
  }

  function setupScrollChoreography() {
    var core = window.Portfolio3D.coreGroup;
    var root = window.Portfolio3D.rootGroup;
    var cam = window.Portfolio3D.camera;
    var isMobile = window.innerWidth < 900;

    window.gsap.fromTo(".hero-copy", { opacity: 0, y: 54 }, {
      opacity: 1, y: 0, duration: 1.25, delay: 0.25, ease: "power3.out",
    });
    window.gsap.fromTo(".hero-kicker", { opacity: 0, y: 15 }, {
      opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power2.out",
    });

    // The 3D form travels through each dark chapter as one continuous scene.
    window.gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        endTrigger: "#approach",
        end: "bottom top",
        scrub: 1.25,
      },
    })
      .to(root.position, { x: isMobile ? 0.3 : 0.9, y: -0.25, ease: "none" }, 0.35)
      .to(core.scale, { x: isMobile ? 1.1 : 1.42, y: isMobile ? 1.1 : 1.42, z: isMobile ? 1.1 : 1.42, ease: "none" }, 0.35)
      .to(core.rotation, { y: "+=2.2", x: "+=0.5", z: "+=0.2", ease: "none" }, 0)
      .to(cam.position, { z: isMobile ? 7.2 : 5.5, ease: "none" }, 0.42)
      .to(window.Portfolio3D.interactiveLight, { intensity: 5.5, ease: "none" }, 0.3);

    window.gsap.timeline({
      scrollTrigger: {
        trigger: "#approach",
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    })
      .to(root.position, { x: isMobile ? -0.5 : -1.8, y: 0.35, ease: "none" }, 0)
      .to(core.scale, { x: isMobile ? 0.82 : 1.08, y: isMobile ? 0.82 : 1.08, z: isMobile ? 0.82 : 1.08, ease: "none" }, 0)
      .to(core.rotation, { y: "+=2.5", z: "-=0.7", ease: "none" }, 0)
      .to(".interlude-orb", { rotation: 13, scale: 1.12, ease: "none" }, 0)
      .to(".interlude-copy", { y: -26, opacity: 0.86, ease: "none" }, 0)
      .to(cam.position, { z: isMobile ? 8.5 : 7.2, ease: "none" }, 0);

    // Pin the selected work and let the projects pass through like a film reel.
    if (!isMobile) {
      var rail = document.querySelector(".work-rail");
      var track = document.querySelector(".work-grid");
      var cards = document.querySelectorAll(".work-grid .project");
      var railTl = window.gsap.timeline({
        scrollTrigger: {
          trigger: "#work",
          start: "top top",
          end: function () { return "+=" + Math.max(1200, track.scrollWidth - rail.clientWidth); },
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      railTl.to(track, { x: function () { return -(track.scrollWidth - rail.clientWidth); }, ease: "none" }, 0);
      cards.forEach(function (card, index) {
        railTl.fromTo(card, { y: 30, opacity: 0.58 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.22 }, index * 0.13);
        var art = card.querySelector(".project-art");
        if (art) railTl.fromTo(art, { scale: 0.94 }, { scale: 1, ease: "power2.out", duration: 0.26 }, index * 0.13);
      });
    } else {
      document.querySelectorAll(".work-grid .project").forEach(function (card) {
        window.gsap.fromTo(card, { opacity: 0, y: 35 }, {
          opacity: 1, y: 0, duration: 0.75, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
        });
      });
    }

    // The scene returns behind the final approach and blooms toward contact.
    window.gsap.timeline({
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom center", scrub: 1.1 },
    })
      .to(root.position, { x: isMobile ? 0.2 : 1.7, y: -0.2, ease: "none" }, 0)
      .to(core.scale, { x: isMobile ? 1.12 : 1.42, y: isMobile ? 1.12 : 1.42, z: isMobile ? 1.12 : 1.42, ease: "none" }, 0)
      .to(core.rotation, { y: "+=2.4", x: "-=0.4", ease: "none" }, 0)
      .to(cam.position, { z: isMobile ? 6.8 : 5.4, ease: "none" }, 0);

    if (window.Portfolio3D.interactiveLight) {
      window.gsap.to(window.Portfolio3D.interactiveLight, {
        intensity: 5.8,
        scrollTrigger: { trigger: "#contact", start: "top bottom", end: "center center", scrub: 0.8 },
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
  var revealSelector = hasGSAP && !prefersReducedMotion && sceneInitialized && document.querySelector(".hero")
    ? ".reveal:not(.project)"
    : ".reveal";
  var revealEls = document.querySelectorAll(revealSelector);

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
