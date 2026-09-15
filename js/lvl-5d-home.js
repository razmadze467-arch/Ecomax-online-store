/* ECOMAX — LVL-CHEMICAL 5D home visual layer */
(function(){
  'use strict';
  function init(){
    if(document.body.dataset.lvl5d==='1') return;
    document.body.dataset.lvl5d='1';

    const logo=document.querySelector('.logo');
    if(logo){
      logo.innerHTML='<span class="eco-company">შპს ეკო-მაქსი</span><small>ECOMAX • PROFESSIONAL AUTOMOTIVE CARE</small>';
      logo.classList.add('eco-max-brand');
    }

    const hero=document.querySelector('.hero');
    if(hero){
      hero.classList.add('lvl5d-hero');
      const copy=hero.querySelector('.hero-copy');
      if(copy){
        const eyebrow=copy.querySelector('.eyebrow');
        if(eyebrow) eyebrow.innerHTML='<i class="lvl-pulse"></i> LVL-CHEMICAL • ECOMAX • PREMIUM CARE';
        const h1=copy.querySelector('h1');
        if(h1) h1.innerHTML='სუფთა მანქანა.<br><span>პროფესიონალური მოვლა.</span>';
        const p=copy.querySelector('p');
        if(p) p.textContent='შპს ეკო-მაქსი — პროფესიონალური ავტოქიმია და LVL-CHEMICAL ტექნოლოგია ავტომობილის მოვლისთვის. ხარისხი, სისუფთავე და თანამედროვე ვიზუალური გამოცდილება ერთ სივრცეში.';
      }
      const visual=hero.querySelector('.hero-visual');
      if(visual){
        visual.classList.add('lvl5d-stage');
        visual.innerHTML='<div class="lvl-stars"></div><div class="lvl-orbit orbit-a"></div><div class="lvl-orbit orbit-b"></div><div class="lvl-orbit orbit-c"></div><div class="lvl-core-glow"></div><div class="lvl-logo-3d"><div class="lvl-logo-top">LVL</div><div class="lvl-logo-name">CHEMICAL</div><div class="lvl-logo-line"></div><div class="lvl-logo-sub">PROFESSIONAL AUTOMOTIVE CARE</div></div><div class="lvl-float f1"><b>01</b> ENGINE CARE</div><div class="lvl-float f2"><b>02</b> WHEEL CARE</div><div class="lvl-float f3"><b>03</b> PRO FOAM</div><div class="lvl-scan"></div>';
        for(let i=0;i<55;i++){const s=document.createElement('i');s.className='lvl-star';s.style.setProperty('--x',(Math.random()*100)+'%');s.style.setProperty('--y',(Math.random()*100)+'%');s.style.setProperty('--d',(2+Math.random()*5)+'s');s.style.setProperty('--s',(1+Math.random()*3)+'px');visual.querySelector('.lvl-stars').appendChild(s)}
      }
    }

    document.querySelectorAll('.section').forEach((s,i)=>s.classList.add('lvl-depth-'+(i%3)));
    const onMove=(e)=>{
      const x=(e.clientX/window.innerWidth-.5), y=(e.clientY/window.innerHeight-.5);
      document.documentElement.style.setProperty('--mx',x.toFixed(3));
      document.documentElement.style.setProperty('--my',y.toFixed(3));
    };
    window.addEventListener('pointermove',onMove,{passive:true});

    const cards=document.querySelectorAll('.card');
    cards.forEach((card,i)=>{
      card.style.setProperty('--delay',(i%6)*70+'ms');
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.setProperty('--rx',(y*-5)+'deg'); card.style.setProperty('--ry',(x*6)+'deg');
      });
      card.addEventListener('pointerleave',()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry')});
    });

    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced){
      let last=0;
      function tick(t){
        if(t-last>32){
          document.documentElement.style.setProperty('--time',(t/1000).toFixed(2)); last=t;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
