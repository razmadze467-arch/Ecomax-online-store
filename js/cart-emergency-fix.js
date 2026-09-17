// ECOMAX — FINAL CART CONTROLLER
// Prevents automatic cart opening.
// Cart opens only after a real user click.

(function () {
  "use strict";

  if (window.__ECOMAX_FINAL_CART_CONTROLLER_V1__) return;

  window.__ECOMAX_FINAL_CART_CONTROLLER_V1__ = true;

  let userGesture = false;

  function getCartOverlay() {
    return document.getElementById("cartOverlay");
  }

  function hideCart() {
    const overlay = getCartOverlay();

    if (!overlay) return;

    overlay.classList.remove(
      "active",
      "open",
      "show",
      "visible",
      "ecomax-user-cart-open"
    );

    overlay.hidden = true;

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    overlay.style.setProperty(
      "display",
      "none",
      "important"
    );

    overlay.style.setProperty(
      "visibility",
      "hidden",
      "important"
    );

    overlay.style.setProperty(
      "opacity",
      "0",
      "important"
    );

    overlay.style.setProperty(
      "pointer-events",
      "none",
      "important"
    );

    if (document.body) {
      document.body.style.overflow = "";
    }
  }

  function openCartByUser() {
    const overlay = getCartOverlay();

    if (!overlay) return false;

    window.__ECOMAX_CART_USER_OPENED__ = true;

    overlay.hidden = false;

    overlay.removeAttribute(
      "aria-hidden"
    );

    overlay.classList.add(
      "active",
      "ecomax-user-cart-open"
    );

    overlay.style.setProperty(
      "display",
      "flex",
      "important"
    );

    overlay.style.setProperty(
      "visibility",
      "visible",
      "important"
    );

    overlay.style.setProperty(
      "opacity",
      "1",
      "important"
    );

    overlay.style.setProperty(
      "pointer-events",
      "auto",
      "important"
    );

    overlay.style.setProperty(
      "z-index",
      "99999",
      "important"
    );

    if (document.body) {
      document.body.style.overflow = "hidden";
    }

    if (
      typeof window.renderCart ===
      "function"
    ) {
      try {
        window.renderCart();
      } catch (error) {
        console.warn(
          "ECOMAX renderCart error:",
          error
        );
      }
    }

    return false;
  }

  /*
   * ABSOLUTE STARTUP LOCK
   */
  const style =
    document.createElement("style");

  style.id =
    "ecomax-final-cart-startup-lock";

  style.textContent = `
    #cartOverlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #cartOverlay.active:not(.ecomax-user-cart-open),
    #cartOverlay.open:not(.ecomax-user-cart-open),
    #cartOverlay.show:not(.ecomax-user-cart-open),
    #cartOverlay.visible:not(.ecomax-user-cart-open) {
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
  `;

  (
    document.head ||
    document.documentElement
  ).appendChild(style);

  /*
   * IMPORTANT:
   * Any programmatic openCart() call is blocked.
   * Only a user gesture can open it.
   */
  window.openCart = function () {

    if (!userGesture) {
      hideCart();
      return false;
    }

    userGesture = false;

    return openCartByUser();
  };

  /*
   * Close API
   */
  window.closeCart = function () {

    userGesture = false;

    window.__ECOMAX_CART_USER_OPENED__ =
      false;

    hideCart();
  };

  /*
   * Initial state
   */
  window.__ECOMAX_CART_USER_OPENED__ =
    false;

  function install() {

    hideCart();

    /*
     * CAPTURE PHASE
     *
     * This runs before normal onclick handlers.
     */
    document.addEventListener(
      "click",
      function (event) {

        const target =
          event.target;

        if (
          !target ||
          !target.closest
        ) {
          return;
        }

        /*
         * CART BUTTON
         */
        const cartButton =
          target.closest(
            "#cartButton," +
            ".cart-button," +
            "[data-cart-button]"
          );

        if (cartButton) {

          event.preventDefault();
          event.stopPropagation();

          userGesture = true;

          /*
           * Directly open here.
           * We do not depend on another JS file.
           */
          openCartByUser();

          userGesture = false;

          return;
        }

        /*
         * CLOSE BUTTON
         */
        const closeButton =
          target.closest(
            "#cartClose," +
            "#closeCart," +
            ".cart-close," +
            "[data-cart-close]," +
            "[data-close-cart]"
          );

        if (closeButton) {

          event.preventDefault();
          event.stopPropagation();

          window.__ECOMAX_CART_USER_OPENED__ =
            false;

          hideCart();

          return;
        }

        /*
         * CLICK OUTSIDE CART
         */
        const overlay =
          getCartOverlay();

        if (
          overlay &&
          target === overlay
        ) {

          event.preventDefault();
          event.stopPropagation();

          window.__ECOMAX_CART_USER_OPENED__ =
            false;

          hideCart();
        }

      },
      true
    );

    /*
     * ESC
     */
    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key ===
          "Escape"
        ) {

          window.__ECOMAX_CART_USER_OPENED__ =
            false;

          hideCart();
        }

      },
      true
    );

    /*
     * If some other JS tries to open
     * the overlay later, close it.
     *
     * NO MutationObserver.
     */
    let checks = 0;

    const timer =
      setInterval(
        function () {

          checks++;

          const overlay =
            getCartOverlay();

          if (overlay) {

            if (
              !window.__ECOMAX_CART_USER_OPENED__
            ) {
              hideCart();
            }

          }

          if (checks >= 40) {
            clearInterval(timer);
          }

        },
        250
      );
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );

  } else {

    install();

  }

})();
