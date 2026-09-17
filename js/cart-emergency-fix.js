// ECOMAX — FINAL OVERLAY GUARD
// Cart and product detail modals start CLOSED.
// They open only after an explicit user click.

(function () {
  "use strict";

  if (window.__ECOMAX_FINAL_OVERLAY_GUARD_V3__) return;
  window.__ECOMAX_FINAL_OVERLAY_GUARD_V3__ = true;

  let cartUserOpen = false;
  let productUserOpen = false;

  function cart() {
    return document.getElementById("cartOverlay");
  }

  function productModal() {
    return document.getElementById("ecomaxStoreModal");
  }

  function hideCart() {
    const el = cart();
    if (!el) return;

    cartUserOpen = false;
    window.__ECOMAX_CART_USER_OPENED__ = false;

    el.classList.remove(
      "active",
      "open",
      "show",
      "visible",
      "ecomax-user-cart-open"
    );

    el.hidden = true;
    el.setAttribute("aria-hidden", "true");

    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");

    if (document.body) document.body.style.overflow = "";
  }

  function showCart() {
    const el = cart();
    if (!el) return false;

    cartUserOpen = true;
    window.__ECOMAX_CART_USER_OPENED__ = true;

    el.hidden = false;
    el.removeAttribute("aria-hidden");
    el.classList.add("active", "ecomax-user-cart-open");

    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("opacity", "1", "important");
    el.style.setProperty("pointer-events", "auto", "important");
    el.style.setProperty("z-index", "99999", "important");

    if (document.body) document.body.style.overflow = "hidden";

    if (typeof window.renderCart === "function") {
      try { window.renderCart(); } catch (e) {}
    }

    return false;
  }

  function hideProductModal() {
    const el = productModal();
    if (!el) return;

    productUserOpen = false;
    window.__ECOMAX_PRODUCT_USER_OPENED__ = false;

    el.classList.remove(
      "active",
      "open",
      "show",
      "visible",
      "ecomax-user-product-open"
    );

    el.hidden = true;
    el.setAttribute("aria-hidden", "true");

    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");

    if (!cartUserOpen && document.body) {
      document.body.style.overflow = "";
    }
  }

  function allowProductModal() {
    const el = productModal();
    if (!el) return false;

    productUserOpen = true;
    window.__ECOMAX_PRODUCT_USER_OPENED__ = true;

    el.hidden = false;
    el.removeAttribute("aria-hidden");
    el.classList.add("active", "ecomax-user-product-open");

    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("opacity", "1", "important");
    el.style.setProperty("pointer-events", "auto", "important");
    el.style.setProperty("z-index", "99998", "important");

    if (document.body) document.body.style.overflow = "hidden";

    return false;
  }

  /* =========================================================
     REMOVE ONLY THE EXTRA FLOATING CART SHORTCUT
     The real cart overlay (#cartOverlay) and checkout remain.
     ========================================================= */

  function removeFloatingCartShortcut() {
    if (!document.body) return;

    const explicitSelectors = [
      ".ecomax-cart-float",
      ".ecomax-floating-cart",
      ".ecomax-cart-widget",
      ".floating-cart",
      ".floating-cart-widget",
      ".mini-cart-widget",
      ".cart-preview",
      ".cart-preview-widget",
      ".cart-sticky",
      ".cart-bar",
      "[data-floating-cart]",
      "[data-cart-preview]"
    ];

    explicitSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.id !== "cartOverlay") el.remove();
      });
    });

    /*
      The old shortcut does not have a stable class in every version.
      Detect its exact visible wording and remove only its small/floating
      container. Never touch #cartOverlay or the real header cart button.
    */
    const nodes = Array.from(document.body.querySelectorAll("*"));

    nodes.forEach(function (el) {
      if (!el || el.id === "cartOverlay" || el.closest("#cartOverlay")) return;

      const text = String(el.textContent || "")
        .replace(/\s+/g, " ")
        .trim();

      const isShortcutText =
        text === "ECOMAX CART" ||
        (text.includes("ECOMAX CART") &&
         text.includes("კალათა ცარიელია") &&
         text.includes("კალათის ნახვა"));

      if (!isShortcutText) return;

      let node = el;

      for (let i = 0; i < 7 && node && node !== document.body; i++) {
        if (node.id === "cartOverlay") return;

        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const key = (
          String(node.id || "") + " " +
          String(typeof node.className === "string" ? node.className : "")
        ).toLowerCase();

        const floating =
          style.position === "fixed" ||
          style.position === "sticky" ||
          /floating|preview|mini-cart|cart-widget|cart-bar|cart-sticky/.test(key);

        const smallEnough =
          rect.width > 0 &&
          rect.width < Math.max(700, window.innerWidth * 0.9);

        if (floating && smallEnough) {
          node.remove();
          return;
        }

        node = node.parentElement;
      }
    });
  }

  /* =========================================================
     STARTUP CSS LOCK
     ========================================================= */

  const style = document.createElement("style");
  style.id = "ecomax-final-overlay-guard-css";
  style.textContent = `
    #cartOverlay:not(.ecomax-user-cart-open) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #ecomaxStoreModal:not(.ecomax-user-product-open) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #cartOverlay.ecomax-user-cart-open {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      z-index: 99999 !important;
    }

    #ecomaxStoreModal.ecomax-user-product-open {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      z-index: 99998 !important;
    }

    .ecomax-cart-float,
    .ecomax-floating-cart,
    .ecomax-cart-widget,
    .floating-cart,
    .floating-cart-widget,
    .mini-cart-widget,
    .cart-preview,
    .cart-preview-widget,
    .cart-sticky,
    .cart-bar,
    [data-floating-cart],
    [data-cart-preview] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  (document.head || document.documentElement).appendChild(style);

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.openCart = function () {
    return showCart();
  };

  window.closeCart = function () {
    hideCart();
  };

  window.__ECOMAX_CART_USER_OPENED__ = false;
  window.__ECOMAX_PRODUCT_USER_OPENED__ = false;

  function install() {
    /* ALWAYS START CLOSED */
    hideCart();
    hideProductModal();
    removeFloatingCartShortcut();

    /* =======================================================
       USER CLICK CONTROL
       ======================================================= */

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!target || !target.closest) return;

      /* CART BUTTON */
      const cartButton = target.closest(
        "#cartButton, .cart-button, [data-cart-button]"
      );

      if (cartButton) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showCart();
        return;
      }

      /* CART CLOSE */
      const cartClose = target.closest(
        "#cartClose, #closeCart, .cart-close, [data-cart-close], [data-close-cart]"
      );

      if (cartClose) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        hideCart();
        return;
      }

      /* PRODUCT DETAIL BUTTON */
      const detailButton = target.closest(
        ".store-detail-btn, [data-product-detail], [data-detail]"
      );

      if (detailButton) {
        productUserOpen = true;
        window.__ECOMAX_PRODUCT_USER_OPENED__ = true;
        allowProductModal();
        return;
      }

      /* PRODUCT MODAL CLOSE */
      const productClose = target.closest(
        ".store-modal-close, #storeModalClose, [data-store-modal-close]"
      );

      if (productClose) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        hideProductModal();
        return;
      }

      /* CLICK ON PRODUCT BACKDROP */
      const pm = productModal();
      if (pm && target === pm) {
        hideProductModal();
      }

      /* CLICK ON CART BACKDROP */
      const co = cart();
      if (co && target === co) {
        hideCart();
      }
    }, true);

    /* ESC closes either modal */
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      hideCart();
      hideProductModal();
    }, true);

    /* Targeted modal observer only. */
    const observer = new MutationObserver(function () {
      const c = cart();
      if (c && !cartUserOpen) {
        const visible =
          c.classList.contains("active") ||
          c.classList.contains("open") ||
          c.classList.contains("show") ||
          c.style.display === "flex" ||
          c.hidden === false;

        if (visible) hideCart();
      }

      const p = productModal();
      if (p && !productUserOpen) {
        const visible =
          p.classList.contains("active") ||
          p.classList.contains("open") ||
          p.classList.contains("show") ||
          p.style.display === "flex" ||
          p.hidden === false;

        if (visible) hideProductModal();
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden"]
    });

    window.__ECOMAX_OVERLAY_OBSERVER__ = observer;

    /* Catch the legacy floating shortcut if another script injects it later. */
    [0, 150, 400, 800, 1500, 3000].forEach(function (delay) {
      setTimeout(removeFloatingCartShortcut, delay);
    });

    /* Extra modal startup checks for asynchronously loaded scripts. */
    [0, 100, 300, 700, 1500, 3000, 5000].forEach(function (delay) {
      setTimeout(function () {
        if (!cartUserOpen) hideCart();
        if (!productUserOpen) hideProductModal();
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }

})();
