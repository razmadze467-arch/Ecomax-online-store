/* ECOMAX CART FIX — capture clicks before legacy handlers */
(function () {
  function readCart() {
    try {
      const c = JSON.parse(localStorage.getItem('ecomax_cart') || '[]');
      return Array.isArray(c) ? c : [];
    } catch (_) { return []; }
  }
  function writeCart(c) { localStorage.setItem('ecomax_cart', JSON.stringify(c)); }
  function notify(text) {
    if (typeof window.showNotification === 'function') return window.showNotification(text);
    const n = document.createElement('div');
    n.textContent = text;
    n.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:99999;padding:14px 18px;background:#03101c;color:#00eaff;border:1px solid #00eaff;border-radius:10px;font-weight:700';
    document.body.appendChild(n); setTimeout(() => n.remove(), 2200);
  }
  function add(button) {
    const name = button.dataset.name || '';
    const price = Number(button.dataset.price);
    const volume = button.dataset.volume || '';
    if (!name || !Number.isFinite(price) || price <= 0) { notify('პროდუქტის დამატება ვერ მოხერხდა'); return; }
    const cart = readCart();
    const old = cart.find(x => x.name === name && x.volume === volume);
    if (old) old.quantity = Number(old.quantity || 0) + 1;
    else cart.push({ name, price, volume, quantity: 1 });
    writeCart(cart);
    const count = cart.reduce((s, x) => s + Number(x.quantity || 0), 0);
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = String(count);
    if (typeof window.renderCart === 'function') window.renderCart();
    notify(name + ' დაემატა კალათაში');
  }
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest && e.target.closest('.add-cart');
    if (addBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      add(addBtn);
      return;
    }
    const cartBtn = e.target.closest && e.target.closest('#cartButton');
    if (cartBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const overlay = document.getElementById('cartOverlay');
      if (overlay) { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
      if (typeof window.renderCart === 'function') window.renderCart();
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
