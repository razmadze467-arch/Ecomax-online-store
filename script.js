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
    if (!window.supabase || !window.ECOMAX_SUPABASE) return;
    const client = window.supabase.createClient(window.ECOMAX_SUPABASE.url, window.ECOMAX_SUPABASE.key, { auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } });
    const login=document.getElementById("loginLink"), register=document.getElementById("registerLink"), account=document.getElementById("authAccountLink"), mobileNav=document.getElementById("mobileNav");
    let mobileLogin=mobileNav?.querySelector('a[href="login.html"]'), mobileRegister=mobileNav?.querySelector('a[href="register.html"]'), mobileAccount=mobileNav?.querySelector('a[data-auth-account]');
    if (mobileNav && !mobileAccount) { mobileAccount=document.createElement("a"); mobileAccount.href="account.html"; mobileAccount.textContent="ჩემი ანგარიში"; mobileAccount.dataset.authAccount="true"; mobileNav.appendChild(mobileAccount); }
    const apply=session=>{ const loggedIn=!!session?.user; if(login)login.style.display=loggedIn?"none":"inline-flex"; if(register)register.style.display=loggedIn?"none":"inline-flex"; if(account)account.style.display=loggedIn?"inline-flex":"none"; if(mobileLogin)mobileLogin.style.display=loggedIn?"none":"block"; if(mobileRegister)mobileRegister.style.display=loggedIn?"none":"block"; if(mobileAccount)mobileAccount.style.display=loggedIn?"block":"none"; };
    const {data,error}=await client.auth.getSession(); if(!error)apply(data?.session||null); client.auth.onAuthStateChange((_event,session)=>apply(session||null));
  } catch(error){ console.warn("ECOMAX auth UI:",error); }
}

function renderCart(){ const el=document.getElementById("cartItems"); if(!el)return; if(!cart.length){el.innerHTML='<div class="empty-cart"><div>🛒</div><h3>კალათა ცარიელია</h3><p>დაამატე პროდუქტი კალათაში.</p></div>';return;} el.innerHTML=cart.map((i,n)=>`<div class="cart-item"><div class="cart-item-info"><strong>${esc(i.name)}</strong><span>${esc(i.volume)} × ${i.quantity}</span></div><div class="cart-item-price">${Number(i.price)*Number(i.quantity)} ₾</div><button type="button" class="remove-item" data-index="${n}">×</button></div>`).join(""); }
function updateCart(){ const count=cart.reduce((s,i)=>s+Number(i.quantity||0),0), countEl=document.getElementById("cartCount"), totalEl=document.getElementById("cartTotal"); if(countEl)countEl.textContent=count; if(totalEl)totalEl.textContent=total()+" ₾"; renderCart(); save(); }
function addToCart(name,price,volume){ price=Number(price); if(!name||!Number.isFinite(price)||price<=0){note("პროდუქტის დამატება ვერ მოხერხდა");return;} const old=cart.find(i=>i.name===name&&i.volume===volume); if(old)old.quantity=Number(old.quantity||0)+1; else cart.push({name,price,volume:volume||"",quantity:1}); updateCart(); note(name+" დაემატა კალათაში"); }
function removeFromCart(index){ if(index>=0&&index<cart.length){cart.splice(index,1);updateCart();} }
function closeMobileMenu(){document.getElementById("mobileNav")?.classList.remove("active");}
function openCart(){closeMobileMenu();const overlay=document.getElementById("cartOverlay");if(!overlay){note("კალათის ფანჯარა ვერ მოიძებნა");return;}overlay.classList.add("active");overlay.style.zIndex="2000";overlay.style.display="flex";document.body.style.overflow="hidden";renderCart();updateCart();}
function closeCart(){const overlay=document.getElementById("cartOverlay");if(overlay){overlay.classList.remove("active");overlay.style.display="none";}document.body.style.overflow="";}
function volumeUpdate(card){const select=card.querySelector(".volume-select"),priceEl=card.querySelector(".selected-price"),volumeEl=card.querySelector(".selected-volume"),button=card.querySelector(".add-cart");if(!select||!priceEl||!volumeEl||!button)return;const volume=Number(select.value)||.5,price=volume*Number(card.dataset.unitPrice||10),label=volume===.5?"500 მლ":volume+" ლიტრი";priceEl.textContent=price+" ₾";volumeEl.textContent=label;button.dataset.price=price;button.dataset.volume=label;}
function checkout(){if(!cart.length){note("კალათა ცარიელია");return;}save();window.location.href="checkout.html";}
window.addToCart=addToCart;window.openCart=openCart;window.closeCart=closeCart;window.removeFromCart=removeFromCart;window.goToCheckout=checkout;window.renderCart=renderCart;

function installBottomUI(){
  if(!document.body)return;
  if(!document.querySelector("#ecomaxBottomUIStyle")){
    const style=document.createElement("style"); style.id="ecomaxBottomUIStyle"; style.textContent=`
      .ecomax-bottom-ui{position:relative;width:100%;height:105px;margin-top:10px;background:linear-gradient(180deg,rgba(2,8,18,0),#020812 55%);border-top:1px solid rgba(0,234,255,.18);overflow:hidden;z-index:20}
      .ecomax-bottom-ui .road-line{position:absolute;left:0;right:0;top:67px;height:2px;background:repeating-linear-gradient(90deg,rgba(0,234,255,.7) 0 65px,transparent 65px 115px);box-shadow:0 0 12px rgba(0,234,255,.25);animation:ecomaxRoad 1.2s linear infinite}
      .ecomax-bottom-ui .car{position:absolute;left:-145px;top:48px;width:125px;height:34px;animation:ecomaxDrive 12s linear infinite;filter:drop-shadow(0 0 9px #00eaff);z-index:6;will-change:transform}
      .ecomax-bottom-ui .car-body{position:absolute;left:12px;bottom:4px;width:92px;height:18px;border:1px solid #00eaff;border-radius:8px 15px 5px 5px;background:linear-gradient(180deg,rgba(0,234,255,.35),rgba(0,35,55,.95));box-shadow:inset 0 0 10px rgba(0,234,255,.25),0 0 12px rgba(0,234,255,.3)}
      .ecomax-bottom-ui .roof{position:absolute;left:33px;bottom:21px;width:48px;height:14px;border:1px solid #00eaff;border-bottom:0;border-radius:15px 18px 0 0;transform:skewX(-10deg);background:rgba(0,90,120,.3)}
      .ecomax-bottom-ui .wheel{position:absolute;bottom:0;width:13px;height:13px;border:2px solid #00eaff;border-radius:50%;background:#020812}.ecomax-bottom-ui .wheel.one{left:20px}.ecomax-bottom-ui .wheel.two{right:15px}
      .ecomax-bottom-ui .credit{position:absolute;right:100%;top:6px;margin-right:0;transform:none;width:max-content;max-width:none;white-space:nowrap;color:#00eaff;font:900 8px Arial,sans-serif;letter-spacing:1.1px;text-shadow:0 0 9px #00eaff;z-index:8;transition:opacity .2s ease;pointer-events:none}
      @keyframes ecomaxDrive{
        0%{transform:translate3d(0,0,0) rotate(0deg)}
        8%{transform:translate3d(9vw,-8px,0) rotate(-1deg)}
        16%{transform:translate3d(18vw,7px,0) rotate(1deg)}
        24%{transform:translate3d(27vw,-9px,0) rotate(-1deg)}
        32%{transform:translate3d(36vw,8px,0) rotate(1deg)}
        40%{transform:translate3d(45vw,-7px,0) rotate(-1deg)}
        48%{transform:translate3d(54vw,9px,0) rotate(1deg)}
        56%{transform:translate3d(63vw,-8px,0) rotate(-1deg)}
        64%{transform:translate3d(72vw,7px,0) rotate(1deg)}
        72%{transform:translate3d(81vw,-8px,0) rotate(-1deg)}
        80%{transform:translate3d(90vw,6px,0) rotate(1deg)}
        100%{transform:translate3d(calc(100vw + 300px),0,0) rotate(0deg)}
      }
      @keyframes ecomaxRoad{from{background-position:0}to{background-position:-115px}}
      @media(max-width:600px){.ecomax-bottom-ui{height:92px}.ecomax-bottom-ui .credit{font-size:6px;letter-spacing:.7px;top:6px}.ecomax-bottom-ui .road-line{top:62px}.ecomax-bottom-ui .car{top:45px;width:110px;height:32px}.ecomax-bottom-ui .car-body{width:82px}.ecomax-bottom-ui .roof{left:29px}}
    `; document.head.appendChild(style);
  }
  if(!document.querySelector(".ecomax-bottom-ui")){
    const ui=document.createElement("div");ui.className="ecomax-bottom-ui";ui.innerHTML=`<div class="road-line"></div><div class="car" aria-hidden="true"><div class="credit">DEVELOPED BY BTCGAMER</div><div class="roof"></div><div class="car-body"></div><div class="wheel one"></div><div class="wheel two"></div></div>`;document.body.appendChild(ui);
    const car=ui.querySelector(".car"),credit=ui.querySelector(".credit");const messages=["DEVELOPED BY BTCGAMER","© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ — 2026"];let pass=0;
    if(car&&credit)car.addEventListener("animationiteration",()=>{pass=(pass+1)%messages.length;credit.style.opacity="0";setTimeout(()=>{credit.textContent=messages[pass];credit.style.opacity="1";},180);});
  }
}

function init(){document.querySelectorAll(".product-card").forEach(card=>{volumeUpdate(card);const select=card.querySelector(".volume-select");if(select)select.addEventListener("change",()=>volumeUpdate(card));});document.addEventListener("click",event=>{const add=event.target.closest?.(".add-cart");if(add){event.preventDefault();event.stopPropagation();addToCart(add.dataset.name,add.dataset.price,add.dataset.volume);return;}const cartButton=event.target.closest?.("#cartButton");if(cartButton){event.preventDefault();event.stopPropagation();openCart();return;}const checkoutButton=event.target.closest?.("#checkoutButton");if(checkoutButton){event.preventDefault();event.stopPropagation();checkout();return;}const remove=event.target.closest?.(".remove-item");if(remove){event.preventDefault();removeFromCart(Number(remove.dataset.index));return;}if(event.target.closest?.("#closeCart")){event.preventDefault();closeCart();return;}const overlay=document.getElementById("cartOverlay");if(overlay&&event.target===overlay)closeCart();});const menuButton=document.getElementById("menuButton"),mobileNav=document.getElementById("mobileNav");if(menuButton&&mobileNav){menuButton.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();mobileNav.classList.toggle("active");});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMobileMenu));}updateCart();syncAuthUI();const isHome=/(^|\/)index\.html$/.test(location.pathname)||location.pathname==="/"||location.pathname==="";if(isHome)installBottomUI();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();