/* ECOMAX — hard mobile layout fix
   Uses the real phone viewport/user-agent so later visual layers cannot restore desktop columns. */
(function(){
  'use strict';
  function isPhone(){
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'') || window.innerWidth<=699;
  }
  if(!isPhone()) return;
  var css=''+
  '@media(max-width:1100px){'+
    'html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important}'+
    '.header,.nav,.hero,.section,.footer{width:100%!important;max-width:100%!important}'+
    '.nav{min-width:0!important;padding:8px 12px!important;gap:8px!important}'+
    '.links{display:none!important}'+
    '.menu{display:block!important}'+
    '.actions{margin-left:auto!important;min-width:0!important}'+
    '.auth-link{display:none!important}'+
    '.hero{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:18px!important;min-height:auto!important;padding:34px 14px 30px!important;overflow:hidden!important}'+
    '.hero-copy{width:100%!important;max-width:100%!important;min-width:0!important}'+
    '.hero h1{width:100%!important;max-width:100%!important;font-size:clamp(34px,10.5vw,49px)!important;line-height:1.02!important;letter-spacing:-1.8px!important;overflow-wrap:anywhere!important}'+
    '.hero-copy>p{max-width:100%!important;font-size:12px!important;line-height:1.7!important}'+
    '.hero-visual{width:100%!important;max-width:100%!important;min-width:0!important;height:390px!important;min-height:390px!important;overflow:hidden!important;margin:0!important}'+
    '.hero-bottle{width:155px!important;height:270px!important}'+
    '.hero-label{left:15px!important;right:15px!important;top:76px!important;height:125px!important}'+
    '.hero-visual .halo{width:300px!important;height:300px!important;max-width:78vw!important;max-height:78vw!important}'+
    '.section{padding:45px 14px!important;overflow:hidden!important}'+
    '.section-head{display:block!important;width:100%!important}'+
    '.tools{display:flex!important;flex-direction:column!important;width:100%!important}'+
    '.search,.filter{width:100%!important;min-width:0!important;max-width:100%!important}'+
    '.grid,.products-grid,.product-grid,.products{display:grid!important;grid-template-columns:1fr!important;grid-auto-columns:minmax(0,1fr)!important;width:100%!important;max-width:100%!important;gap:16px!important}'+
    '.grid>.card,.products-grid>.card,.product-grid>.card,.products>.card,.card{width:100%!important;max-width:100%!important;min-width:0!important;min-height:0!important;height:auto!important;transform:none!important}'+
    '.card:hover{transform:translateY(-4px)!important}'+
    '.bottle{height:245px!important}'+
    '.bottle-body{width:125px!important;height:205px!important}'+
    '.info{grid-template-columns:1fr!important}'+
  '}';
  var s=document.createElement('style');
  s.id='ecomaxMobileHardFixCss';
  s.textContent=css;
  (document.head||document.documentElement).appendChild(s);
})();
