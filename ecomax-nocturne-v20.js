/* ECOMAX NOCTURNE V20 — subtle spatial accents.
   All visual only. No products, inventory, auth or checkout changes. */
(() => {
 'use strict';
 function apply(){
  const body=document.body;
  const hero=document.querySelector('.hero');
  if(!body || !hero || body.dataset.ecomaxNocturneV20)return false;
  if(!body.classList.contains('ecomax-origins-v19'))return false;

  body.dataset.ecomaxNocturneV20='ready';
  const heroCopy=hero.querySelector('.hero-copy');
  const visual=hero.querySelector('.hero-visual');
  const stage=visual?.querySelector('.neon-hero-stage');
  if(heroCopy && !heroCopy.querySelector('.n20-hero-graphic')){
   const graphic=document.createElement('span');
   graphic.className='n20-hero-graphic';
   graphic.setAttribute('aria-hidden','true');
   heroCopy.prepend(graphic);
  }
  if(stage && !visual.querySelector('.n20-hero-atmosphere')){
   const layer=document.createElement('div');
   layer.className='n20-hero-atmosphere';
   layer.setAttribute('aria-hidden','true');
   for(const cls of ['n20-arc a','n20-arc b','n20-trace','n20-haze']){
     const el=document.createElement('i');
     el.className=cls;
     layer.appendChild(el);
   }
   visual.appendChild(layer);
  }
  // No spinning wheels or fake foam silhouettes. Preserve the photographed car.
  stage?.querySelectorAll('.hero-wheel-control,.hero-photo-motion,.ecomax-v11-wheel-assembly')
    .forEach(node=>node.remove());

  const productTitle=document.querySelector('#products .section-head h2');
  if(productTitle)productTitle.innerHTML='პროდუქცია <span>ახალი განზომილებით.</span>';
  const categoryTitle=document.querySelector('.neon-category-head h2');
  if(categoryTitle)categoryTitle.textContent='აირჩიე მოვლის მიმართულება';
  const h1=hero.querySelector('h1');
  if(h1)h1.innerHTML='სიზუსტე ყოველ დეტალში.<span>შედეგი სხვა განზომილებაში.</span>';
  const eyebrow=hero.querySelector('.eyebrow');
  if(eyebrow)eyebrow.textContent='ECOMAX • NOCTURNE AUTO CARE';
  const desc=hero.querySelector('.hero-description');
  if(desc)desc.textContent='პროფესიონალური ავტოქიმია, თანამედროვე მოვლის პროდუქტები და დეტეილინგის აქსესუარები — ერთ სივრცეში.';

  if(!document.querySelector('.n20-floating-line')){
   const deco=document.createElement('div');
   deco.className='n20-floating-line';
   deco.setAttribute('aria-hidden','true');
   body.appendChild(deco);
  }
  return true;
 }
 function boot(n=0){
  if(apply())return;
  if(n<120)requestAnimationFrame(()=>boot(n+1));
 }
 if(document.readyState==='loading')
  document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
 else boot();
})();
