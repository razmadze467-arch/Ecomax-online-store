// ECOMAX — SIMPLE CART CONTROLLER
// The cart is closed on startup and opens only from the real cart button.
// No MutationObserver, no DOM-wide scans, no repeated timers.
(function () {
  "use strict";

  if (window.__ECOMAX_SIMPLE_CART_CONTROLLER_V1__) return;
  window.__ECOMAX_SIMPLE_CART_CONTROLLER_V1__ = true;

  function getCart() {
    return document.getElementById("cartOverlay");
  }

  function hideCart() {
    const el = getCart();
    if (!el) return;

    window.__ECOMAX_CART_USER_OPENED__ = false;
    el.classList.remove("active", "open", "show", "visible", "ecomax-user-cart-open");
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("pointer-events", "none", "important");
    if (document.body) document.body.style.overflow = "";
  }

  function showCart() {
    const el = getCart();
    if (!el) return false;

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

  window.openCart = showCart;
  window.closeCart = hideCart;

  function install() {
    // Always begin closed.
    hideCart();

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!target || !target.closest) return;

      const close = target.closest("#cartClose, #closeCart, .cart-close, [data-cart-close], [data-close-cart]");
      if (close) {
        event.preventDefault();
        event.stopPropagation();
        hideCart();
        return;
      }

      const button = target.closest("#cartButton, .cart-button, [data-cart-button]");
      if (button) {
        event.preventDefault();
        event.stopPropagation();
        showCart();
        return;
      }

      const overlay = getCart();
      if (overlay && target === overlay) hideCart();
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideCart();
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
