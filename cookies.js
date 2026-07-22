/**
 * FlashFix — Consentement cookies + Google Analytics
 * Remplace GA_MEASUREMENT_ID par ton ID (ex: G-XXXXXXXXXX)
 */
(function () {
  var GA_MEASUREMENT_ID = window.FLASHFIX_GA_ID || "";
  var STORAGE_KEY = "flashfix_cookie_consent";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;
    if (window.__ffGaLoaded) return;
    window.__ffGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
  }

  function hideBanner() {
    var el = document.getElementById("cookieBanner");
    if (el) {
      el.classList.remove("is-visible");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 320);
    }
  }

  function showBanner() {
    if (document.getElementById("cookieBanner")) return;

    var banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Consentement aux cookies");
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
      '<div class="cookie-banner__text">' +
      "<strong>Cookies &amp; mesure d’audience</strong>" +
      "<p>Nous utilisons Google Analytics pour comprendre comment le site est utilisé et l’améliorer. " +
      "Aucun cookie publicitaire. Vous pouvez accepter ou refuser.</p>" +
      '<a href="politique-confidentialite.html">Politique de confidentialité</a>' +
      "</div>" +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="cookie-btn cookie-btn--ghost" data-consent="denied">Refuser</button>' +
      '<button type="button" class="cookie-btn cookie-btn--gold" data-consent="granted">Accepter</button>' +
      "</div>" +
      "</div>";

    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      banner.classList.add("is-visible");
    });

    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var value = btn.getAttribute("data-consent");
      setConsent(value);
      if (value === "granted") loadAnalytics();
      hideBanner();
    });
  }

  function init() {
    var consent = getConsent();
    if (consent === "granted") {
      loadAnalytics();
      return;
    }
    if (consent === "denied") return;
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
