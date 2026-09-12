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

    const { data, error } = await client.auth.getSession();
    if (!error) apply(data?.session || null);

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

/* =========================================================
   ECOMAX FUTURE DESIGN LAYER
   Visual-only enhancement: does not change products, cart,
   authentication, checkout, Supabase or order logic.
   ========================================================= */
function addFutureDesign() {
  if (document.querySelector("#ecomaxFutureStyle")) return;

  const style = document.createElement("style");
  style.id = "ecomaxFutureStyle";
  style.textContent = `
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        linear-gradient(rgba(0,234,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,234,255,.025) 1px, transparent 1px);
      background-size: 70px 70px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,.65), transparent 82%);
    }

    .ecomax-future-section {
      position: relative;
      width: min(1400px, 92%);
      margin: 0 auto;
      padding: 120px 0 170px;
      z-index: 2;
    }

    .ecomax-future-head {
      display: grid;
      grid-template-columns: 1.2fr .8fr;
      gap: 50px;
      align-items: end;
      margin-bottom: 42px;
    }

    .ecomax-future-kicker {
      color: #00eaff;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 4px;
      margin-bottom: 14px;
      text-shadow: 0 0 18px rgba(0,234,255,.6);
    }

    .ecomax-future-head h2 {
      margin: 0;
      font-size: clamp(34px, 5vw, 64px);
      line-height: 1.03;
      letter-spacing: -2px;
    }

    .ecomax-future-head h2 span { color: #00eaff; }

    .ecomax-future-head p {
      color: #8da8b8;
      line-height: 1.9;
      font-size: 14px;
      margin: 0;
    }

    .ecomax-care-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      perspective: 1200px;
    }

    .ecomax-care-card {
      min-height: 245px;
      padding: 28px;
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid rgba(0,234,255,.14);
      background:
        radial-gradient(circle at 85% 15%, rgba(0,234,255,.13), transparent 35%),
        linear-gradient(145deg, rgba(7,28,43,.92), rgba(2,8,18,.96));
      box-shadow: inset 0 0 45px rgba(0,234,255,.025), 0 22px 70px rgba(0,0,0,.25);
      transform-style: preserve-3d;
      transition: transform .45s ease, border-color .45s ease, box-shadow .45s ease;
    }

    .ecomax-care-card:hover {
      transform: translateY(-10px) rotateX(4deg) rotateY(-3deg);
      border-color: rgba(0,234,255,.48);
      box-shadow: 0 25px 80px rgba(0,160,255,.12), inset 0 0 55px rgba(0,234,255,.05);
    }

    .ecomax-care-card::before {
      content: "";
      position: absolute;
      width: 180px;
      height: 180px;
      right: -90px;
      bottom: -90px;
      border-radius: 50%;
      border: 1px solid rgba(0,234,255,.14);
      box-shadow: 0 0 0 28px rgba(0,234,255,.025), 0 0 0 56px rgba(0,234,255,.018);
    }

    .ecomax-care-number {
      color: #00eaff;
      font-size: 10px;
      letter-spacing: 3px;
      font-weight: 900;
    }

    .ecomax-care-card h3 {
      margin: 25px 0 12px;
      font-size: 21px;
    }

    .ecomax-care-card p {
      margin: 0;
      color: #78909c;
      line-height: 1.75;
      font-size: 12px;
    }

    .ecomax-scanline {
      height: 1px;
      width: 100%;
      margin-top: 55px;
      position: relative;
      background: linear-gradient(90deg, transparent, rgba(0,234,255,.25), transparent);
      overflow: hidden;
    }

    .ecomax-scanline::after {
      content: "";
      position: absolute;
      top: -3px;
      left: -15%;
      width: 15%;
      height: 7px;
      border-radius: 50%;
      background: #00eaff;
      filter: blur(5px);
      box-shadow: 0 0 22px #00eaff;
      animation: ecomaxScan 4s linear infinite;
    }

    .ecomax-road {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 42px;
      z-index: 9990;
      pointer-events: none;
      background: linear-gradient(to bottom, rgba(2,8,18,.1), rgba(2,8,18,.96) 28%);
      border-top: 1px solid rgba(0,234,255,.16);
    }

    .ecomax-road::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 20px;
      height: 2px;
      background: repeating-linear-gradient(90deg, rgba(0,234,255,.55) 0 70px, transparent 70px 120px);
      opacity: .45;
      animation: ecomaxRoadMove 1.4s linear infinite;
    }

    .ecomax-road::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 27px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,234,255,.25), transparent);
    }

    .ecomax-road-car {
      position: absolute;
      top: -13px;
      left: -150px;
      width: 92px;
      height: 32px;
      animation: ecomaxCarDrive 12s linear infinite;
      filter: drop-shadow(0 0 9px rgba(0,234,255,.8));
    }

    .ecomax-car-body {
      position: absolute;
      left: 8px;
      bottom: 4px;
      width: 76px;
      height: 16px;
      border: 1px solid #00eaff;
      border-radius: 8px 14px 5px 5px;
      background: linear-gradient(180deg, rgba(0,234,255,.3), rgba(0,40,60,.9));
      box-shadow: inset 0 0 12px rgba(0,234,255,.22), 0 0 12px rgba(0,234,255,.25);
    }

    .ecomax-car-roof {
      position: absolute;
      left: 26px;
      bottom: 18px;
      width: 43px;
      height: 15px;
      border: 1px solid #00eaff;
      border-bottom: 0;
      border-radius: 15px 18px 0 0;
      transform: skewX(-10deg);
      background: rgba(0,80,110,.35);
    }

    .ecomax-wheel {
      position: absolute;
      bottom: 0;
      width: 12px;
      height: 12px;
      border: 2px solid #00eaff;
      border-radius: 50%;
      background: #020812;
      box-shadow: 0 0 8px rgba(0,234,255,.7);
    }

    .ecomax-wheel.one { left: 17px; }
    .ecomax-wheel.two { right: 13px; }

    .ecomax-light {
      position: absolute;
      right: 2px;
      bottom: 10px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #00eaff;
      box-shadow: 0 0 9px #00eaff;
    }

    @keyframes ecomaxCarDrive {
      0% { transform: translateX(0) translateY(0); }
      12% { transform: translateX(14vw) translateY(-2px); }
      30% { transform: translateX(34vw) translateY(1px); }
      48% { transform: translateX(54vw) translateY(-1px); }
      70% { transform: translateX(76vw) translateY(1px); }
      88% { transform: translateX(98vw) translateY(-2px); }
      100% { transform: translateX(118vw) translateY(0); }
    }

    @keyframes ecomaxRoadMove {
      from { background-position: 0 0; }
      to { background-position: -120px 0; }
    }

    @keyframes ecomaxScan {
      from { transform: translateX(0); }
      to { transform: translateX(800%); }
    }

    @media (max-width: 900px) {
      .ecomax-future-head { grid-template-columns: 1fr; gap: 18px; }
      .ecomax-care-grid { grid-template-columns: 1fr 1fr; }
      .ecomax-future-section { padding-top: 80px; }
    }

    @media (max-width: 600px) {
      .ecomax-future-section { width: 90%; padding: 70px 0 130px; }
      .ecomax-care-grid { grid-template-columns: 1fr; }
      .ecomax-care-card { min-height: 205px; padding: 23px; }
      .ecomax-future-head h2 { font-size: 37px; }
      .ecomax-road { height: 34px; }
      .ecomax-road::before { top: 18px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .ecomax-road-car, .ecomax-road::before, .ecomax-scanline::after { animation: none; }
      .ecomax-care-card { transition: none; }
    }
  `;
  document.head.appendChild(style);

  const footer = document.querySelector("footer");
  const section = document.createElement("section");
  section.className = "ecomax-future-section";
  section.id = "future-care";
  section.innerHTML = `
    <div class="ecomax-future-head">
      <div>
        <div class="ecomax-future-kicker">ECOMAX • AUTO CARE EXPERIENCE</div>
        <h2>მანქანის მოვლა<br><span>ახალი ენერგიით.</span></h2>
      </div>
      <p>
        სისუფთავე მხოლოდ ბზინვარება არ არის. სწორი მოვლა ნიშნავს ძარის, სალონის,
        მინის, ბორბლების, საბურავების, ძრავისა და ყველა მნიშვნელოვანი ზედაპირის
        ყურადღებით მოვლას. ECOMAX შექმნილია იმისთვის, რომ ყოველდღიური წმენდა
        პროფესიონალურ გამოცდილებად აქციოს.
      </p>
    </div>

    <div class="ecomax-care-grid">
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">01 / EXTERIOR</div>
        <h3>ძარის სისუფთავე და ბზინვარება</h3>
        <p>მტვერი, გზის ჭუჭყი, ცხიმოვანი კვალი და ყოველდღიური დაბინძურება — სწორი ქიმიისა და სწორი გაზავების არჩევა ზედაპირს სუფთად და მოვლილად ტოვებს.</p>
      </article>
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">02 / ENGINE</div>
        <h3>ძრავის სისუფთავე</h3>
        <p>ძრავის სივრცის მოვლა მოითხოვს ყურადღებას, კონტროლირებულ წმენდას და უსაფრთხო გამოყენებას. ძლიერი დაბინძურებისთვის გამოიყენე შესაბამისი გაზავება.</p>
      </article>
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">03 / INTERIOR</div>
        <h3>სალონის სუფთა სივრცე</h3>
        <p>ტყავი, ქსოვილი, პლასტმასა და სხვა სალონის ზედაპირები სხვადასხვა მიდგომას საჭიროებს. მოვლილი ინტერიერი მანქანის საერთო ხარისხს ცვლის.</p>
      </article>
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">04 / WHEELS</div>
        <h3>დისკები და საბურავები</h3>
        <p>ბორბლები ყოველდღიურად იღებს მტვერს, ტალახს და გზის ნარჩენებს. რეგულარული გაწმენდა მანქანის ვიზუალურ იერს ბევრად უფრო მკვეთრს ხდის.</p>
      </article>
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">05 / DETAILING</div>
        <h3>დეტეილინგის ეფექტი</h3>
        <p>პატარა დეტალები ქმნის დიდ განსხვავებას — სუფთა ზედაპირი, მოწესრიგებული სალონი, მოვლილი პლასტმასი და ბორბლები ქმნის პროფესიონალურ იერს.</p>
      </article>
      <article class="ecomax-care-card">
        <div class="ecomax-care-number">06 / ECOMAX</div>
        <h3>პროფესიონალური მიდგომა</h3>
        <p>აირჩიე პროდუქტი დაბინძურების ტიპის მიხედვით, დაიცავი რეკომენდებული გაზავება და იმუშავე ეტაპობრივად — შედეგი უფრო სუფთა, თანაბარი და კონტროლირებადი იქნება.</p>
      </article>
    </div>

    <div class="ecomax-scanline"></div>
  `;

  if (footer) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);

  const road = document.createElement("div");
  road.className = "ecomax-road";
  road.setAttribute("aria-hidden", "true");
  road.innerHTML = `
    <div class="ecomax-road-car">
      <div class="ecomax-car-roof"></div>
      <div class="ecomax-car-body"></div>
      <div class="ecomax-wheel one"></div>
      <div class="ecomax-wheel two"></div>
      <div class="ecomax-light"></div>
    </div>`;
  document.body.appendChild(road);
}

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
  addFutureDesign();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();