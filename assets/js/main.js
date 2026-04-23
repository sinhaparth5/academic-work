document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".aw-nav-toggle");
  var nav    = document.querySelector(".aw-nav");

  if (toggle && nav) {
    var setNavigationState = function (isOpen) {
      nav.classList.toggle("aw-nav--open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close main navigation" : "Open main navigation");
    };

    toggle.addEventListener("click", function () {
      setNavigationState(!nav.classList.contains("aw-nav--open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavigationState(false);
      });
    });

    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        setNavigationState(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setNavigationState(false);
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href$=".pdf"]').forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    if (!link.querySelector(".aw-pdf-badge")) {
      var badge = document.createElement("span");
      badge.className = "aw-pdf-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = "PDF";
      link.appendChild(badge);
    }

    if (!link.querySelector(".aw-new-tab-note")) {
      var note = document.createElement("span");
      note.className = "aw-sr-only aw-new-tab-note";
      note.textContent = " (PDF, opens in a new tab)";
      link.appendChild(note);
    }
  });

  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    });
  }

});
