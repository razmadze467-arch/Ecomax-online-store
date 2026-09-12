"use strict";

let cart = [];
try { cart = JSON.parse(localStorage.getItem("ecomax_cart") || "[]"); } catch (e) { cart = []; }
if (!Array.isArray(cart)) cart = [];

const save = () => localStorage.setItem("ecomax_cart", JSON.stringify(cart));
const total = () => cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0);
const esc = v => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

function note(text) {
  document.querySelector(".ecomax-notification")?.remove();
  const n = document.createElement("div");
  n.className = "ecomax-notification";
  n.textContent = text;
  Object.assign(n.style, {
    position: "fixed", right: "20px", bottom: "20px", zIndex: "99999",
    padding: "14px 18px", background: "#03101c", color: "#00eaff",
    border: "1px solid #00eaff", borderRadius: "10px", fontWeight: "700"
  });
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}

/* =========================================================
   ECOMAX AUTH UI
   Keep the homepage header synchronized with the SAME
   Supabase persisted session used by login/account pages.
   ========================================================= */
async function syncAuthUI() {
  try {
    if (!window.supabase || !window.ECOMAX_SUPABASE) return;

    const client = window.supabase.createClient(
      window.ECOMAX_SUPABASE.url,
      window.ECOMAX_SUPABASE.key,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    const login = document.getElementById("loginLink");
    const register = document.getElementById("registerLink");
    const account = document.getElementById("authAccountLink");
    const mobileNav = document.getElementById("mobileNav");

    let mobileLogin = mobileNav?.querySelector('a[href="login.html"]');
    let mobileRegister = mobileNav?.querySelector('a[href="register.html"]');
    let mobileAccount = mobileNav?.querySelector('a[data-auth-account]');

    if (mobileNav && !mobileAccount) {
      mobileAccount = document.createElement("a");
      mobileAccount.href = "account.html";
      mobileAccount.textContent = "ჩემი ანგარიში";
      mobileAccount.dataset.authAccount = "true";
      mobileNav.appendChild(mobileAccount);
    }

    function apply(session) {
      const loggedIn = !!session?.user;

      if (login) login.style.display = loggedIn ? "none" : "inline-flex";
      if (register) register.style.display = loggedIn ? "none" : "inline-flex";
      if (account) account.style.display = loggedIn ? "inline-flex" : "none";

      if (mobileLogin) mobileLogin.style.display = loggedIn ? "none" : "block";
      if (mobileRegister) mobileRegister.style.display = loggedIn ? "none" : "block";
      if (mobileAccount) mobileAccount.style.display = loggedIn ? "block" : "none";
    }

    /* First render from the persisted session. */
    const { data, error } = await client.auth.getSession();
    if (!error) apply(data?.session || null);

    /* Keep it correct after login/logout/token refresh/navigation. */
    client.auth.onAuthStateChange((_event, session) => {
      apply(session || null);
    });
  } catch (error) {
    console.warn("ECOMAX auth UI:", error);
  }
}

function renderCart() {
  const el = document.getElementById("cartItems");
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<div class="empty-cart"><div>🛒</div><h3>კალათა ცარიელია</h3><p>დაამატე პროდუქტი კალათაში.</p></div>';
    return;
  }
  el.innerHTML = cart.map((i, n) => `
    <div class="cart-item">
      <div class="cart-item-info"><strong>${esc(i.name)}</strong><span>${esc(i.volume)} × ${i.quantity}</span></div>
      <div class="cart-item-price">${Number(i.price) * Number(i.quantity)} ₾</div>
      <button type="button" class="remove-item" data-index="${n}">×</button>
    </div>`).join("");
}

function updateCart() {
  const count = cart.reduce((s, i) => s + Number(i.quantity || 0), 0);
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = total() + " ₾";
  renderCart();
  save();
}

function addToCart(name, price, volume) {
  price = Number(price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    note("პროდუქტის დამატება ვერ მოხერხდა");
    return;
  }
  const old = cart.find(i => i.name === name && i.volume === volume);
  if (old) old.quantity = Number(old.quantity || 0) + 1;
  else cart.push({ name, price, volume: volume || "", quantity: 1 });
  updateCart();
  note(name + " დაემატა კალათაში");
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    updateCart();
  }
}

function closeMobileMenu() {
  const nav = document.getElementById("mobileNav");
  if (nav) nav.classList.remove("active");
}

function openCart() {
  closeMobileMenu();
  const overlay = document.getElementById("cartOverlay");
  if (!overlay) {
    note("კალათის ფანჯარა ვერ მოიძებნა");
    return;
  }
  overlay.classList.add("active");
  overlay.style.zIndex = "2000";
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  renderCart();
  updateCart();
}

function closeCart() {
  const overlay = document.getElementById("cartOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.style.display = "none";
  }
  document.body.style.overflow = "";
}

function volumeUpdate(card) {
  const select = card.querySelector(".volume-select");
  const priceEl = card.querySelector(".selected-price");
  const volumeEl = card.querySelector(".selected-volume");
  const button = card.querySelector(".add-cart");
  if (!select || !priceEl || !volumeEl || !button) return;
  const volume = Number(select.value) || 0.5;
  const price = volume * Number(card.dataset.unitPrice || 10);
  const label = volume === 0.5 ? "500 მლ" : volume + " ლიტრი";
  priceEl.textContent = price + " ₾";
  volumeEl.textContent = label;
  button.dataset.price = price;
  button.dataset.volume = label;
}

function checkout() {
  if (!cart.length) {
    note("კალათა ცარიელია");
    return;
  }
  save();
  window.location.href = "checkout.html";
}

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.removeFromCart = removeFromCart;
window.goToCheckout = checkout;
window.renderCart = renderCart;

function init() {
  document.querySelectorAll(".product-card").forEach(card => {
    volumeUpdate(card);
    const select = card.querySelector(".volume-select");
    if (select) select.addEventListener("change", () => volumeUpdate(card));
  });

  document.addEventListener("click", event => {
    const add = event.target.closest?.(".add-cart");
    if (add) {
      event.preventDefault();
      event.stopPropagation();
      addToCart(add.dataset.name, add.dataset.price, add.dataset.volume);
      return;
    }

    const cartButton = event.target.closest?.("#cartButton");
    if (cartButton) {
      event.preventDefault();
      event.stopPropagation();
      openCart();
      return;
    }

    const checkoutButton = event.target.closest?.("#checkoutButton");
    if (checkoutButton) {
      event.preventDefault();
      event.stopPropagation();
      checkout();
      return;
    }

    const remove = event.target.closest?.(".remove-item");
    if (remove) {
      event.preventDefault();
      removeFromCart(Number(remove.dataset.index));
      return;
    }

    if (event.target.closest?.("#closeCart")) {
      event.preventDefault();
      closeCart();
      return;
    }

    const overlay = document.getElementById("cartOverlay");
    if (overlay && event.target === overlay) closeCart();
  });

  const menuButton = document.getElementById("menuButton");
  const mobileNav = document.getElementById("mobileNav");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const opening = !mobileNav.classList.contains("active");
      if (opening) mobileNav.classList.add("active");
      else mobileNav.classList.remove("active");
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileMenu));
  }

  updateCart();
  syncAuthUI();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();