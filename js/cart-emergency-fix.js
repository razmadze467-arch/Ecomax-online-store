// ECOMAX — emergency cart overlay blocker
(function(){
  'use strict';
  if(window.__ECOMAX_CART_KILL_SWITCH_V3__) return;
  window.__ECOMAX_CART_KILL_SWITCH_V3__=true;

  // The legacy cart overlay is currently the element covering the homepage.
  // Remove it completely until the cart UI is rebuilt cleanly.
  var SELECTOR='#cartOverlay,#cartModal,.cart-overlay,.cart-modal,.cart-panel,.cart-drawer,[data-cart-overlay],[data-cart-drawer]';

  function removeBrokenCart(){
    document.querySelectorAll(SELECTOR).forEach(function(el){
      if(el.id==='cartButton' || el.classList.contains('cart-button')) return;
      try{el.remove();}catch(e){
        el.hidden=true;
        el.style.setProperty('display','none','important');
        el.style.setProperty('pointer-events','none','important');
      }
    });
    document.body.style.overflow='';
  }

  window.closeCart=function(){
    removeBrokenCart();
    document.body.style.overflow='';
  };

  // Do NOT expose an opener that recreates the broken overlay.
  window.openCart=function(){
    removeBrokenCart();
    return false;
  };

  function bind(){
    removeBrokenCart();
    var observer=new MutationObserver(function(){removeBrokenCart();});
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.__ECOMAX_CART_OBSERVER__=observer;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
