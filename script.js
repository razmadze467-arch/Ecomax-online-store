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
  Object.assign(n.style, { position:"fixed", right:"20px", bottom:"85px", zIndex:"99999", padding:"14px 18px", background:"#03101c", color:"#00eaff", border:"1px solid #00eaff", borderRadius:"10px", fontWeight:"700" });
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}

async function syncAuthUI() {
  try {
    const client = window.ECOMAX_SUPABASE_CLIENT || window.ECOMAX_AUTH_CLIENT;
    if (!client || !client.auth) return;

    const login = document.getElementById("loginLink");
    const register = document.getElementById("registerLink");
    const account = document.getElementById("authAccountLink");

    const mobileNav = document.getElementById("mobileNav");
    const mobileLogin = mobileNav?.querySelector('a[href="login.html"]');
    const mobileRegister = mobileNav?.querySelector('a[href="register.html"]');
    let mobileAccount = mobileNav?.querySelector("[data-auth-account]");

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

    const { data } = await client.auth.getSession();
    apply(data?.session || null);

    if (!window.__ECOMAX_AUTH_UI_LISTENER__) {
      window.__ECOMAX_AUTH_UI_LISTENER__ = true;
      client.auth.onAuthStateChange((_event, session) => apply(session || null));
    }
  } catch (error) {
    console.warn("ECOMAX auth UI:", error);
  }
}
function renderCart(){ const el=document.getElementById("cartItems"); if(!el)return; if(!cart.length){el.innerHTML='<div class="empty-cart"><div>🛒</div><h3>კალათა ცარიელია</h3><p>დაამატე პროდუქტი კალათაში.</p></div>';return;} el.innerHTML=cart.map((i,n)=>`<div class="cart-item"><div class="cart-item-info"><strong>${esc(i.name)}</strong><span>${esc(i.volume)} × ${i.quantity}</span></div><div class="cart-item-price">${Number(i.price)*Number(i.quantity)} ₾</div><button type="button" class="remove-item" data-index="${n}">×</button></div>`).join(""); }
function updateCart(){ const count=cart.reduce((s,i)=>s+Number(i.quantity||0),0), countEl=document.getElementById("cartCount"), totalEl=document.getElementById("cartTotal"); if(countEl)countEl.textContent=count; if(totalEl)totalEl.textContent=total()+" ₾"; renderCart(); save(); }
function addToCart(name,price,volume){ price=Number(price); if(!name||!Number.isFinite(price)||price<=0){note("პროდუქტის დამატება ვერ მოხერხდა");return;} const old=cart.find(i=>i.name===name&&i.volume===volume); if(old)old.quantity=Number(old.quantity||0)+1; else cart.push({name,price,volume:volume||"",quantity:1}); updateCart(); note(name+" დაემატა კალათაში"); }
function removeFromCart(index){ if(index>=0&&index<cart.length){cart.splice(index,1);updateCart();} }
function toggleMobileMenu(event){
  if(event){event.preventDefault();event.stopPropagation();}
  const nav=document.getElementById("mobileNav");
  const button=document.getElementById("menuButton")||document.getElementById("mobileMenu");
  if(!nav)return;
  const active=nav.classList.toggle("active");
  if(button){button.setAttribute("aria-expanded",active?"true":"false");button.setAttribute("aria-label",active?"მენიუს დახურვა":"მენიუს გახსნა");}
}
function closeMobileMenu(){
  const nav=document.getElementById("mobileNav");
  const button=document.getElementById("menuButton")||document.getElementById("mobileMenu");
  nav?.classList.remove("active");
  if(button){button.setAttribute("aria-expanded","false");button.setAttribute("aria-label","მენიუს გახსნა");}
}
function openCart(){closeMobileMenu();const overlay=document.getElementById("cartOverlay");if(!overlay){note("კალათის ფანჯარა ვერ მოიძებნა");return;}overlay.classList.add("active");overlay.style.zIndex="2000";overlay.style.display="flex";document.body.style.overflow="hidden";renderCart();updateCart();}
function closeCart(){const overlay=document.getElementById("cartOverlay");if(overlay){overlay.classList.remove("active");overlay.style.display="none";}document.body.style.overflow="";}
function volumeUpdate(card){const select=card.querySelector(".volume-select"),priceEl=card.querySelector(".selected-price"),volumeEl=card.querySelector(".selected-volume"),button=card.querySelector(".add-cart,.new-add-cart");if(!select||!priceEl||!volumeEl)return;const opt=select.options[select.selectedIndex];const volume=Number(select.value)||.5;let price=Number(opt?.dataset?.price||0);if(!price){const text=String(opt?.textContent||"");const m=text.match(/(?:—|-)?\s*(\d+(?:\.\d+)?)\s*₾/);price=m?Number(m[1]):(volume===.5?5:volume*10);}const label=volume===.5?"500 მლ":volume+" ლიტრი";priceEl.textContent=price+" ₾";volumeEl.textContent=label;if(button){button.dataset.price=String(price);button.dataset.volume=label;}}
function checkout(){if(window.__ECOMAX_ALLOW_CHECKOUT!==true)return;if(!cart.length){note("კალათა ცარიელია");window.__ECOMAX_ALLOW_CHECKOUT=false;return;}save();window.__ECOMAX_ALLOW_CHECKOUT=false;window.location.href="checkout.html";}
window.addToCart=addToCart;window.openCart=openCart;window.closeCart=closeCart;window.removeFromCart=removeFromCart;window.goToCheckout=checkout;window.renderCart=renderCart;window.updateCart=updateCart;window.volumeUpdate=volumeUpdate;

function installCareCards(){
  if(!document.body || document.querySelector(".ecomax-care-knowledge")) return;
  const anchor=document.querySelector("#safety") || document.querySelector(".safety-section");
  if(!anchor || !anchor.parentNode) return;
  const section=document.createElement("section");
  section.className="ecomax-care-knowledge section";
  section.innerHTML=`
    <div class="section-heading"><div><div class="section-label">ECOMAX CAR CARE GUIDE</div><h2>ავტომობილის მოვლა — <span>სწორი გზა</span></h2></div><p>სუფთა ავტომობილი მხოლოდ გარეგნობა არ არის. სწორი ქიმიის, სწორი გაზავებისა და ზედაპირის შესაბამისი მოვლის გამოყენება ეხმარება ავტომობილს შეინარჩუნოს სისუფთავე, ბზინვარება და მოვლილი იერსახე.</p></div>
    <div class="ecomax-care-grid">
      <article class="ecomax-care-card"><span>01 / EXTERIOR</span><h3>კორპუსის მოვლა და ბზინვარება</h3><p>აირჩიე ზედაპირისთვის შესაფერისი საშუალება, დაიცავი მითითებული გაზავება და არ დატოვო ქიმიური საშუალება ზედაპირზე საჭიროზე დიდხანს.</p></article>
      <article class="ecomax-care-card"><span>02 / ENGINE</span><h3>ძრავის სისუფთავე და დეტალები</h3><p>ელექტრო კომპონენტები წინასწარ დაიცავი. გამოიყენე შესაბამისი გაზავება და სამუშაოს დასრულების შემდეგ ზედაპირი კარგად ჩამორეცხე და გააშრე.</p></article>
      <article class="ecomax-care-card"><span>03 / INTERIOR</span><h3>სალონის სისუფთავე და კომფორტი</h3><p>ტყავს, ქსოვილსა და პლასტმასს განსხვავებული მოვლა სჭირდება. პირველ გამოყენებამდე მცირე, შეუმჩნეველ ადგილზე გამოცადე.</p></article>
      <article class="ecomax-care-card"><span>04 / WHEELS</span><h3>დისკები და საბურავები</h3><p>დისკის საწმენდი გამოიყენე დაბინძურების დონის შესაბამისი გაზავებით. საბურავის მოვლის საშუალება გამოიყენე სუფთა ზედაპირზე.</p></article>
      <article class="ecomax-care-card"><span>05 / DETAILING</span><h3>დეტეილინგი — ყურადღება დეტალებზე</h3><p>კარგი შედეგი მიიღება სწორი საშუალების, სწორი გაზავების, სწორი ინსტრუმენტისა და თანმიმდევრული დამუშავების კომბინაციით.</p></article>
      <article class="ecomax-care-card"><span>06 / ROUTINE</span><h3>მოვლის სწორი რუტინა</h3><p>რეგულარული რეცხვა, სალონის გაწმენდა, დისკებისა და საბურავების მოვლა ხელს უწყობს მანქანის მუდმივად მოვლილ მდგომარეობაში შენარჩუნებას.</p></article>
    </div>`;
  anchor.parentNode.insertBefore(section,anchor);
  const style=document.createElement("style");style.id="ecomaxCareCardsStyle";style.textContent=`.ecomax-care-knowledge{padding:80px 22px}.ecomax-care-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:30px}.ecomax-care-card{padding:28px;border:1px solid rgba(0,234,255,.16);border-radius:20px;background:linear-gradient(145deg,rgba(5,25,40,.96),rgba(2,11,22,.98));box-shadow:0 16px 45px rgba(0,0,0,.2);transition:.25s}.ecomax-care-card:hover{transform:translateY(-6px);border-color:#00eaff;box-shadow:0 20px 55px rgba(0,180,220,.12)}.ecomax-care-card>span{font-size:10px;letter-spacing:2px;color:#00eaff;font-weight:800}.ecomax-care-card h3{font-size:20px;margin:13px 0;color:#f4fbff}.ecomax-care-card p{font-size:13px;line-height:1.8;color:#9db2c0}@media(max-width:900px){.ecomax-care-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.ecomax-care-grid{grid-template-columns:1fr}.ecomax-care-knowledge{padding:55px 15px}}`;document.head.appendChild(style);
}

function installBottomUI(){
  if(!document.body || document.querySelector(".ecomax-bottom-ui"))return;
  const style=document.createElement("style");
  style.id="ecomaxBottomUIStyle";
  style.textContent=`
    .ecomax-bottom-ui{
      position:relative;
      width:100%;
      min-height:58px;
      margin-top:10px;
      padding:18px 16px;
      box-sizing:border-box;
      background:linear-gradient(180deg,rgba(2,8,18,0),#020812 55%);
      border-top:1px solid rgba(0,234,255,.16);
      text-align:center;
      z-index:20;
    }
    .ecomax-bottom-ui .credit{
      display:block;
      color:#00eaff;
      font:900 10px Arial,sans-serif;
      letter-spacing:2px;
      text-shadow:0 0 8px rgba(0,234,255,.65);
    }
    @media(max-width:600px){
      .ecomax-bottom-ui{min-height:52px;padding:16px 10px}
      .ecomax-bottom-ui .credit{font-size:9px;letter-spacing:1.5px}
    }
  `;
  document.head.appendChild(style);
  const ui=document.createElement("div");
  ui.className="ecomax-bottom-ui";
  ui.innerHTML=`<div class="credit">DEVELOPED BY BTCGAMER</div>`;
  document.body.appendChild(ui);
}

function installOrbitCars(){
  if(!document.head)return;
  if(!document.getElementById("ecomaxOrbitCarsStyle")){
    const style=document.createElement("style");
    style.id="ecomaxOrbitCarsStyle";
    style.textContent=`
      .card,.product-card{
        position:relative !important;
        overflow:visible !important;
      }
      .ecomax-orbit-cars{
        position:absolute;
        inset:-13px;
        pointer-events:none;
        z-index:30;
        overflow:visible;
      }
      .ecomax-orbit-car{
        position:absolute;
        width:54px;
        height:25px;
        left:0;
        top:0;
        will-change:left,top,transform;
        filter:drop-shadow(0 0 5px currentColor) drop-shadow(0 0 11px currentColor);
      }
      .ecomax-orbit-car .body{
        position:absolute;
        left:5px;
        right:5px;
        bottom:3px;
        height:10px;
        border:2px solid currentColor;
        border-radius:7px 10px 4px 4px;
        background:linear-gradient(180deg,rgba(0,234,255,.28),rgba(2,8,16,.95));
        box-shadow:0 0 7px currentColor,inset 0 0 7px rgba(255,255,255,.08);
      }
      .ecomax-orbit-car .roof{
        position:absolute;
        left:16px;
        top:4px;
        width:21px;
        height:8px;
        border:2px solid currentColor;
        border-bottom:0;
        border-radius:7px 8px 0 0;
      }
      .ecomax-orbit-car .wheel{
        position:absolute;
        bottom:0;
        width:7px;
        height:7px;
        border:2px solid #fff;
        border-radius:50%;
        background:#02060b;
        box-shadow:0 0 4px currentColor;
      }
      .ecomax-orbit-car .wheel.a{left:11px}
      .ecomax-orbit-car .wheel.b{right:11px}
      .ecomax-orbit-car.cyan{color:#00eaff;animation:ecomaxOrbitCW 8s linear infinite}
      .ecomax-orbit-car.pink{color:#ff2d9a;animation:ecomaxOrbitCCW 8s linear infinite}
      @keyframes ecomaxOrbitCW{
        0%{left:-3px;top:-13px;transform:rotate(0deg)}
        24%{left:calc(100% - 51px);top:-13px;transform:rotate(0deg)}
        25%{left:calc(100% - 41px);top:-3px;transform:rotate(90deg)}
        49%{left:calc(100% - 41px);top:calc(100% - 22px);transform:rotate(90deg)}
        50%{left:calc(100% - 51px);top:calc(100% - 12px);transform:rotate(180deg)}
        74%{left:-3px;top:calc(100% - 12px);transform:rotate(180deg)}
        75%{left:-13px;top:calc(100% - 22px);transform:rotate(270deg)}
        99%{left:-13px;top:-3px;transform:rotate(270deg)}
        100%{left:-3px;top:-13px;transform:rotate(360deg)}
      }
      @keyframes ecomaxOrbitCCW{
        0%{left:calc(100% - 51px);top:-13px;transform:rotate(180deg)}
        24%{left:-3px;top:-13px;transform:rotate(180deg)}
        25%{left:-13px;top:-3px;transform:rotate(270deg)}
        49%{left:-13px;top:calc(100% - 22px);transform:rotate(270deg)}
        50%{left:-3px;top:calc(100% - 12px);transform:rotate(360deg)}
        74%{left:calc(100% - 51px);top:calc(100% - 12px);transform:rotate(360deg)}
        75%{left:calc(100% - 41px);top:calc(100% - 22px);transform:rotate(450deg)}
        99%{left:calc(100% - 41px);top:-3px;transform:rotate(450deg)}
        100%{left:calc(100% - 51px);top:-13px;transform:rotate(540deg)}
      }
      @media(max-width:620px){
        .ecomax-orbit-cars{inset:-10px}
        .ecomax-orbit-car{width:42px;height:20px}
        .ecomax-orbit-car .body{height:8px;left:4px;right:4px}
        .ecomax-orbit-car .roof{left:13px;top:4px;width:16px;height:6px}
        .ecomax-orbit-car .wheel{width:6px;height:6px}
        .ecomax-orbit-car .wheel.a{left:8px}
        .ecomax-orbit-car .wheel.b{right:8px}
      }
      @media(prefers-reduced-motion:reduce){
        .ecomax-orbit-car{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }
  document.querySelectorAll(".card,.product-card").forEach(card=>{
    if(card.querySelector(".ecomax-orbit-cars"))return;
    const wrap=document.createElement("div");
    wrap.className="ecomax-orbit-cars";
    wrap.setAttribute("aria-hidden","true");
    wrap.innerHTML=`
      <div class="ecomax-orbit-car cyan"><span class="body"></span><span class="roof"></span><i class="wheel a"></i><i class="wheel b"></i></div>
      <div class="ecomax-orbit-car pink"><span class="body"></span><span class="roof"></span><i class="wheel a"></i><i class="wheel b"></i></div>
    `;
    card.appendChild(wrap);
  });
}
function forceMaxHomeDesign(){
  const isHome=/(^|\/)index\.html$/.test(location.pathname)||location.pathname==="/"||location.pathname==="";
  if(!isHome||document.getElementById("ecomaxMaxDesignJs"))return;
  /* Max design temporarily disabled to keep the storefront stable. */
}

function init(){
  document.querySelectorAll(".product-card,.card").forEach(card=>{const select=card.querySelector(".volume-select");if(select){try{volumeUpdate(card);}catch(e){}select.addEventListener("change",()=>volumeUpdate(card));}});
  document.addEventListener("click",event=>{const add=event.target.closest?.(".add-cart");if(add){event.preventDefault();event.stopPropagation();addToCart(add.dataset.name,add.dataset.price,add.dataset.volume);return;}const cartButton=event.target.closest?.("#cartButton");if(cartButton){event.preventDefault();event.stopPropagation();openCart();return;}const checkoutButton=event.target.closest?.("#checkoutButton");if(checkoutButton){event.preventDefault();event.stopPropagation();checkout();return;}const remove=event.target.closest?.(".remove-item");if(remove){event.preventDefault();removeFromCart(Number(remove.dataset.index));return;}if(event.target.closest?.("#closeCart,#cartClose")){event.preventDefault();closeCart();return;}const overlay=document.getElementById("cartOverlay");if(overlay&&event.target===overlay)closeCart();});
  const menuButton=document.getElementById("menuButton")||document.getElementById("mobileMenu"),mobileNav=document.getElementById("mobileNav");if(menuButton&&mobileNav){if(!menuButton.hasAttribute("onclick")){menuButton.addEventListener("click",toggleMobileMenu);}mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMobileMenu));}
  updateCart();syncAuthUI();
  const isHome=/(^|\/)index\.html$/.test(location.pathname)||location.pathname==="/"||location.pathname==="";
  if(isHome){installCareCards();forceMaxHomeDesign();installBottomUI();}
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
