// ECOMAX — Premium cart UI layer
(function(){
  'use strict';
  if(window.__ECOMAX_CART_PRO__) return;
  window.__ECOMAX_CART_PRO__=true;

  const style=document.createElement('style');
  style.textContent=`
    #cartOverlay{backdrop-filter:blur(7px);background:rgba(0,7,14,.72)!important}
    #cartModal,.cart-modal,.cart-panel,.cart-drawer{border:1px solid rgba(0,234,255,.22)!important;border-radius:22px!important;box-shadow:0 25px 90px rgba(0,0,0,.62),0 0 40px rgba(0,234,255,.10)!important;overflow:hidden}
    .ecomax-cart-pro-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 18px;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.08);background:linear-gradient(90deg,rgba(0,234,255,.08),transparent)}
    .ecomax-cart-pro-title{font-weight:1000;letter-spacing:.5px;color:#fff}.ecomax-cart-pro-count{font-size:11px;color:#8ca7b3}
    .ecomax-cart-pro-item{display:grid;grid-template-columns:1fr auto;gap:10px;padding:13px 12px;margin:8px 0;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015));transition:.2s}
    .ecomax-cart-pro-item:hover{border-color:rgba(0,234,255,.24);transform:translateY(-1px)}
    .ecomax-cart-pro-name{font-weight:900;color:#f1fbff}.ecomax-cart-pro-meta{margin-top:4px;font-size:11px;color:#8299a5}.ecomax-cart-pro-price{font-weight:1000;color:#00eaff;white-space:nowrap}
    .ecomax-cart-pro-actions{display:flex;align-items:center;gap:7px;margin-top:9px}.ecomax-cart-pro-actions button{min-width:32px;height:30px;border-radius:9px;border:1px solid rgba(0,234,255,.24);background:rgba(0,234,255,.06);color:#fff;font-weight:1000;cursor:pointer}.ecomax-cart-pro-actions .qty{min-width:36px;text-align:center;color:#dffaff}
    .ecomax-cart-pro-remove{border-color:rgba(255,70,90,.25)!important;color:#ff6676!important;background:rgba(255,50,70,.06)!important}
    .ecomax-cart-pro-total{display:flex;align-items:center;justify-content:space-between;padding:16px 2px;margin-top:10px;border-top:1px solid rgba(255,255,255,.09);font-weight:900;color:#a8bdc6}.ecomax-cart-pro-total strong{font-size:25px;color:#00eaff;text-shadow:0 0 18px rgba(0,234,255,.22)}
    .ecomax-cart-pro-checkout{width:100%;height:50px;border:1px solid rgba(0,234,255,.42);border-radius:13px;background:linear-gradient(100deg,rgba(0,234,255,.22),rgba(125,70,255,.18));color:#fff;font-weight:1000;cursor:pointer;box-shadow:0 0 25px rgba(0,234,255,.12);margin-top:5px}.ecomax-cart-pro-checkout:hover{box-shadow:0 0 35px rgba(0,234,255,.22)}
    .ecomax-cart-pro-empty{text-align:center;padding:35px 12px;color:#8ca2ad}.ecomax-cart-pro-empty b{display:block;color:#fff;font-size:18px;margin-bottom:7px}
    @media(max-width:600px){.ecomax-cart-pro-item{grid-template-columns:1fr}.ecomax-cart-pro-price{margin-top:-4px}.ecomax-cart-pro-actions button{height:34px;min-width:36px}}
  `;
  document.head.appendChild(style);

  function getCart(){try{return JSON.parse(localStorage.getItem('ecomax_cart')||'[]')}catch(e){return []}}
  function setCart(c){localStorage.setItem('ecomax_cart',JSON.stringify(c));window.dispatchEvent(new StorageEvent('storage',{key:'ecomax_cart',newValue:JSON.stringify(c)}));if(typeof window.updateCart==='function')window.updateCart()}
  function money(v){return Number(v||0).toFixed(2).replace(/\.00$/,'')+' ₾'}
  function findContainer(){return document.querySelector('#cartItems,#cartContent,.cart-items,.cart-list,[data-cart-items]')}
  function render(){const box=findContainer();if(!box)return;const cart=getCart();let total=0;cart.forEach(i=>total+=Number(i.price||0)*Number(i.quantity||1));box.innerHTML='';
    if(!cart.length){box.innerHTML='<div class="ecomax-cart-pro-empty"><b>კალათა ცარიელია</b>დაამატე სასურველი პროდუქტი და შეკვეთა აქ გამოჩნდება.</div>';return}
    const head=document.createElement('div');head.className='ecomax-cart-pro-head';head.innerHTML='<div class="ecomax-cart-pro-title">🛒 თქვენი კალათა</div><div class="ecomax-cart-pro-count">'+cart.reduce((n,i)=>n+Number(i.quantity||1),0)+' ერთეული</div>';box.appendChild(head);
    cart.forEach((item,index)=>{const qty=Math.max(1,Number(item.quantity||1));const el=document.createElement('div');el.className='ecomax-cart-pro-item';el.innerHTML='<div><div class="ecomax-cart-pro-name"></div><div class="ecomax-cart-pro-meta"></div><div class="ecomax-cart-pro-actions"><button data-act="minus">−</button><span class="qty">'+qty+'</span><button data-act="plus">+</button><button class="ecomax-cart-pro-remove" data-act="remove">წაშლა</button></div></div><div class="ecomax-cart-pro-price">'+money(Number(item.price||0)*qty)+'</div>';el.querySelector('.ecomax-cart-pro-name').textContent=item.name||item.product_name||'პროდუქტი';el.querySelector('.ecomax-cart-pro-meta').textContent=(item.volume?item.volume+' • ':'')+money(item.price)+' / ერთეული';el.querySelector('[data-act="minus"]').onclick=()=>change(index,-1);el.querySelector('[data-act="plus"]').onclick=()=>change(index,1);el.querySelector('[data-act="remove"]').onclick=()=>remove(index);box.appendChild(el)});
    const foot=document.createElement('div');foot.className='ecomax-cart-pro-total';foot.innerHTML='<span>ჯამი</span><strong>'+money(total)+'</strong>';box.appendChild(foot);const btn=document.createElement('button');btn.className='ecomax-cart-pro-checkout';btn.textContent='შეკვეთის გაფორმება →';btn.onclick=()=>{if(typeof window.goToCheckout==='function')window.goToCheckout();else if(typeof window.checkout==='function')window.checkout();else location.href='checkout.html'};box.appendChild(btn);
  }
  function change(i,d){const c=getCart();if(!c[i])return;c[i].quantity=Math.max(0,Number(c[i].quantity||1)+d);if(c[i].quantity===0)c.splice(i,1);setCart(c);setTimeout(render,0)}
  function remove(i){const c=getCart();c.splice(i,1);setCart(c);render()}

  function hideOverlay(){
    const overlay=document.getElementById('cartOverlay');
    if(!overlay)return;
    if(overlay.classList.contains('active') || !overlay.hidden || getComputedStyle(overlay).display!=='none'){
      overlay.classList.remove('active','open','show');
      overlay.hidden=true;
      overlay.setAttribute('aria-hidden','true');
      overlay.style.setProperty('display','none','important');
      overlay.style.setProperty('visibility','hidden','important');
      overlay.style.setProperty('opacity','0','important');
      overlay.style.setProperty('pointer-events','none','important');
    }
    if(document.body)document.body.style.overflow='';
  }
  function allowOverlay(){
    window.__ECOMAX_CART_USER_OPENED__=true;
    const overlay=document.getElementById('cartOverlay');
    if(!overlay)return;
    overlay.hidden=false;
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('active');
    overlay.style.removeProperty('display');
    overlay.style.removeProperty('visibility');
    overlay.style.removeProperty('opacity');
    overlay.style.removeProperty('pointer-events');
    render();
  }

  function hook(){
    window.__ECOMAX_CART_USER_OPENED__=false;
    hideOverlay();

    document.addEventListener('click',e=>{
      const target=e.target;
      const cartBtn=target&&target.closest&&target.closest('#cartButton,.cart-button,[data-cart-button]');
      const closeBtn=target&&target.closest&&target.closest('#cartClose,.cart-close,[data-cart-close]');
      if(cartBtn){
        window.__ECOMAX_CART_USER_OPENED__=true;
        setTimeout(allowOverlay,0);
        return;
      }
      if(closeBtn || target===document.getElementById('cartOverlay')){
        window.__ECOMAX_CART_USER_OPENED__=false;
        hideOverlay();
      }
    },true);

    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){
        window.__ECOMAX_CART_USER_OPENED__=false;
        hideOverlay();
      }
    },true);

    const observer=new MutationObserver(()=>{
      const overlay=document.getElementById('cartOverlay');
      if(overlay && !window.__ECOMAX_CART_USER_OPENED__ && (overlay.classList.contains('active') || !overlay.hidden || getComputedStyle(overlay).display!=='none')){
        hideOverlay();
      }
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
    window.__ECOMAX_CART_PRO_OBSERVER__=observer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook,{once:true});else hook();
})();