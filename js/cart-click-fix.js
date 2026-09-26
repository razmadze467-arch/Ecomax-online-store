/* ECOMAX — cart click reliability fix */
(function(){
  "use strict";
  if(window.__ECOMAX_CART_CLICK_FIX__) return;
  window.__ECOMAX_CART_CLICK_FIX__=true;

  function read(){
    try{
      const v=JSON.parse(localStorage.getItem("ecomax_cart")||"[]");
      return Array.isArray(v)?v:[];
    }catch(e){ return []; }
  }
  function write(v){ try{localStorage.setItem("ecomax_cart",JSON.stringify(v));}catch(e){} }
  function fallbackAdd(name,price,volume){
    const p=Number(price);
    if(!name || !Number.isFinite(p) || p<=0) return;
    const cart=read();
    const old=cart.find(x=>x.name===name && x.volume===volume);
    if(old) old.quantity=Math.max(1,Number(old.quantity||0))+1;
    else cart.push({name:String(name),price:p,volume:String(volume||""),quantity:1});
    write(cart);
    fallbackRender();
  }
  function fallbackRender(){
    const cart=read();
    const count=cart.reduce((s,x)=>s+Number(x.quantity||0),0);
    const total=cart.reduce((s,x)=>s+Number(x.price||0)*Number(x.quantity||0),0);
    const countEl=document.getElementById("cartCount");
    const totalEl=document.getElementById("cartTotal");
    if(countEl) countEl.textContent=String(count);
    if(totalEl) totalEl.textContent=total+" ₾";
    const el=document.getElementById("cartItems");
    if(!el) return;
    if(!cart.length){
      el.innerHTML='<div class="empty-cart"><div>🛒</div><h3>კალათა ცარიელია</h3><p>დაამატე პროდუქტი კალათაში.</p></div>';
      return;
    }
    el.innerHTML=cart.map((x,i)=>'<div class="cart-item"><div class="cart-item-info"><strong>'+esc(x.name)+'</strong><span>'+esc(x.volume)+' × '+Number(x.quantity||1)+'</span></div><div class="cart-item-price">'+(Number(x.price||0)*Number(x.quantity||1))+' ₾</div><button type="button" class="remove-item" data-index="'+i+'">×</button></div>').join("");
  }
  function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function notify(name){
    if(typeof window.__ecomaxCartNotify==="function") return window.__ecomaxCartNotify(name);
    const n=document.createElement("div");
    n.textContent=name+" დაემატა კალათაში";
    Object.assign(n.style,{position:"fixed",right:"20px",bottom:"85px",zIndex:"999999",padding:"14px 18px",background:"#03101c",color:"#00eaff",border:"1px solid #00eaff",borderRadius:"10px",fontWeight:"700"});
    document.body.appendChild(n); setTimeout(()=>n.remove(),1800);
  }

  document.addEventListener("click",function(event){
    /* CART BUTTON — capture-phase hard fix.
       Opens the real overlay even if another script/handler is broken. */
    const cartBtn=event.target && event.target.closest ? event.target.closest("#cartButton,.cart-button") : null;
    if(cartBtn){
      event.preventDefault();
      event.stopImmediatePropagation();
      const overlay=document.getElementById("cartOverlay");
      if(overlay){
        overlay.classList.add("active");
        overlay.style.display="flex";
        overlay.style.zIndex="99999";
        document.body.style.overflow="hidden";
        if(typeof window.updateCart==="function") window.updateCart();
        else fallbackRender();
      }
      return;
    }
    const btn=event.target && event.target.closest ? event.target.closest(".add-cart") : null;
    if(!btn) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const name=btn.dataset.name || btn.getAttribute("data-name") || "";
    const price=btn.dataset.price || btn.getAttribute("data-price") || "";
    const volume=btn.dataset.volume || btn.getAttribute("data-volume") || "";
    if(typeof window.addToCart==="function"){
      window.addToCart(name,price,volume);
    }else{
      fallbackAdd(name,price,volume);
    }
    notify(name);
  },true);

  if(typeof window.addToCart!=="function"){
    window.addToCart=fallbackAdd;
    window.updateCart=fallbackRender;
    window.renderCart=fallbackRender;
  }
})();