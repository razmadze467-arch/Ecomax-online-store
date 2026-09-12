"use strict";

let cart = [];
try { cart = JSON.parse(localStorage.getItem("ecomax_cart") || "[]"); } catch(e) { cart = []; }
if (!Array.isArray(cart)) cart = [];

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

function saveCart(){ localStorage.setItem("ecomax_cart", JSON.stringify(cart)); }
function total(){ return cart.reduce((s,i)=>s + Number(i.price)*Number(i.quantity),0); }
function escapeHTML(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}

function renderCart(){
  if(!cartItems) return;
  if(!cart.length){ cartItems.innerHTML='<div class="empty-cart"><div>🛒</div><h3>კალათა ცარიელია</h3><p>დაამატე პროდუქტი კალათაში.</p></div>'; return; }
  cartItems.innerHTML=cart.map((i,n)=>`<div class="cart-item"><div class="cart-item-info"><strong>${escapeHTML(i.name)}</strong><span>${escapeHTML(i.volume)} × ${i.quantity}</span></div><div class="cart-item-price">${Number(i.price)*Number(i.quantity)} ₾</div><button class="remove-item" data-index="${n}">×</button></div>`).join("");
}
function updateCart(){
  const count=cart.reduce((s,i)=>s+Number(i.quantity||0),0);
  if(cartCount) cartCount.textContent=count;
  if(cartTotal) cartTotal.textContent=`${total()} ₾`;
  renderCart(); saveCart();
}
function addToCart(name,price,volume){
  price=Number(price);
  if(!name || !Number.isFinite(price) || price<=0){showNotification("პროდუქტის დამატება ვერ მოხერხდა");return;}
  const old=cart.find(i=>i.name===name && i.volume===volume);
  if(old) old.quantity+=1; else cart.push({name,price,volume,quantity:1});
  updateCart(); showNotification(`${name} დაემატა კალათაში`);
}
function removeFromCart(index){ if(index>=0 && index<cart.length){cart.splice(index,1);updateCart();} }
function openCart(){if(cartOverlay){cartOverlay.classList.add("active");document.body.style.overflow="hidden";renderCart();}}
function closeCartPanel(){if(cartOverlay){cartOverlay.classList.remove("active");document.body.style.overflow="";}}

cartButton?.addEventListener("click",openCart);
closeCart?.addEventListener("click",closeCartPanel);
cartOverlay?.addEventListener("click",e=>{if(e.target===cartOverlay)closeCartPanel();});
cartItems?.addEventListener("click",e=>{const b=e.target.closest(".remove-item");if(b)removeFromCart(Number(b.dataset.index));});

function updateProductVolume(card){
  const s=card.querySelector(".volume-select"), p=card.querySelector(".selected-price"), v=card.querySelector(".selected-volume"), b=card.querySelector(".add-cart");
  if(!s||!p||!v||!b)return;
  const volume=Math.min(20,Math.max(.5,Number(s.value)||.5));
  const price=volume*Number(card.dataset.unitPrice||10);
  const label=volume===.5?"500 მლ":`${volume} ლიტრი`;
  p.textContent=`${price} ₾`; v.textContent=label; b.dataset.price=price; b.dataset.volume=label;
}

document.querySelectorAll(".product-card").forEach(card=>{updateProductVolume(card);card.querySelector(".volume-select")?.addEventListener("change",()=>updateProductVolume(card));});
document.querySelectorAll(".add-cart").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.name,b.dataset.price,b.dataset.volume)));

/* REAL CHECKOUT: the old version only displayed a notification. */
checkoutButton?.addEventListener("click",()=>{
  if(!cart.length){showNotification("კალათა ცარიელია");return;}
  saveCart();
  window.location.href="checkout.html";
});

const menuButton=document.getElementById("menuButton"), mobileNav=document.getElementById("mobileNav");
if(menuButton&&mobileNav){menuButton.addEventListener("click",()=>mobileNav.classList.toggle("active"));mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("active")));}

function showNotification(message){
  document.querySelector(".ecomax-notification")?.remove();
  const n=document.createElement("div"); n.className="ecomax-notification"; n.textContent=message;
  Object.assign(n.style,{position:"fixed",right:"25px",bottom:"25px",zIndex:"5000",padding:"15px 20px",border:"1px solid rgba(0,234,255,.35)",borderRadius:"12px",background:"rgba(3,16,28,.95)",color:"#dffaff",boxShadow:"0 0 30px rgba(0,234,255,.18)"});
  document.body.appendChild(n); setTimeout(()=>n.remove(),2500);
}
updateCart();
