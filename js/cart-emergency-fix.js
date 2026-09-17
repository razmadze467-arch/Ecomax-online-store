// ECOMAX — clean cart controller
(function(){
  'use strict';
  if(window.__ECOMAX_CLEAN_CART_CONTROLLER__) return;
  window.__ECOMAX_CLEAN_CART_CONTROLLER__=true;

  function overlay(){ return document.getElementById('cartOverlay'); }

  function closed(){
    const el=overlay();
    if(!el) return;
    el.classList.remove('active');
    el.hidden=true;
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
    if(document.body) document.body.style.overflow='';
  }

  function opened(){
    const el=overlay();
    if(!el) return;
    el.hidden=false;
    el.removeAttribute('aria-hidden');
    el.classList.add('active');
    el.style.setProperty('display','flex','important');
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
    el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('position','fixed','important');
    el.style.setProperty('inset','0','important');
    el.style.setProperty('z-index','99999','important');
    if(document.body) document.body.style.overflow='hidden';
    if(typeof window.renderCart==='function') window.renderCart();
    if(typeof window.updateCart==='function') window.updateCart();
  }

  window.openCart=function(){ opened(); return false; };
  window.closeCart=function(){ closed(); return false; };

  function bind(){
    closed();
    document.addEventListener('click',function(e){
      const el=overlay();
      if(!el) return;
      if(e.target===el) closed();
      if(e.target.closest && e.target.closest('#closeCart,.cart-close,[data-close-cart]')) closed();
    },true);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') closed(); });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
