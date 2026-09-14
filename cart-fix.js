/* ECOMAX CART BRIDGE — cart UI is owned by store-ui/script.js */
(function () {
  function readCart() {
    try {
      const c = JSON.parse(localStorage.getItem('ecomax_cart') || '[]');
      return Array.isArray(c) ? c : [];
    } catch (_) { return []; }
  }
  function notify(text) {
    if (typeof window.showNotification === 'function') return window.showNotification(text);
    if (typeof window.note === 'function') return window.note(text);
    const n = document.createElement('div');
    n.textContent = text;
    n.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999;padding:14px 18px;background:#03101c;color:#00eaff;border:1px solid #00eaff;border-radius:10px;font-weight:700';
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2200);
  }

  // IMPORTANT: .add-cart is intentionally NOT intercepted here.
  // store-ui.js owns product quantity/volume handling and calls window.addToCart().
  // Intercepting it at document-capture level used to force every click to quantity 1.
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest && e.target.closest('.add-cart');
    if (addBtn) return;

    const cartBtn = e.target.closest && e.target.closest('#cartButton');
    if (cartBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const overlay = document.getElementById('cartOverlay');
      if (overlay) {
        overlay.classList.add('active');
        overlay.style.display = 'flex';
        overlay.style.zIndex = '5000';
        document.body.style.overflow = 'hidden';
      }
      if (typeof window.updateCart === 'function') window.updateCart();
      else if (typeof window.renderCart === 'function') window.renderCart();
      return;
    }

    const checkoutBtn = e.target.closest && e.target.closest('#checkoutButton');
    if (checkoutBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (readCart().length) window.location.assign('checkout.html');
      else notify('კალათა ცარიელია');
    }
  }, true);
})();
