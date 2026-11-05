/* ECOMAX NOCTURNE V21: larger hero image + layered 4D-style neon depth.
   Presentation only; products, cart, auth and order logic unchanged. */
(() => {
  'use strict';
  function init() {
    const body=document.body;
    const hero=document.querySelector('.hero');
    const visual=hero?.querySelector('.hero-visual');
    const stage=visual?.querySelector('.neon-hero-stage');
    if(!body || !hero || !visual || !stage)return false;
    if(body.dataset.ecomaxNocturneV21==='ready')return true;
    if(!body.classList.contains('ecomax-origins-v19'))return false;
    body.dataset.ecomaxNocturneV21='ready';

    if(!visual.querySelector('.v21-hero-depth')){
      const depth=document.createElement('div');
      depth.className='v21-hero-depth';
      depth.setAttribute('aria-hidden','true');
      depth.innerHTML=[
        '<i class="ring r1"></i>',
        '<i class="ring r2"></i>',
        '<i class="ring r3"></i>',
        '<i class="line l1"></i>',
        '<i class="line l2"></i>',
        '<i class="glow"></i>'
      ].join('');
      visual.appendChild(depth);
    }
    const h1=hero.querySelector('h1');
    if(h1)h1.innerHTML='სიზუსტე ყოველ დეტალში.<span>შედეგი სხვა განზომილებაში.</span>';
    const eyebrow=hero.querySelector('.eyebrow');
    if(eyebrow)eyebrow.textContent='ECOMAX • NOCTURNE AUTO CARE';
    const description=hero.querySelector('.hero-description');
    if(description)description.textContent='პროფესიონალური ავტოქიმია, თანამედროვე მოვლის პროდუქტები და დეტეილინგის აქსესუარები — ერთ სივრცეში.';
    return true;
  }
  function boot(tries=0){
    if(init())return;
    if(tries<120)requestAnimationFrame(()=>boot(tries+1));
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  }else boot();
})();
