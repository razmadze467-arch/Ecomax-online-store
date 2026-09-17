// ECOMAX — cart overlay kill switch
(function(){
  'use strict';
  if(window.__ECOMAX_CART_KILL_SWITCH__) return;
  window.__ECOMAX_CART_KILL_SWITCH__=true;

  function hide(){
    var o=document.getElementById('cartOverlay');
    if(!o) return;
    o.classList.remove('active','open','show','visible');
    o.setAttribute('aria-hidden','true');
    o.hidden=true;
    o.style.cssText += ';display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;position:fixed !important;inset:0 !important;z-index:-1 !important;transform:none !important;';
    document.body.style.overflow='';
  }

  function show(){
    var o=document.getElementById('cartOverlay');
    if(!o) return;
    o.hidden=false;
    o.classList.add('active');
    o.removeAttribute('aria-hidden');
    o.style.removeProperty('display');
    o.style.removeProperty('visibility');
    o.style.removeProperty('opacity');
    o.style.removeProperty('pointer-events');
    o.style.removeProperty('z-index');
    o.style.removeProperty('transform');
    o.style.zIndex='2000';
    document.body.style.overflow='hidden';
    if(typeof window.updateCart==='function') window.updateCart();
  }

  window.closeCart=hide;
  window.openCart=show;

  function bind(){
    hide();
    var close=function(e){
      var t=e.target && e.target.closest ? e.target.closest('#closeCart,#cartClose,.close-cart,.cart-close,[data-cart-close]') : null;
      if(t){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();hide();}
    };
    document.addEventListener('click',close,true);
    document.addEventListener('pointerup',close,true);
    document.addEventListener('touchend',close,true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();hide();}},true);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
