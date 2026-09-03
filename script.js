/* akatuworthy — portfolio interactions
   Pure vanilla JS. No dependencies. */

(function () {
  "use strict";

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

  /* ---------- Reveal-on-scroll (progressive enhancement) ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
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
    // Fallback: just show everything.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
