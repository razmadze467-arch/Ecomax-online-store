// ECOMAX — cart visibility guard
(function(){
  'use strict';
  if(window.__ECOMAX_CART_VISIBILITY_GUARD_V2__) return;
  window.__ECOMAX_CART_VISIBILITY_GUARD_V2__=true;

  var userOpened=false;
  function overlays(){return document.querySelectorAll('#cartOverlay');}
  function hide(el){
    if(!el)return;
    el.classList.remove('active','open','show');
    el.hidden=true;
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
    el.style.removeProperty('position');
    el.style.removeProperty('inset');
  }
  function hideAll(){
    if(!userOpened){overlays().forEach(hide);if(document.body)document.body.style.overflow='';}
  }
  function show(){
    var el=overlays()[0];
    if(!el)return false;
    userOpened=true;
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
    if(document.body)document.body.style.overflow='hidden';
    if(typeof window.renderCart==='function')window.renderCart();
    return false;
  }
  function close(){userOpened=false;hideAll();return false;}
  window.openCart=show;
  window.closeCart=close;

  function bind(){
    hideAll();
    document.addEventListener('click',function(e){
      var target=e.target;
      if(target&&target.closest){
        if(target.closest('#cartButton,.cart-button,[data-cart-button]')){e.preventDefault();e.stopPropagation();show();return;}
        if(target.closest('#closeCart,.cart-close,[data-close-cart]')){e.preventDefault();e.stopPropagation();close();return;}
      }
      var el=overlays()[0];
      if(el&&target===el)close();
    },true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();},true);
    var observer=new MutationObserver(function(){
      if(!userOpened)hideAll();
    });
    function watch(){
      overlays().forEach(function(el){
        if(!el.__ecomaxWatched){
          el.__ecomaxWatched=true;
          observer.observe(el,{attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
        }
      });
      hideAll();
    }
    watch();
    setTimeout(watch,50);setTimeout(watch,250);setTimeout(watch,800);setTimeout(watch,1500);setTimeout(watch,3000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();