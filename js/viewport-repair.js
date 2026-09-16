(function () {
  "use strict";

  function fixViewport() {
    const html = document.documentElement;
    const body = document.body;

    html.style.width = "100%";
    html.style.maxWidth = "100%";
    body.style.width = "100%";
    body.style.maxWidth = "100%";
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.overflowX = "hidden";

    document.querySelectorAll("*").forEach(function (el) {
      const r = el.getBoundingClientRect();

      if (r.left < -2 || r.right > window.innerWidth + 2) {
        el.style.maxWidth = "100%";
        el.style.minWidth = "0";
        el.style.boxSizing = "border-box";
      }
    });
  }

  function run() {
    fixViewport();

    setTimeout(fixViewport, 100);
    setTimeout(fixViewport, 500);
    setTimeout(fixViewport, 1000);
    setTimeout(fixViewport, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("load", fixViewport);
  window.addEventListener("resize", fixViewport);
  window.addEventListener("orientationchange", function () {
    setTimeout(fixViewport, 300);
  });
})();
