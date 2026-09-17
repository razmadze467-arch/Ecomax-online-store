// ECOMAX — strict cart visibility controller
(function(){
  'use strict';
  if(window.__ECOMAX_STRICT_CART_CONTROLLER_V3__) return;
  window.__ECOMAX_STRICT_CART_CONTROLLER_V3__=true;

  var userOpened=false;

  function getOverlays(){
    return document.querySelectorAll('#cartOverlay');
  }

  function hide(el){
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

  function hideAll(){
    if(userOpened) return;
    getOverlays().forEach(hide);
  }

  function show(){
    var el=getOverlays()[0];
    if(!el) return false;
    userOpened=true;
    el.hidden=false;
    el.removeAttribute('aria-hidden');
    el.classList.add('ecomax-user-cart-open','active');
    el.style.setProperty('display','flex','important');
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
    el.style.setProperty('pointer-events','auto','important');
    el.style.setProperty('position','fixed','important');
    el.style.setProperty('inset','0','important');
    el.style.setProperty('z-index','99999','important');
    if(document.body) document.body.style.overflow='hidden';
    if(typeof window.renderCart==='function') window.renderCart();
    return false;
  }

  function close(){
    userOpened=false;
    hideAll();
    return false;
  }

  window.openCart=show;
  window.closeCart=close;

  var css=document.createElement('style');
  css.id='ecomaxStrictCartCssV3';
  css.textContent='#cartOverlay{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}#cartOverlay.ecomax-user-cart-open{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;}';
  (document.head||document.documentElement).appendChild(css);

  function bind(){
    hideAll();

    document.addEventListener('click',function(e){
      var target=e.target;
      if(target && target.closest){
        if(target.closest('#cartButton,.cart-button,[data-cart-button]')){
          e.preventDefault();
          e.stopPropagation();
          show();
          return;
        }
        if(target.closest('#closeCart,.cart-close,[data-close-cart]')){
          e.preventDefault();
          e.stopPropagation();
          close();
          return;
        }
      }
      var el=target && target.closest ? target.closest('#cartOverlay') : null;
      if(el && target===el) close();
    },true);

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape') close();
    },true);

    var observer=new MutationObserver(function(mutations){
      var found=false;
      mutations.forEach(function(m){
        if(m.type==='childList') found=true;
        if(m.type==='attributes' && m.target && m.target.id==='cartOverlay') found=true;
      });
      if(found && !userOpened) hideAll();
      getOverlays().forEach(function(el){
        if(!el.__ecomaxStrictObserved){
          el.__ecomaxStrictObserved=true;
          observer.observe(el,{attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
          if(!userOpened) hide(el);
        }
      });
    });

    observer.observe(document.documentElement,{childList:true,subtree:true});
    getOverlays().forEach(function(el){
      el.__ecomaxStrictObserved=true;
      observer.observe(el,{attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
    });

    setTimeout(hideAll,0);
    setTimeout(hideAll,100);
    setTimeout(hideAll,500);
    setTimeout(hideAll,1500);
    setTimeout(hideAll,3000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();
