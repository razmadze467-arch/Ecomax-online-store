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

function installCareCards(){
  if(!document.body || document.querySelector(".ecomax-care-knowledge")) return;
  const anchor=document.querySelector("#safety") || document.querySelector(".safety-section");
  if(!anchor || !anchor.parentNode) return;
  const section=document.createElement("section");
  section.className="ecomax-care-knowledge section";
  section.innerHTML=`
    <div class="section-heading">
      <div><div class="section-label">ECOMAX CAR CARE GUIDE</div><h2>ავტომობილის მოვლა — <span>სწორი გზა</span></h2></div>
      <p>სუფთა ავტომობილი მხოლოდ გარეგნობა არ არის. სწორი ქიმიის, სწორი გაზავებისა და ზედაპირის შესაბამისი მოვლის გამოყენება ეხმარება ავტომობილს შეინარჩუნოს სისუფთავე, ბზინვარება და მოვლილი იერსახე.</p>
    </div>
    <div class="ecomax-care-grid">
      <article class="ecomax-care-card"><span>01 / EXTERIOR</span><h3>კორპუსის მოვლა და ბზინვარება</h3><p>ავტომობილის კორპუსზე ყოველდღიურად გროვდება მტვერი, გზის ჭუჭყი, ცხიმოვანი ნარჩენები და სხვა დაბინძურება. რეგულარული და სწორად შესრულებული რეცხვა ამცირებს ჭუჭყის დაგროვებას და ეხმარება ზედაპირს შეინარჩუნოს სუფთა, მოვლილი იერსახე.</p><b>რჩევა:</b><p>აირჩიე ზედაპირისთვის შესაფერისი საშუალება, დაიცავი მწარმოებლის მითითებული გაზავება და არ დატოვო ქიმიური საშუალება ზედაპირზე საჭიროზე დიდხანს.</p></article>
      <article class="ecomax-care-card"><span>02 / ENGINE</span><h3>ძრავის სისუფთავე და დეტალები</h3><p>ძრავის განყოფილებაში გროვდება ზეთი, მტვერი და მძიმე ჭუჭყი. ძრავის სარეცხი გამოიყენება შესაბამისი ზედაპირებისა და დაბინძურების მიხედვით, რათა დასვრილი ადგილები უფრო მარტივად გაიწმინდოს.</p><b>რჩევა:</b><p>ელექტრო კომპონენტები წინასწარ დაიცავი. გამოიყენე შესაბამისი გაზავება და სამუშაოს დასრულების შემდეგ ზედაპირი კარგად ჩამორეცხე და გააშრე.</p></article>
      <article class="ecomax-care-card"><span>03 / INTERIOR</span><h3>სალონის სისუფთავე და კომფორტი</h3><p>სალონში განსაკუთრებული ყურადღება სჭირდება ტყავს, ქსოვილს, პლასტმასს და სხვა სხვადასხვა მასალას. თითოეულ ზედაპირს განსხვავებული მოვლა სჭირდება, ამიტომ ერთი და იგივე საშუალების ყველა მასალაზე გამოყენება ყოველთვის სწორი არ არის.</p><b>რჩევა:</b><p>ტყავისთვის გამოიყენე ტყავის შესაბამისი საშუალება, ტექსტილისთვის — ტექსტილის შესაბამისი ქიმწმენდა. პირველ გამოყენებამდე მცირე, შეუმჩნეველ ადგილზე გამოცადე.</p></article>
      <article class="ecomax-care-card"><span>04 / WHEELS</span><h3>დისკები და საბურავები</h3><p>დისკებზე ხშირად გროვდება მუხრუჭის მტვერი, გზის ჭუჭყი და სხვა ნარჩენი, ხოლო საბურავების მოვლა მნიშვნელოვანია როგორც ვიზუალური იერსახისთვის, ისე სისუფთავის შესანარჩუნებლად.</p><b>რჩევა:</b><p>დისკის საწმენდი გამოიყენე დაბინძურების დონის შესაბამისი გაზავებით. საბურავის საპრიალებელი გამოიყენე სუფთა და მშრალ ზედაპირზე და მოერიდე მუხრუჭის სამუშაო ზედაპირს.</p></article>
      <article class="ecomax-care-card"><span>05 / DETAILING</span><h3>დეტეილინგი — ყურადღება დეტალებზე</h3><p>კარგი შედეგი მხოლოდ ძლიერი ქიმიის გამოყენებით არ მიიღება. მნიშვნელოვანია სწორი საშუალება, სწორი გაზავება, სწორი ინსტრუმენტი და ზედაპირის თანმიმდევრული დამუშავება.</p><b>რჩევა:</b><p>დაიწყე ნაკლებად აგრესიული მეთოდით და საჭიროების შემთხვევაში გაზარდე მოქმედების ინტენსივობა. სხვადასხვა ქიმიური საშუალება ერთმანეთში თვითნებურად არ აურიო.</p></article>
      <article class="ecomax-care-card"><span>06 / ROUTINE</span><h3>მოვლის სწორი რუტინა</h3><p>ავტომობილის მოვლა ერთჯერადი პროცესი არ არის. რეგულარული რეცხვა, სალონის გაწმენდა, დისკებისა და საბურავების მოვლა და ძრავის განყოფილების პერიოდული გაწმენდა ხელს უწყობს მანქანის მუდმივად მოვლილ მდგომარეობაში შენარჩუნებას.</p><b>რჩევა:</b><p>შექმენი მარტივი გრაფიკი: კორპუსი — რეგულარულად, სალონი — საჭიროების მიხედვით, დისკები და საბურავები — დაბინძურებისთანავე, ხოლო ძრავის განყოფილება — პერიოდულად და ფრთხილად.</p></article>
    </div>`;
  anchor.parentNode.insertBefore(section,anchor);
  const style=document.createElement("style");
  style.id="ecomaxCareCardsStyle";
  style.textContent=`
    .ecomax-care-knowledge{padding-top:80px;padding-bottom:80px}
    .ecomax-care-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:30px}
    .ecomax-care-card{padding:28px;border:1px solid rgba(0,234,255,.16);border-radius:20px;background:linear-gradient(145deg,rgba(5,25,40,.96),rgba(2,11,22,.98));box-shadow:0 16px 45px rgba(0,0,0,.2);transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
    .ecomax-care-card:hover{transform:translateY(-6px);border-color:rgba(0,234,255,.45);box-shadow:0 20px 55px rgba(0,180,220,.12)}
    .ecomax-care-card>span{font-size:10px;letter-spacing:2px;color:#00eaff;font-weight:800}
    .ecomax-care-card h3{font-size:22px;margin:13px 0 12px;color:#f4fbff}
    .ecomax-care-card p{font-size:14px;line-height:1.8;color:rgba(220,238,245,.72);margin:0 0 13px}
    .ecomax-care-card b{color:#00eaff;font-size:13px}
    @media(max-width:900px){.ecomax-care-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:600px){.ecomax-care-knowledge{padding-top:55px;padding-bottom:55px}.ecomax-care-grid{grid-template-columns:1fr}.ecomax-care-card{padding:22px}.ecomax-care-card h3{font-size:19px}.ecomax-care-card p{font-size:13px}}
  `;
  document.head.appendChild(style);
}

function cleanBrokenFooterText(){
  const badPattern=/[ÃÂÐÑ][\u0080-\u00BF]|áƒ|â€™|â€œ|â€�|�/;
  document.querySelectorAll("footer p, footer div, footer span").forEach(el=>{
    const text=(el.textContent||"").trim();
    if(text && badPattern.test(text)) el.style.display="none";
  });
}

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
      @keyframes ecomaxDrive{0%{transform:translate3d(0,0,0) rotate(0deg)}8%{transform:translate3d(9vw,-8px,0) rotate(-1deg)}16%{transform:translate3d(18vw,7px,0) rotate(1deg)}24%{transform:translate3d(27vw,-9px,0) rotate(-1deg)}32%{transform:translate3d(36vw,8px,0) rotate(1deg)}40%{transform:translate3d(45vw,-7px,0) rotate(-1deg)}48%{transform:translate3d(54vw,9px,0) rotate(1deg)}56%{transform:translate3d(63vw,-8px,0) rotate(-1deg)}64%{transform:translate3d(72vw,7px,0) rotate(1deg)}72%{transform:translate3d(81vw,-8px,0) rotate(-1deg)}80%{transform:translate3d(90vw,6px,0) rotate(1deg)}100%{transform:translate3d(calc(100vw + 300px),0,0) rotate(0deg)}}
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

function init(){
  document.querySelectorAll(".product-card").forEach(card=>{volumeUpdate(card);const select=card.querySelector(".volume-select");if(select)select.addEventListener("change",()=>volumeUpdate(card));});
  document.addEventListener("click",event=>{const add=event.target.closest?.(".add-cart");if(add){event.preventDefault();event.stopPropagation();addToCart(add.dataset.name,add.dataset.price,add.dataset.volume);return;}const cartButton=event.target.closest?.("#cartButton");if(cartButton){event.preventDefault();event.stopPropagation();openCart();return;}const checkoutButton=event.target.closest?.("#checkoutButton");if(checkoutButton){event.preventDefault();event.stopPropagation();checkout();return;}const remove=event.target.closest?.(".remove-item");if(remove){event.preventDefault();removeFromCart(Number(remove.dataset.index));return;}if(event.target.closest?.("#closeCart")){event.preventDefault();closeCart();return;}const overlay=document.getElementById("cartOverlay");if(overlay&&event.target===overlay)closeCart();});
  const menuButton=document.getElementById("menuButton"),mobileNav=document.getElementById("mobileNav");if(menuButton&&mobileNav){menuButton.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();mobileNav.classList.toggle("active");});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMobileMenu));}
  updateCart();syncAuthUI();
  const isHome=/(^|\/)index\.html$/.test(location.pathname)||location.pathname==="/"||location.pathname==="";
  if(isHome){cleanBrokenFooterText();installCareCards();installBottomUI();}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();