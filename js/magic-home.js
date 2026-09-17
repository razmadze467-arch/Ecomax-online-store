// ECOMAX — lightweight homepage effects
// Restores visual motion without continuous observers or heavy canvas effects.
(function(){
  'use strict';
  if(window.__ECOMAX_MAGIC_HOME_LITE_V2__) return;
  window.__ECOMAX_MAGIC_HOME_LITE_V2__=true;

  function start(){
    if(!document.head)return;
    var style=document.createElement('style');
    style.id='ecomaxMagicHomeLiteV2Css';
    style.textContent=''
      +':root{--mx-a:#00eaff;--mx-b:#7a5cff;--mx-c:#ff3bd4}'
      +'body.ecomax-magic-home::before{display:block!important;content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(circle at 20% 20%,rgba(0,234,255,.07),transparent 28%),radial-gradient(circle at 80% 30%,rgba(122,92,255,.07),transparent 30%);animation:mxGlow 10s ease-in-out infinite alternate}'
      +'@keyframes mxGlow{from{opacity:.55;transform:scale(1)}to{opacity:1;transform:scale(1.04)}}'
      +'.ecomax-reveal{opacity:1!important;transform:none!important;animation:mxReveal .6s ease both}'
      +'@keyframes mxReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'
      +'.ecomax-magic-title{background:linear-gradient(100deg,#fff,var(--mx-a),#fff)!important;background-size:220% auto!important;color:transparent!important;-webkit-background-clip:text!important;background-clip:text!important;animation:mxTitle 7s linear infinite!important}'
      +'@keyframes mxTitle{to{background-position:220% center}}'
      +'.ecomax-magic-card{transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease!important}'
      +'.ecomax-magic-card:hover{transform:translateY(-5px)!important;box-shadow:0 18px 50px rgba(0,234,255,.10)!important;border-color:rgba(0,234,255,.35)!important}'
      +'.ecomax-magic-button{transition:transform .2s ease,box-shadow .2s ease!important}'
      +'.ecomax-magic-button:hover{transform:translateY(-2px)!important;box-shadow:0 12px 35px rgba(0,234,255,.18)!important}'
      +'@media (prefers-reduced-motion:reduce){body.ecomax-magic-home::before,.ecomax-reveal,.ecomax-magic-title{animation:none!important}.ecomax-magic-card,.ecomax-magic-button{transition:none!important}.ecomax-magic-card:hover,.ecomax-magic-button:hover{transform:none!important}}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();