/* ECOMAX — remove the EXTRA floating cart widget only.
   The real #cartOverlay, #cartButton and checkout flow stay intact. */
(function(){
  'use strict';
  if(window.__ECOMAX_FLOATING_CART_KILL_V2__) return;
  window.__ECOMAX_FLOATING_CART_KILL_V2__=true;

  const KEEP=new Set(['cartOverlay','cartButton']);
  const BAD_CLASS=/(^|[-_\s])(floating|float|dock|widget|shortcut|quick|mini|bottom|mobile)[-_\s]*(cart)([-_\s]|$)|(^|[-_\s])(cart)[-_\s]*(floating|float|dock|widget|shortcut|quick|mini|bottom|mobile)([-_\s]|$)/i;
  const BAD_TEXT=/(ECOMAX\s+CART|კალათა\s*ცარიელია|კალათის\s+ნახვა)/i;

  function isReal(el){
    if(!el || el.nodeType!==1) return true;
    if(KEEP.has(el.id)) return true;
    if(el.closest && el.closest('#cartOverlay')) return true;
    return false;
  }

  function hide(el){
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('pointer-events','none','important');
  }

  function removeExtra(){
    const nodes=document.querySelectorAll('body *');
    nodes.forEach(function(el){
      if(isReal(el)) return;
      const key=((el.id||'')+' '+(typeof el.className==='string'?el.className:''));
      const text=(el.innerText||el.textContent||'').trim();
      const classMatch=BAD_CLASS.test(key);
      const textMatch=BAD_TEXT.test(text);
      if(!classMatch && !textMatch) return;
      const st=getComputedStyle(el);
      if(st.position==='fixed' || st.position==='sticky' || el.matches('.cart-overlay')) hide(el);
    });
  }

  function boot(){
    removeExtra();
    setTimeout(removeExtra,150);
    setTimeout(removeExtra,500);
    setTimeout(removeExtra,1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
