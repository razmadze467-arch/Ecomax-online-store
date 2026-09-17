// ECOMAX — lightweight homepage effects
// Keeps the visual identity but removes continuous scroll observers and animated overlays.
(function(){
  'use strict';
  if(window.__ECOMAX_MAGIC_HOME_LITE__) return;
  window.__ECOMAX_MAGIC_HOME_LITE__=true;

  function start(){
    if(!document.head)return;
    var style=document.createElement('style');
    style.id='ecomaxMagicHomeLiteCss';
    style.textContent=''
      +':root{--mx-a:#00f6ff;--mx-b:#8b5cff;--mx-c:#ff3bd4}'
      +'.ecomax-scroll-progress,.ecomax-top{display:none!important}'
      +'.ecomax-reveal{opacity:1!important;transform:none!important;transition:none!important}'
      +'.ecomax-magic-title{background:none!important;color:inherit!important;animation:none!important}'
      +'.ecomax-magic-card::before,.ecomax-magic-button::after{display:none!important}'
      +'body.ecomax-magic-home::before,body.ecomax-magic-home::after{display:none!important}'
      +'@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
