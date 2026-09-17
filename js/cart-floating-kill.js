/* ECOMAX — remove the EXTRA floating cart widget only.
   The real #cartOverlay, #cartButton and checkout flow stay intact. */
(function(){
  'use strict';
  if(window.__ECOMAX_FLOATING_CART_KILL_V1__) return;
  window.__ECOMAX_FLOATING_CART_KILL_V1__=true;

  const KEEP=new Set(['cartOverlay','cartButton']);
  const BAD=/(^|[-_\s])(floating|float|dock|widget|shortcut|quick|mini|bottom|mobile)[-_\s]*(cart)([-_\s]|$)|(^|[-_\s])(cart)[-_\s]*(floating|float|dock|widget|shortcut|quick|mini|bottom|mobile)([-_\s]|$)/i;

  function isReal(el){
    if(!el || el.nodeType!==1) return true;
    if(KEEP.has(el.id)) return true;
    if(el.closest && el.closest('#cartOverlay')) return true;
    return false;
  }

  function removeExtra(){
    const nodes=document.querySelectorAll('[class],[id]');
    nodes.forEach(function(el){
      if(isReal(el)) return;
      const key=((el.id||'')+' '+(typeof el.className==='string'?el.className:''));
      if(!BAD.test(key)) return;
      const st=getComputedStyle(el);
      if(st.position==='fixed' || st.position==='sticky' || el.matches('.cart-overlay')){
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('opacity','0','important');
        el.style.setProperty('pointer-events','none','important');
      }
    });
  }

  function boot(){
    removeExtra();
    setTimeout(removeExtra,300);
    setTimeout(removeExtra,1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
