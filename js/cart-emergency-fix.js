// ECOMAX — FINAL OVERLAY GUARD
// Cart and product detail modals start CLOSED.
// They open only after an explicit user click.

(function () {
  "use strict";

  if (window.__ECOMAX_FINAL_OVERLAY_GUARD_V2__) return;
  window.__ECOMAX_FINAL_OVERLAY_GUARD_V2__ = true;

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
        /* Tell the guard this modal was intentionally requested. */
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

    /* =======================================================
       TARGETED OBSERVER
       Only watches the two modal elements.
       It does NOT touch the rest of the page.
       ======================================================= */

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

    /* Extra startup checks for scripts that load asynchronously. */
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
