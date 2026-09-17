// ECOMAX — emergency cart overlay fix
(function(){
  'use strict';
  if(window.__ECOMAX_CART_EMERGENCY_FIX__) return;
  window.__ECOMAX_CART_EMERGENCY_FIX__=true;

  function close(){
    var o=document.getElementById('cartOverlay');
    if(!o) return;
    o.classList.remove('active','open','show');
    o.setAttribute('aria-hidden','true');
    o.style.setProperty('display','none','important');
    o.style.setProperty('visibility','hidden','important');
    o.style.setProperty('opacity','0','important');
    o.style.setProperty('pointer-events','none','important');
    document.body.style.overflow='';
  }

  function open(){
    var o=document.getElementById('cartOverlay');
    if(!o) return;
    o.classList.remove('ecomax-start-closed');
    o.classList.add('active');
    o.removeAttribute('aria-hidden');
    o.style.removeProperty('display');
    o.style.removeProperty('visibility');
    o.style.removeProperty('opacity');
    o.style.removeProperty('pointer-events');
    o.style.zIndex='2000';
    document.body.style.overflow='hidden';
    if(typeof window.renderCart==='function') window.renderCart();
    if(typeof window.updateCart==='function') window.updateCart();
  }

  window.closeCart=close;
  window.openCart=open;

  function bind(){
    close();
    document.addEventListener('click',function(e){
      var closeBtn=e.target.closest('#cartClose,.cart-close,[data-cart-close],[aria-label="დახურვა"],[aria-label="Close"]');
      if(closeBtn){ e.preventDefault(); e.stopPropagation(); close(); return; }
      var cartBtn=e.target.closest('#cartButton,.cart-button,[data-open-cart]');
      if(cartBtn){ e.preventDefault(); e.stopPropagation(); open(); return; }
      var overlay=document.getElementById('cartOverlay');
      if(overlay && e.target===overlay) close();
    },true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();},true);
    [0,100,500,1000,2000,4000].forEach(function(t){setTimeout(close,t);});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
