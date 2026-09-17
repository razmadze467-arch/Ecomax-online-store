// ECOMAX — cart startup guard (no MutationObserver)
(function(){
  'use strict';
  if(window.__ECOMAX_CART_STARTUP_GUARD_V5__) return;
  window.__ECOMAX_CART_STARTUP_GUARD_V5__=true;

  function overlay(){ return document.getElementById('cartOverlay'); }
  function hide(){
    var el=overlay();
    if(!el) return;
    el.classList.remove('active','open','show','ecomax-user-cart-open');
    el.hidden=true;
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
    if(document.body) document.body.style.overflow='';
  }
  function show(){
    var el=overlay();
    if(!el) return;
    el.hidden=false;
    el.removeAttribute('aria-hidden');
    el.classList.add('active','ecomax-user-cart-open');
    el.style.setProperty('display','flex','important');
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
    el.style.setProperty('pointer-events','auto','important');
    if(document.body) document.body.style.overflow='hidden';
    if(typeof window.renderCart==='function') window.renderCart();
  }

  // Never use a DOM mutation observer here: changing the overlay's own
  // attributes from an observer creates an endless mutation loop on mobile.
  var css=document.createElement('style');
  css.id='ecomaxCartStartupGuardV5';
  css.textContent='#cartOverlay{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}#cartOverlay.ecomax-user-cart-open{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}';
  (document.head||document.documentElement).appendChild(css);

  function bind(){
    hide();
    document.addEventListener('click',function(e){
      var t=e.target;
      if(!t||!t.closest) return;
      var cartBtn=t.closest('#cartButton,.cart-button,[data-cart-button]');
      if(cartBtn){
        e.preventDefault();
        e.stopPropagation();
        show();
        return;
      }
      var closeBtn=t.closest('#cartClose,#closeCart,.cart-close,[data-cart-close],[data-close-cart]');
      if(closeBtn || (t.closest('#cartOverlay') && t===overlay())){
        e.preventDefault();
        e.stopPropagation();
        hide();
      }
    },true);
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') hide();
    },true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
