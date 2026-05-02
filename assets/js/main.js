document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var consentBanner = document.querySelector("[data-aw-consent]");
  var toggle = document.querySelector(".aw-nav-toggle");
  var nav    = document.querySelector(".aw-nav");
  var getCookie = function (name) {
    var prefix = encodeURIComponent(name) + "=";

    return document.cookie
      .split(";")
      .map(function (cookie) {
        return cookie.trim();
      })
      .filter(function (cookie) {
        return cookie.indexOf(prefix) === 0;
      })
      .map(function (cookie) {
        return decodeURIComponent(cookie.slice(prefix.length));
      })[0] || null;
  };

  var setCookie = function (name, value, maxAge) {
    var cookie = [
      encodeURIComponent(name) + "=" + encodeURIComponent(value),
      "Path=/",
      "Max-Age=" + String(maxAge),
      "SameSite=Lax"
    ];

    if (window.location.protocol === "https:") {
      cookie.push("Secure");
    }

    document.cookie = cookie.join("; ");
  };

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

  if (consentBanner) {
    var consentKey = "aw-cookie-consent";
    var gtmId = consentBanner.getAttribute("data-gtm-id");
    var gaId = consentBanner.getAttribute("data-ga-id");
    var consentMaxAge = 60 * 60 * 24 * 180;
    var consentValue = getCookie(consentKey);

    var loadGoogleTagManager = function (id) {
      if (!id || window.awGoogleTagManagerLoaded) {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

      var script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(id);
      document.head.appendChild(script);

      window.awGoogleTagManagerLoaded = true;
    };

    var loadGoogleAnalytics = function (id) {
      if (!id || window.awGoogleAnalyticsLoaded) {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
      };

      var script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(script);

      window.gtag("js", new Date());
      window.gtag("config", id);
      window.awGoogleAnalyticsLoaded = true;
    };

    var applyAnalyticsConsent = function (value) {
      if (value === "accepted") {
        loadGoogleTagManager(gtmId);
        loadGoogleAnalytics(gaId);
      }

      consentBanner.hidden = true;
    };

    if (consentValue === "accepted" || consentValue === "declined") {
      applyAnalyticsConsent(consentValue);
    } else {
      consentBanner.hidden = false;
    }

    consentBanner.querySelectorAll("[data-aw-consent-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-aw-consent-action");
        var value = action === "accept" ? "accepted" : "declined";

        setCookie(consentKey, value, consentMaxAge);
        applyAnalyticsConsent(value);
      });
    });
  }

});
