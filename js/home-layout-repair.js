// ECOMAX — final home layout + cart initial-state repair
(function(){
  'use strict';
  if(window.__ECOMAX_HOME_LAYOUT_REPAIR__) return;
  window.__ECOMAX_HOME_LAYOUT_REPAIR__=true;

  function installCSS(){
    let style=document.getElementById('ecomaxHomeLayoutRepairCss');
    if(!style){ style=document.createElement('style'); style.id='ecomaxHomeLayoutRepairCss'; document.head.appendChild(style); }
    style.textContent=`
      /* FINAL COMPACT HERO — prevents the oversized blank area */
      .hero{min-height:0!important;height:auto!important;padding:34px 24px 30px!important;gap:22px!important;align-items:center!important}
      .hero-copy{max-width:720px!important}
      .hero-visual{min-height:390px!important;height:390px!important}
      .hero-halo{width:min(410px,82%)!important}
      .energy-ring{width:62%!important}
      .hero-bottle{transform:scale(.82)!important;transform-origin:center!important}
      .metrics{margin-top:24px!important}
      .section{padding-top:48px!important;padding-bottom:48px!important}
      #products{padding-top:46px!important}

      /* CART: closed by default; only an actual cart-button click can open it */
      #cartOverlay.ecomax-start-closed{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      @media(max-width:900px){
        .hero{min-height:0!important;height:auto!important;padding:26px 18px 24px!important;gap:0!important;display:grid!important}
        .hero-visual{min-height:300px!important;height:300px!important;margin-top:0!important}
        .hero-bottle{transform:scale(.72)!important}
        .hero-halo{width:300px!important}
      }
      @media(max-width:600px){
        .hero{padding:20px 14px 18px!important}
        .hero h1{margin:16px 0 12px!important;font-size:clamp(34px,10vw,50px)!important}
        .hero-description{font-size:12.5px!important;line-height:1.58!important}
        .hero-actions{margin-top:15px!important}
        .metrics{margin-top:17px!important;gap:16px!important}
        .hero-visual{min-height:245px!important;height:245px!important;margin-top:0!important}
        .hero-bottle{transform:scale(.60)!important}
        .hero-halo{width:245px!important}
        .energy-ring{width:190px!important}
        .section{padding-top:34px!important;padding-bottom:34px!important}
        #products{padding-top:32px!important}
      }
    `;
  }

  function forceClosed(){
    const overlay=document.getElementById('cartOverlay');
    if(!overlay)return;
    if(window.__ECOMAX_CART_USER_OPENED__)return;
    overlay.classList.remove('active');
    overlay.classList.add('ecomax-start-closed');
    overlay.style.setProperty('display','none','important');
    overlay.style.setProperty('visibility','hidden','important');
    overlay.style.setProperty('opacity','0','important');
    overlay.style.setProperty('pointer-events','none','important');
    document.body.style.overflow='';
  }

  function allowOpen(){
    window.__ECOMAX_CART_USER_OPENED__=true;
    const overlay=document.getElementById('cartOverlay');
    if(!overlay)return;
    overlay.classList.remove('ecomax-start-closed');
    overlay.style.removeProperty('display');
    overlay.style.removeProperty('visibility');
    overlay.style.removeProperty('opacity');
    overlay.style.removeProperty('pointer-events');
  }

  function init(){
    installCSS();
    forceClosed();
    document.addEventListener('click',function(e){
      if(e.target.closest('#cartButton')) allowOpen();
    },true);
    [100,500,1200,2500].forEach(t=>setTimeout(function(){installCSS();forceClosed()},t));
    const observer=new MutationObserver(function(){
      if(!window.__ECOMAX_CART_USER_OPENED__)forceClosed();
      installCSS();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
