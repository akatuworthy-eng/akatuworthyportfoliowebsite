/* akatuworthy — portfolio interactions
   Enhanced with Three.js 3D visuals, Lenis smooth scroll & GSAP ScrollTrigger choreography.
   Progressive enhancement: gracefully degrades if WebGL or external scripts are unavailable. */

(function () {
  "use strict";

  /* ---------- Shared portfolio data and route rendering ---------- */
  var content = window.PORTFOLIO || {};
  var page = document.body.dataset.page || "home";
  var projectList = content.projects || [];
  function getPath(object, path) { return path.split(".").reduce(function (value, key) { return value && value[key]; }, object); }
  if (content.name && page === "home") document.title = content.name + " — " + (content.role || "Portfolio");
  var descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && content.pageDescription && page === "home") descriptionMeta.setAttribute("content", content.pageDescription);
  var yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  document.querySelectorAll("[data-content]").forEach(function (node) {
    var value = getPath(content, node.getAttribute("data-content"));
    if (value != null) node.textContent = value;
  });
  document.querySelectorAll("[data-html]").forEach(function (node) {
    var value = getPath(content, node.getAttribute("data-html"));
    if (value != null) node.innerHTML = value;
  });
  document.querySelectorAll("[data-email-link]").forEach(function (node) { node.href = "mailto:" + (content.email || "hello@example.com"); });
  var navLinks = document.getElementById("navLinks");
  if (navLinks) {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.innerHTML = (content.navigation || []).map(function (item, index) {
      var active = currentPage === item.href ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + active + '><small>0' + (index + 1) + '</small>' + item.label + '<span>↗</span></a>';
    }).join("");
  }
  var focusList = document.getElementById("focusList");
  if (focusList) focusList.innerHTML = (getPath(content, "about.skills") || []).map(function (item) { return "<b>" + item + "</b>"; }).join("");
  var marqueeTrack = document.getElementById("marqueeTrack");
  if (marqueeTrack) {
    var marqueeItems = content.marquee || ["Ideas", "Systems", "People"];
    marqueeTrack.innerHTML = marqueeItems.concat(marqueeItems).map(function (item, index) { return (index ? '<i aria-hidden="true">✳</i>' : "") + "<span>" + item + "</span>"; }).join("");
  }
  function renderCard(project, index) {
    var tags = (project.stack || []).slice(0, 3).map(function (tag) { return "<span>" + tag + "</span>"; }).join("");
    var searchText = [project.title, project.kind, project.category, project.short].concat(project.stack || []).join(" ").toLowerCase();
    return '<article class="project' + (index === 0 ? ' project-large' : '') + '" data-category="' + project.category + '" data-search="' + searchText.replace(/"/g, "&quot;") + '"><a class="project-link" href="project.html?project=' + encodeURIComponent(project.slug) + '" aria-label="View case study: ' + project.title + '"><div class="project-art art-' + project.theme + '"><img src="' + project.image + '" alt="Illustrated interface preview for ' + project.title + '" width="1200" height="900" loading="lazy" decoding="async"><span class="art-index">' + String(index + 1).padStart(2, "0") + '</span><span class="art-caption">' + project.kind + '</span><span class="project-view-label">View case study <i>↗</i></span></div><div class="project-meta"><div><span class="project-type">' + project.kind + '</span><h3>' + project.title + '</h3></div><span class="project-arrow" aria-hidden="true">↗</span></div><p class="project-summary">' + project.short + '</p><div class="project-tags">' + tags + '</div></a></article>';
  }
  var featuredProjects = document.getElementById("featuredProjects");
  if (featuredProjects) {
    var featuredList = projectList.slice(0, 5);
    featuredProjects.innerHTML = featuredList.map(renderCard).join("");
    var featuredCount = document.getElementById("featuredCount");
    if (featuredCount) featuredCount.textContent = "01 — " + String(featuredList.length).padStart(2, "0") + " / Featured projects";
  }
  var archiveProjects = document.getElementById("archiveProjects");
  if (archiveProjects) archiveProjects.innerHTML = projectList.map(renderCard).join("");
  var reel = document.getElementById("portfolioReel");
  if (reel && projectList.length) {
    var reelIndex = 0;
    var reelImage = document.getElementById("reelImage");
    var reelKind = document.getElementById("reelKind");
    var reelIndexLabel = document.getElementById("reelIndex");
    var reelTitle = document.getElementById("reelTitle");
    var reelDescription = document.getElementById("reelDescription");
    var reelCaseLink = document.getElementById("reelCaseLink");
    var reelCount = document.getElementById("reelCount");
    var reelProgress = document.getElementById("reelProgress");
    var reelChangeTimer = 0;
    function showReelProject(index) {
      reelIndex = (index + projectList.length) % projectList.length;
      var project = projectList[reelIndex];
      window.clearTimeout(reelChangeTimer);
      reelImage.classList.add("is-changing");
      reelChangeTimer = window.setTimeout(function () {
        reelImage.src = project.image;
        reelImage.alt = "Illustrated project interface for " + project.title;
        reelKind.textContent = project.kind;
        reelIndexLabel.textContent = String(reelIndex + 1).padStart(2, "0") + " / " + String(projectList.length).padStart(2, "0") + " · " + project.year;
        reelTitle.textContent = project.title;
        reelDescription.textContent = project.short;
        reelCaseLink.href = "project.html?project=" + encodeURIComponent(project.slug);
        reelCount.textContent = String(reelIndex + 1).padStart(2, "0") + " of " + String(projectList.length).padStart(2, "0");
        reelProgress.querySelectorAll("button").forEach(function (button, buttonIndex) {
          button.classList.toggle("is-active", buttonIndex === reelIndex);
          button.setAttribute("aria-current", buttonIndex === reelIndex ? "step" : "false");
        });
        reelImage.classList.remove("is-changing");
      }, prefersReducedMotion ? 0 : 150);
    }
    reelProgress.innerHTML = projectList.map(function (project, index) {
      return '<button type="button" aria-label="Show project ' + (index + 1) + ': ' + project.title + '" aria-current="' + (index === 0 ? "step" : "false") + '" class="' + (index === 0 ? "is-active" : "") + '"></button>';
    }).join("");
    reelProgress.querySelectorAll("button").forEach(function (button, index) {
      button.addEventListener("click", function () { showReelProject(index); });
    });
    document.getElementById("openPortfolioReel").addEventListener("click", function () {
      showReelProject(0);
      reel.showModal();
      if (lenis) lenis.stop();
      document.getElementById("closePortfolioReel").focus();
    });
    document.getElementById("closePortfolioReel").addEventListener("click", function () { reel.close(); });
    reel.addEventListener("close", function () { if (lenis) lenis.start(); });
    reel.addEventListener("click", function (event) {
      if (event.target === reel) reel.close();
    });
    reel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") { event.preventDefault(); showReelProject(reelIndex + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); showReelProject(reelIndex - 1); }
    });
    document.getElementById("reelPrevious").addEventListener("click", function () { showReelProject(reelIndex - 1); });
    document.getElementById("reelNext").addEventListener("click", function () { showReelProject(reelIndex + 1); });
  }
  var workProjectCount = document.getElementById("workProjectCount");
  if (workProjectCount) workProjectCount.textContent = String(projectList.length).padStart(2, "0") + " / Independent projects";
  var archivePeriod = document.getElementById("archivePeriod");
  if (archivePeriod && projectList.length) {
    var projectYears = projectList.map(function (project) { return Number(project.year); }).filter(Number.isFinite);
    archivePeriod.textContent = "Selected projects · " + (projectYears.length ? Math.min.apply(Math, projectYears) + "—" + Math.max.apply(Math, projectYears) : "ongoing");
  }
  var serviceList = document.getElementById("serviceList");
  if (serviceList) serviceList.innerHTML = (content.services || []).map(function (service, index) {
    return '<div class="service-row"><span>0' + (index + 1) + '</span><h3>' + service + '</h3><b aria-hidden="true">↗</b></div>';
  }).join("");
  document.querySelectorAll("[data-social-links]").forEach(function (list) {
    list.innerHTML = (content.social || []).map(function (item) { return '<a href="' + item.href + '" target="_blank" rel="noopener noreferrer">' + item.label + ' ↗</a>'; }).join("");
  });
  var principleList = document.getElementById("principleList");
  if (principleList) principleList.innerHTML = (content.about.principles || []).map(function (item, index) {
    return '<article class="pillar"><small>0' + (index + 1) + '</small><h3>' + item.title + '</h3><p>' + item.description + '</p><span>↗</span></article>';
  }).join("");
  var skillList = document.getElementById("skillList");
  if (skillList) skillList.innerHTML = (content.about.skills || []).map(function (skill, index) { return '<span class="skill-chip"><small>0' + (index + 1) + '</small>' + skill + '</span>'; }).join("");
  var projectRoot = document.getElementById("projectPage");
  if (projectRoot) renderProjectPage(projectRoot);
  function renderProjectPage(root) {
    var slug = new URLSearchParams(window.location.search).get("project");
    var index = projectList.findIndex(function (item) { return item.slug === slug; });
    var project = projectList[index];
    if (!project) {
      root.innerHTML = '<section class="missing-project"><p class="eyebrow">Project not found</p><h1>That case study<br><em>isn’t here.</em></h1><a class="text-link" href="work.html">Back to all projects <span>↗</span></a></section>';
      return;
    }
    document.title = project.title + " — " + content.name;
    var stack = project.stack.map(function (item, stackIndex) { return '<span class="project-stack-chip"><small>0' + (stackIndex + 1) + '</small>' + item + '</span>'; }).join("");
    var projectSteps = project.steps || [];
    var processNodes = projectSteps.map(function (step, stepIndex) {
      var ordinal = String(stepIndex + 1).padStart(2, "0");
      return '<article class="case-step" data-case-step="' + stepIndex + '" aria-current="' + (stepIndex === 0 ? "step" : "false") + '"><span class="case-step-number">' + ordinal + '</span><div><p class="eyebrow">Stage ' + ordinal + '</p><h3>' + step.title + '</h3><p>' + step.description + '</p></div></article>';
    }).join("");
    var processDots = projectSteps.map(function (_, stepIndex) { return '<i class="' + (stepIndex === 0 ? "is-active" : "") + '"></i>'; }).join("");
    var previous = projectList[(index + projectList.length - 1) % projectList.length];
    var next = projectList[(index + 1) % projectList.length];
    root.innerHTML =
      '<section class="case-hero"><div class="case-hero-copy"><p class="eyebrow">' + project.kind + ' <span>·</span> ' + project.year + '</p><h1>' + project.title + '<span>.</span></h1><p class="case-lede">' + project.short + '</p><a href="#case-story" class="scroll-cue">Explore the project <b>↓</b></a></div><div class="case-hero-art art-' + project.theme + '"><img src="' + project.image + '" alt="Illustrated interface preview for ' + project.title + '" width="1200" height="900" fetchpriority="high" decoding="async"></div><span class="case-hero-count">0' + (index + 1) + ' / 0' + projectList.length + '</span></section>' +
      '<section class="case-story section-wrap" id="case-story"><p class="eyebrow">The project</p><h2>' + project.description + '</h2><div class="case-facts"><div><small>MY ROLE</small><p>' + project.role + '</p></div><div><small>YEAR</small><p>' + project.year + '</p></div><div><small>FOCUS</small><p>' + project.kind + '</p></div></div></section>' +
      '<section class="case-process" id="case-process"><div class="case-process-visual" aria-hidden="true"><p class="eyebrow">System / in motion</p><div class="process-orbit"><span class="process-orbit-ring ring-a"></span><span class="process-orbit-ring ring-b"></span><div class="process-core"></div><div class="process-dot-map">' + processDots + '</div></div><div class="process-current"><small id="processCurrentCount">01 / ' + String(projectSteps.length).padStart(2, "0") + '</small><b id="processCurrentTitle">' + (projectSteps[0] ? projectSteps[0].title : "Project flow") + '</b></div></div><div class="case-process-list"><p class="eyebrow">How it works / 01—' + String(projectSteps.length).padStart(2, "0") + '</p>' + processNodes + '</div></section>' +
      '<section class="case-image-chapter"><div class="case-image-frame art-' + project.theme + '"><img src="' + project.image + '" alt="" loading="lazy"></div><span class="case-image-caption">PROJECT VISUAL / ' + project.title.toUpperCase() + '</span></section>' +
      '<section class="case-outcome section-wrap"><div><p class="eyebrow">What it does</p><h2>Designed around a <em>real need.</em></h2></div><p>' + project.outcome + '</p></section>' +
      '<section class="case-stack section-wrap"><p class="eyebrow">Tools &amp; systems</p><div class="project-stack-list">' + stack + '</div><div class="case-project-links">' + (project.live ? '<a class="source-link" href="' + project.live + '" target="_blank" rel="noopener noreferrer">Open live project <span>↗</span></a>' : "") + (project.repo ? '<a class="source-link" href="' + project.repo + '" target="_blank" rel="noopener noreferrer">Explore source on GitHub <span>↗</span></a>' : "") + '</div></section>' +
      '<nav class="case-pagination" aria-label="More case studies"><a href="project.html?project=' + previous.slug + '"><small>PREVIOUS PROJECT</small><span>←</span><b>' + previous.title + '</b></a><a href="project.html?project=' + next.slug + '"><small>NEXT PROJECT</small><span>→</span><b>' + next.title + '</b></a></nav>';
  }
  var filterGroup = document.querySelector(".project-filters");
  var activeProjectFilter = "All";
  var projectSearch = document.getElementById("projectSearch");
  var archiveEmpty = document.getElementById("archiveEmpty");
  var projectResultCount = document.getElementById("projectResultCount");
  function updateArchive() {
    if (!archiveProjects) return;
    var query = (projectSearch ? projectSearch.value : "").trim().toLowerCase();
    var visible = 0;
    archiveProjects.querySelectorAll(".project").forEach(function (card) {
      var categoryMatch = activeProjectFilter === "All" || card.dataset.category === activeProjectFilter;
      var searchMatch = !query || card.dataset.search.indexOf(query) !== -1;
      card.hidden = !(categoryMatch && searchMatch);
      if (!card.hidden) visible += 1;
    });
    if (projectResultCount) projectResultCount.textContent = String(visible).padStart(2, "0") + " / " + String(projectList.length).padStart(2, "0") + " projects";
    if (archiveEmpty) archiveEmpty.hidden = visible > 0;
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  if (filterGroup && content.work && content.work.filters) {
    filterGroup.innerHTML = content.work.filters.map(function (filter, index) {
      var count = filter === "All" ? projectList.length : projectList.filter(function (item) { return item.category === filter; }).length;
      return '<button class="' + (index === 0 ? "is-active" : "") + '" type="button" data-project-filter="' + filter + '">' + filter + '<span>' + String(count).padStart(2, "0") + '</span></button>';
    }).join("");
    filterGroup.querySelectorAll("[data-project-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeProjectFilter = button.dataset.projectFilter;
        filterGroup.querySelectorAll("button").forEach(function (item) { item.classList.toggle("is-active", item === button); });
        updateArchive();
      });
    });
  }
  if (projectSearch) {
    projectSearch.addEventListener("input", updateArchive);
    document.addEventListener("keydown", function (event) {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        event.preventDefault(); projectSearch.focus();
      }
      if (event.key === "Escape" && document.activeElement === projectSearch && projectSearch.value) {
        projectSearch.value = ""; updateArchive();
      }
    });
    updateArchive();
  }

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
      var firstMenuControl = menu.querySelector("button, a[href]");
      if (firstMenuControl) firstMenuControl.focus();
    }
  }
  window.setMenu = setMenu;

  if (toggle && menu) {
    var closeButton = document.getElementById("menuClose");
    menu.querySelectorAll(".menu-links a").forEach(function (link) {
      var targetUrl = new URL(link.href, window.location.href);
      var currentPath = window.location.pathname.endsWith("/") ? window.location.pathname + "index.html" : window.location.pathname;
      if (targetUrl.pathname === currentPath) link.setAttribute("aria-current", "page");
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
      if (e.key === "Tab" && menu.classList.contains("is-open")) {
        var focusable = menu.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
  if (!prefersReducedMotion && window.Portfolio3D && typeof window.Portfolio3D.init === "function") {
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
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
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
  if (!hasGSAP) document.documentElement.classList.add("no-gsap");
  if (prefersReducedMotion) document.documentElement.classList.add("motion-reduced");
  if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);

  // Give each route's supporting copy and section intros a shared, subtle entrance.
  if (!prefersReducedMotion && hasGSAP) {
    document.querySelectorAll(".about-bottom, .section-heading, .about-intro-copy, .portrait-copy, .skills-stage > div, .about-note, .archive-top, .archive-bottom, .case-story .case-facts, .case-outcome > p, .case-stack .project-stack-list").forEach(function (element) {
      window.gsap.fromTo(element, { y: 24, opacity: 0.25 }, {
        y: 0, opacity: 1, ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 90%", end: "top 65%", scrub: 0.65 },
      });
    });
  }

  // Small pointer response on the project artwork; omitted for touch and reduced motion.
  if (!prefersReducedMotion && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("pointermove", function (event) {
      var card = event.target.closest(".project-link");
      if (!card) return;
      var bounds = card.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width;
      var y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--pointer-x", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--pointer-y", (y * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  if (!prefersReducedMotion && hasGSAP && sceneInitialized && window.Portfolio3D.coreGroup && document.querySelector(".hero")) {
    setupScrollChoreography();
  } else if (sceneInitialized && !prefersReducedMotion) {
    // Simple native scroll listener fallback for 3D response
    setupScrollFallback();
  }
  if (!prefersReducedMotion && hasGSAP && page === "home" && !sceneInitialized) {
    setupProjectRail();
  }

  function setupProjectRail() {
    document.querySelectorAll("#featuredProjects .project").forEach(function (card, index) {
      window.gsap.fromTo(card, { y: 54, opacity: 0.25 }, {
        y: 0, opacity: 1, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 92%", end: "top 60%", scrub: 0.8 },
      });
      var image = card.querySelector(".project-art img");
      if (image) window.gsap.fromTo(image, { scale: 1.14 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });
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
        end: "bottom top",
        scrub: 1.25,
      },
    })
      .to(root.position, { x: isMobile ? 0.3 : 0.9, y: -0.25, ease: "none" }, 0.35)
      .to(core.scale, { x: isMobile ? 1.1 : 1.42, y: isMobile ? 1.1 : 1.42, z: isMobile ? 1.1 : 1.42, ease: "none" }, 0.35)
      .to(core.rotation, { y: "+=2.2", x: "+=0.5", z: "+=0.2", ease: "none" }, 0)
      .to(cam.position, { z: isMobile ? 7.2 : 5.5, ease: "none" }, 0.42)
      .to(window.Portfolio3D.interactiveLight, { intensity: 5.5, ease: "none" }, 0.3)
      .to(".hero h1", { yPercent: -18, opacity: 0.3, ease: "none" }, 0.38)
      .to(".hero-orbit", { scale: 1.18, rotation: 12, opacity: 0.9, ease: "none" }, 0.2);

    window.gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    })
      .to(root.position, { x: isMobile ? -0.5 : -1.8, y: 0.35, ease: "none" }, 0)
      .to(core.scale, { x: isMobile ? 0.82 : 1.08, y: isMobile ? 0.82 : 1.08, z: isMobile ? 0.82 : 1.08, ease: "none" }, 0)
      .to(core.rotation, { y: "+=2.5", z: "-=0.7", ease: "none" }, 0)
      .to(".about-statement", { y: -42, ease: "none" }, 0)
      .to(cam.position, { z: isMobile ? 8.5 : 7.2, ease: "none" }, 0);

    // Let the two-column project gallery reveal as an editorial sequence.
    document.querySelectorAll(".work-grid .project").forEach(function (card, index) {
      window.gsap.fromTo(card, { opacity: 0.12, y: 60 }, {
        opacity: 1, y: 0, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 91%", end: "top 55%", scrub: 0.85 },
        delay: index % 2 ? 0.08 : 0,
      });
      var art = card.querySelector(".project-art");
      if (art) window.gsap.fromTo(art, { clipPath: "inset(5% 5% 5% 5%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: card, start: "top 90%", end: "center center", scrub: 0.85 },
      });
    });

    // Carry the 3D scene into the final invitation chapter.
    window.gsap.timeline({
      scrollTrigger: { trigger: "#contact", start: "top bottom", end: "center center", scrub: 1.1 },
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

    window.gsap.fromTo(".service-row", { x: 34, opacity: 0.25 }, {
      x: 0, opacity: 1, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: ".service-list", start: "top 82%", end: "bottom 58%", scrub: 0.8 },
    });
    window.gsap.fromTo(".contact h2", { y: 70, opacity: 0.35 }, {
      y: 0, opacity: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".contact", start: "top 75%", end: "center center", scrub: 0.8 },
    });

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

  /* Each route uses its own scroll choreography. */
  if (!prefersReducedMotion && hasGSAP) {
    if (page === "work") {
      window.gsap.fromTo(".work-route-hero h1", { clipPath: "inset(0 0 100% 0)", y: 36 }, {
        clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.1, ease: "power3.out", delay: 0.18,
      });
      document.querySelectorAll("#archiveProjects .project").forEach(function (card, index) {
        var direction = index % 2 ? 45 : -45;
        window.gsap.fromTo(card, { x: direction, opacity: 0.15 }, {
          x: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", end: "top 55%", scrub: 0.8 },
        });
        var image = card.querySelector(".project-art img");
        if (image) window.gsap.fromTo(image, { scale: 1.18 }, {
          scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
    } else if (page === "about") {
      window.gsap.fromTo(".about-route-hero h1", { y: 70, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.18,
      });
      window.gsap.to(".about-core", {
        rotation: 38, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: ".portrait-stage", start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      window.gsap.to(".orbit-a", {
        rotation: 32, ease: "none",
        scrollTrigger: { trigger: ".portrait-stage", start: "top bottom", end: "bottom top", scrub: 1.4 },
      });
      document.querySelectorAll(".pillar").forEach(function (row, index) {
        window.gsap.fromTo(row, { x: 46, opacity: 0.25 }, {
          x: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 88%", end: "top 64%", scrub: 0.7, delay: index * 0.05 },
        });
      });
      document.querySelectorAll(".skill-chip").forEach(function (chip, index) {
        window.gsap.fromTo(chip, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: ".skill-cloud", start: "top 86%", end: "top 55%", scrub: 0.75 },
          delay: index * 0.03,
        });
      });
    } else if (page === "contact") {
      window.gsap.fromTo(".contact-main h1", { clipPath: "inset(0 0 100% 0)", y: 55 }, {
        clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.2, ease: "power3.out", delay: 0.2,
      });
      window.gsap.to(".contact-page-orb", {
        yPercent: -14, rotation: 12, ease: "none",
        scrollTrigger: { trigger: ".contact-page", start: "top top", end: "bottom top", scrub: 1.2 },
      });
      window.gsap.fromTo(".contact-detail-row", { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.55,
      });
    } else if (page === "project") {
      window.gsap.fromTo(".case-hero-copy", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.05, ease: "power3.out", delay: 0.18,
      });
      window.gsap.fromTo(".case-hero-art img", { scale: 1.18 }, {
        scale: 1, duration: 1.5, ease: "power3.out", delay: 0.1,
      });
      window.gsap.to(".case-hero-art", {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".case-hero", start: "top top", end: "bottom top", scrub: 1.1 },
      });
      var caseSteps = document.querySelectorAll(".case-step");
      function setActiveCaseStep(index) {
        caseSteps.forEach(function (step, stepIndex) {
          var active = stepIndex === index;
          step.classList.toggle("is-active", active);
          step.setAttribute("aria-current", active ? "step" : "false");
        });
        var activeStep = caseSteps[index];
        var count = document.getElementById("processCurrentCount");
        var title = document.getElementById("processCurrentTitle");
        var dots = document.querySelectorAll(".process-dot-map i");
        if (activeStep && count && title) {
          count.textContent = String(index + 1).padStart(2, "0") + " / " + String(caseSteps.length).padStart(2, "0");
          title.textContent = activeStep.querySelector("h3").textContent;
        }
        dots.forEach(function (dot, dotIndex) { dot.classList.toggle("is-active", dotIndex === index); });
        window.gsap.to(".process-core", { rotation: index * 22, scale: 1 + index * 0.025, duration: 0.55, ease: "power2.out" });
      }
      caseSteps.forEach(function (step, index) {
        window.ScrollTrigger.create({
          trigger: step,
          start: "top 67%",
          end: "bottom 48%",
          onEnter: function () { setActiveCaseStep(index); },
          onEnterBack: function () { setActiveCaseStep(index); },
        });
      });
      window.gsap.fromTo(".case-image-frame", { clipPath: "inset(12% 12% 12% 12%)", scale: 0.92 }, {
        clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".case-image-chapter", start: "top 78%", end: "center center", scrub: 0.9 },
      });
      document.querySelectorAll(".case-facts>div,.project-stack-chip").forEach(function (item) {
        window.gsap.fromTo(item, { y: 22, opacity: 0.2 }, {
          y: 0, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 90%", end: "top 68%", scrub: 0.7 },
        });
      });
    }
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
