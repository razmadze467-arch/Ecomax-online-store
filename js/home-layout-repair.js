// ECOMAX — home layout + cart initial-state repair
(function(){
  'use strict';
  if(window.__ECOMAX_HOME_LAYOUT_REPAIR__) return;
  window.__ECOMAX_HOME_LAYOUT_REPAIR__=true;

  const style=document.createElement('style');
  style.id='ecomaxHomeLayoutRepairCss';
  style.textContent=`
    /* Remove the oversized empty hero area while keeping the 3D visual. */
    .hero{min-height:560px!important;padding-top:38px!important;padding-bottom:42px!important;gap:28px!important}
    .hero-visual{min-height:400px!important}
    .hero-halo{width:min(430px,88%)!important}
    .energy-ring{width:64%!important}
    .hero-bottle{transform:scale(.88);transform-origin:center}
    .metrics{margin-top:28px!important}
    @media(max-width:900px){
      .hero{min-height:auto!important;padding-top:30px!important;padding-bottom:28px!important;gap:8px!important}
      .hero-visual{min-height:330px!important;margin-top:-4px!important}
      .hero-bottle{transform:scale(.78);}
    }
    @media(max-width:600px){
      .hero{padding-left:16px!important;padding-right:16px!important}
      .hero h1{margin-top:18px!important;margin-bottom:14px!important}
      .hero-description{font-size:13px!important;line-height:1.65!important}
      .hero-actions{margin-top:18px!important}
      .metrics{margin-top:20px!important;gap:20px!important}
      .hero-visual{min-height:270px!important}
      .hero-bottle{transform:scale(.66);}
      .hero-halo{width:290px!important}
      .energy-ring{width:220px!important}
    }

    /* Cart must start closed. openCart() is the only intended way to show it. */
    #cartOverlay.ecomax-start-closed{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
  `;
  document.head.appendChild(style);

  function closeInitialCart(){
    const overlay=document.getElementById('cartOverlay');
    if(!overlay) return;
    overlay.classList.remove('active');
    overlay.classList.add('ecomax-start-closed');
    overlay.style.display='none';
    overlay.style.visibility='hidden';
    overlay.style.opacity='0';
    overlay.style.pointerEvents='none';
    document.body.style.overflow='';
  }

  function allowCartOpen(){
    const overlay=document.getElementById('cartOverlay');
    if(!overlay) return;
    overlay.classList.remove('ecomax-start-closed');
    overlay.style.visibility='';
    overlay.style.opacity='';
    overlay.style.pointerEvents='';
  }

  function init(){
    closeInitialCart();
    document.addEventListener('click',function(e){
      if(e.target.closest('#cartButton')){
        allowCartOpen();
      }
    },true);
    window.addEventListener('pageshow',closeInitialCart,{once:true});
    setTimeout(closeInitialCart,250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
