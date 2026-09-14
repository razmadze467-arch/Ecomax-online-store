/* ECOMAX MOBILE PASS — interaction and layout safety layer */
(function(){
  'use strict';
  if(window.__ECOMAX_MOBILE_PASS__) return;
  window.__ECOMAX_MOBILE_PASS__=true;

  const css=document.createElement('style');
  css.id='ecomaxMobilePassCss';
  css.textContent=`
  html{overflow-x:hidden;-webkit-text-size-adjust:100%}
  body{overflow-x:hidden;touch-action:pan-y}
  button,a,select,input,textarea{touch-action:manipulation}
  @media(max-width:760px){
    .pro-nav{padding:11px 12px!important;gap:9px!important;min-height:62px}
    .pro-logo{font-size:20px!important;letter-spacing:3px!important;white-space:nowrap}
    .pro-links{display:none!important}
    .pro-actions{margin-left:auto!important;gap:6px!important}
    .pro-actions .pro-admin,.pro-actions .pro-auth{display:none!important}
    .pro-cart{padding:9px 10px!important;font-size:0}.pro-cart:first-letter{font-size:18px}
    .pro-menu{display:inline-flex!important;align-items:center;justify-content:center;font-size:18px;min-width:42px;min-height:42px}
    .pro-hero{grid-template-columns:1fr!important;min-height:auto!important;padding:52px 14px 38px!important;text-align:center}
    .hero-copy{max-width:100%!important}.hero-copy h1{font-size:clamp(34px,11vw,52px)!important;line-height:1.02!important}
    .hero-copy p{font-size:14px!important;line-height:1.6!important}
    .hero-actions{justify-content:center!important;flex-wrap:wrap!important}.hero-btn{min-height:46px!important;padding:12px 16px!important}
    .hero-art{min-height:310px!important;margin-top:20px;transform:scale(.9)}
    .products-grid,.magic-grid,.product-grid{grid-template-columns:1fr!important}
    .pro-product-card{min-width:0!important}
    .volume-select,.add-cart{min-height:44px!important}
    .cart-overlay{padding:10px!important;align-items:flex-end!important}
    .cart-panel{width:100%!important;max-height:90vh!important;border-radius:22px 22px 0 0!important}
    .cart-item{grid-template-columns:1fr auto!important;gap:8px!important}
    .cart-item .remove-item{min-width:42px;min-height:42px}
    #mobileNav{z-index:4000!important}
  }
  @media(max-width:390px){
    .pro-nav{padding-left:9px!important;padding-right:9px!important}.pro-logo{font-size:18px!important}
    .pro-hero{padding-left:10px!important;padding-right:10px!important}.hero-art{transform:scale(.78);margin-left:-25px;margin-right:-25px}
    .hero-actions>*{width:100%!important}.panel{border-radius:16px!important}
  }
  `;
  document.head.appendChild(css);

  function bindMenu(){
    const menu=document.querySelector('.pro-menu');
    const nav=document.getElementById('mobileNav');
    if(!menu||!nav)return;
    if(menu.dataset.mobileBound)return;
    menu.dataset.mobileBound='1';
    menu.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();nav.classList.toggle('active');nav.style.zIndex='4000';});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))nav.classList.remove('active');});
  }
  function bindCartClose(){
    document.addEventListener('click',function(e){
      const overlay=document.getElementById('cartOverlay');
      if(!overlay||!overlay.classList.contains('active'))return;
      if(e.target===overlay&&typeof window.closeCart==='function')window.closeCart();
    });
  }
  function init(){bindMenu();bindCartClose();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
