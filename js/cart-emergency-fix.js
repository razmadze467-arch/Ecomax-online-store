// ECOMAX — emergency cart overlay blocker
(function(){
  'use strict';
  if(window.__ECOMAX_CART_KILL_SWITCH_V4__) return;
  window.__ECOMAX_CART_KILL_SWITCH_V4__=true;

  var SELECTOR='#cartOverlay,#cartModal,.cart-overlay,.cart-modal,.cart-panel,.cart-drawer,[data-cart-overlay],[data-cart-drawer]';

  function isCartLayer(el){
    if(!el || el.nodeType!==1) return false;
    if(el.id==='cartButton' || el.classList.contains('cart-button') || el.classList.contains('add-cart') || el.classList.contains('new-add-cart')) return false;
    var key=((el.id||'')+' '+(typeof el.className==='string'?el.className:'')).toLowerCase();
    if(!/cart/.test(key)) return false;
    return /overlay|modal|drawer|panel|container|sidebar|popup|dialog|sheet/.test(key);
  }

  function hide(el){
    if(!el || el.id==='cartButton' || el.classList.contains('cart-button')) return;
    try{el.remove();}catch(e){
      el.hidden=true;
      el.setAttribute('aria-hidden','true');
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('opacity','0','important');
      el.style.setProperty('pointer-events','none','important');
      el.style.setProperty('position','static','important');
      el.style.setProperty('width','0','important');
      el.style.setProperty('height','0','important');
    }
  }

  function removeBrokenCart(){
    if(!document.documentElement) return;
    document.querySelectorAll(SELECTOR).forEach(hide);
    document.querySelectorAll('body *').forEach(function(el){ if(isCartLayer(el)) hide(el); });
    if(document.body) document.body.style.overflow='';
  }

  window.closeCart=function(){ removeBrokenCart(); if(document.body) document.body.style.overflow=''; };
  window.openCart=function(){ removeBrokenCart(); return false; };

  function bind(){
    removeBrokenCart();
    var observer=new MutationObserver(function(){removeBrokenCart();});
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.__ECOMAX_CART_OBSERVER__=observer;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
