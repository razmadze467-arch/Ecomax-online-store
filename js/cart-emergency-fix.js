// ECOMAX — cart overlay kill switch
(function(){
  'use strict';
  if(window.__ECOMAX_CART_KILL_SWITCH_V2__) return;
  window.__ECOMAX_CART_KILL_SWITCH_V2__=true;

  var SELECTOR='#cartOverlay,#cartModal,.cart-overlay,.cart-modal,.cart-panel,.cart-drawer,[data-cart-overlay],[data-cart-drawer]';
  var OPENED=false;

  function hideNode(o){
    if(!o || o.id==='cartButton' || o.classList.contains('cart-button')) return;
    o.classList.remove('active','open','show','visible');
    o.setAttribute('aria-hidden','true');
    o.hidden=true;
    o.style.setProperty('display','none','important');
    o.style.setProperty('visibility','hidden','important');
    o.style.setProperty('opacity','0','important');
    o.style.setProperty('pointer-events','none','important');
    o.style.setProperty('position','fixed','important');
    o.style.setProperty('inset','0','important');
    o.style.setProperty('z-index','-1','important');
    document.body.style.overflow='';
  }

  function hideAll(){
    if(OPENED) return;
    document.querySelectorAll(SELECTOR).forEach(hideNode);
  }

  function show(){
    OPENED=true;
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

  function close(){
    OPENED=false;
    hideAll();
  }

  window.closeCart=close;
  window.openCart=show;

  function bind(){
    hideAll();

    document.addEventListener('click',function(e){
      var t=e.target&&e.target.closest?e.target.closest('#closeCart,#cartClose,.close-cart,.cart-close,[data-cart-close]'):null;
      if(t){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();close();return;}
      var b=e.target&&e.target.closest?e.target.closest('#cartButton,.cart-button,[data-open-cart]'):null;
      if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show();return;}
      var o=document.getElementById('cartOverlay');
      if(o&&e.target===o){e.preventDefault();close();}
    },true);

    document.addEventListener('pointerup',function(e){
      var t=e.target&&e.target.closest?e.target.closest('#closeCart,#cartClose,.close-cart,.cart-close,[data-cart-close]'):null;
      if(t){e.preventDefault();e.stopImmediatePropagation();close();}
    },true);

    document.addEventListener('touchend',function(e){
      var t=e.target&&e.target.closest?e.target.closest('#closeCart,#cartClose,.close-cart,.cart-close,[data-cart-close]'):null;
      if(t){e.preventDefault();e.stopImmediatePropagation();close();}
    },true);

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}
    },true);

    var observer=new MutationObserver(function(){hideAll();});
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
    window.__ECOMAX_CART_OBSERVER__=observer;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
