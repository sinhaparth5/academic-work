document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  // ── Nav toggle ──────────────────────────────────────────
  var toggle = document.querySelector(".aw-nav-toggle");
  var nav    = document.querySelector(".aw-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("aw-nav--open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove("aw-nav--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ── PDF links → open in new tab ─────────────────────────
  document.querySelectorAll('a[href$=".pdf"]').forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    if (!link.querySelector(".aw-pdf-badge")) {
      var badge = document.createElement("span");
      badge.className = "aw-pdf-badge";
      badge.textContent = "PDF";
      link.appendChild(badge);
    }
  });

});
