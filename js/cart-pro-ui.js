// ECOMAX — CART UI
// UI ONLY.
// Does NOT open the cart.
// Does NOT close the cart.
// Does NOT use MutationObserver.

(function () {

  "use strict";

  if (
    window.__ECOMAX_CLEAN_CART_UI_V1__
  ) {
    return;
  }

  window.__ECOMAX_CLEAN_CART_UI_V1__ =
    true;

  const style =
    document.createElement("style");

  style.id =
    "ecomax-clean-cart-ui";

  style.textContent = `

    #cartOverlay {
      box-sizing: border-box !important;
    }

    #cartOverlay *,
    #cartOverlay *::before,
    #cartOverlay *::after {
      box-sizing: border-box !important;
    }

    #cartOverlay .cart-item {
      position: relative;

      display: grid !important;

      grid-template-columns:
        minmax(0, 1fr)
        auto
        auto;

      align-items: center;

      gap: 12px;

      padding: 14px 0 !important;

      border-bottom:
        1px solid
        rgba(255,255,255,.08) !important;
    }

    #cartOverlay .cart-item-info {
      min-width: 0;

      display: flex;

      flex-direction: column;

      gap: 4px;
    }

    #cartOverlay .cart-item-info strong {
      color: #f5fbff;

      font-weight: 900;

      line-height: 1.35;
    }

    #cartOverlay .cart-item-info span {
      color: #829aa6;

      font-size: 12px;
    }

    #cartOverlay .cart-item-price {
      color: #00eaff;

      font-weight: 900;

      white-space: nowrap;
    }

    #cartOverlay .remove-item {
      width: 34px !important;

      height: 34px !important;

      border-radius: 9px !important;

      border:
        1px solid
        rgba(255,70,100,.25) !important;

      background:
        rgba(255,70,100,.06) !important;

      color: #ff7187 !important;

      cursor: pointer;
    }

    #cartOverlay .empty-cart {
      text-align: center;

      padding: 38px 18px !important;

      color: #8198a5;
    }

    #cartOverlay .empty-cart > div {
      font-size: 45px;

      margin-bottom: 10px;

      filter:
        drop-shadow(
          0 0 18px
          rgba(0,234,255,.22)
        );
    }

    #cartOverlay .empty-cart h3 {
      margin: 0 0 7px;

      color: #ffffff;

      font-size: 18px;

      font-weight: 900;
    }

    #cartOverlay .empty-cart p {
      margin: 0;

      color: #78909c;

      font-size: 12px;
    }

    @media (max-width: 600px) {

      #cartOverlay {
        padding: 0 !important;
      }

      #cartOverlay .cart-item {
        grid-template-columns:
          minmax(0, 1fr)
          auto;

        gap: 8px;
      }

      #cartOverlay .cart-item-price {
        grid-column: 2;

        grid-row: 1;

        align-self: start;
      }

      #cartOverlay .remove-item {
        grid-column: 2;

        grid-row: 2;

        justify-self: end;
      }

    }

  `;

  document.head.appendChild(style);

})();
