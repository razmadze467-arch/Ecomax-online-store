// ECOMAX — realistic 5L product label layer
(function(){
  'use strict';
  if(window.__ECOMAX_REAL_BOTTLE_LABELS__) return;
  window.__ECOMAX_REAL_BOTTLE_LABELS__=true;

  const css=document.createElement('style');
  css.textContent=`
    .pro-product-card .ecomax-bottle-label{position:absolute!important;overflow:hidden!important;backdrop-filter:blur(3px);}
    .pro-product-card .ecomax-bottle-label:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 28%,rgba(255,255,255,.20) 45%,transparent 57%);transform:translateX(-120%);animation:ecomaxLabelGlint 4.8s ease-in-out infinite;pointer-events:none}
    .pro-product-card .ecomax-bottle-label:after{content:"PROFESSIONAL • LVL CHEMICAL";position:absolute;left:5px;right:5px;bottom:4px;font-size:4.5px;letter-spacing:.65px;color:rgba(255,255,255,.62);}
    .pro-product-card .ecomax-bottle-label .brand{position:relative;z-index:2;text-shadow:0 0 8px var(--card-accent)}
    .pro-product-card .ecomax-bottle-label .ka,.pro-product-card .ecomax-bottle-label .en,.pro-product-card .ecomax-bottle-label .size{position:relative;z-index:2}
    .pro-product-card .ecomax-bottle-label .size{border:1px solid rgba(255,255,255,.35);}
    .ecomax-bottle-liquid{position:absolute;left:20px;right:20px;bottom:16px;height:5px;border-radius:99px;background:var(--card-accent);box-shadow:0 0 13px var(--card-accent);opacity:.9;z-index:1}
    .ecomax-bottle-badge{position:absolute;top:4px;right:5px;padding:2px 4px;border-radius:3px;border:1px solid rgba(255,255,255,.22);font-size:4px;font-weight:900;color:#fff;letter-spacing:.5px;z-index:3}
    @keyframes ecomaxLabelGlint{0%,62%{transform:translateX(-120%)}82%,100%{transform:translateX(120%)}}
    @media(prefers-reduced-motion:reduce){.pro-product-card .ecomax-bottle-label:before{animation:none}}
  `;
  document.head.appendChild(css);

  function apply(){
    document.querySelectorAll('.pro-product-card').forEach(card=>{
      const label=card.querySelector('.ecomax-bottle-label');
      if(!label) return;
      const text=(card.textContent||'').toLowerCase();
      // The catalog has two foam variants: red and white.
      if(text.includes('თეთრი') || text.includes('white')) card.style.setProperty('--card-accent','#f7f9fb');
      if(!label.querySelector('.ecomax-bottle-liquid')){
        const liquid=document.createElement('span');
        liquid.className='ecomax-bottle-liquid';
        label.appendChild(liquid);
      }
      if(!label.querySelector('.ecomax-bottle-badge')){
        const badge=document.createElement('span');
        badge.className='ecomax-bottle-badge';
        badge.textContent='5 L';
        label.appendChild(badge);
      }
    });
  }
  function start(){apply();setTimeout(apply,500);setTimeout(apply,1500)}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
