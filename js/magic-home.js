// ECOMAX — Magic Home
// Visual-only enhancement layer. No floating cart. No repeating cart timer.
(function(){
  'use strict';
  if(window.__ECOMAX_MAGIC_HOME_CLEAN__) return;
  window.__ECOMAX_MAGIC_HOME_CLEAN__=true;

  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function inject(){
    if(!document.head||document.getElementById('ecomaxMagicHomeCss')) return;
    const style=document.createElement('style');
    style.id='ecomaxMagicHomeCss';
    style.textContent=`
      :root{--mx-a:#00f6ff;--mx-b:#8b5cff;--mx-c:#ff3bd4}
      body.ecomax-magic-home{position:relative;isolation:isolate}
      body.ecomax-magic-home::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;background:radial-gradient(circle at 15% 20%,rgba(0,246,255,.08),transparent 30%),radial-gradient(circle at 85% 30%,rgba(139,92,255,.09),transparent 32%),radial-gradient(circle at 50% 90%,rgba(255,59,212,.06),transparent 35%)}
      body.ecomax-magic-home::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;opacity:.10;background-image:linear-gradient(rgba(0,246,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(0,246,255,.12) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,black,transparent 85%)}
      .ecomax-magic-title{background:linear-gradient(90deg,var(--mx-a),#fff,var(--mx-b),var(--mx-c));background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ecomaxMagicGradient 10s linear infinite}
      .ecomax-magic-card{position:relative;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,opacity .4s ease}
      .ecomax-magic-card::before{content:"";position:absolute;inset:-1px;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.16) 48%,transparent 65%);transform:translateX(-120%);pointer-events:none}
      .ecomax-magic-card:hover{transform:translateY(-3px);box-shadow:0 0 22px rgba(0,246,255,.12),0 14px 35px rgba(0,0,0,.22)}
      .ecomax-magic-card:hover::before{transform:translateX(120%);transition:transform .55s ease}
      .ecomax-magic-button{position:relative;overflow:hidden}
      .ecomax-magic-button::after{content:"";position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transform:translateX(-180%) skewX(-18deg);pointer-events:none}
      .ecomax-magic-button:hover::after{transform:translateX(380%) skewX(-18deg);transition:transform .5s ease}
      .ecomax-scroll-progress{position:fixed;top:0;left:0;width:0;height:3px;z-index:10000;background:linear-gradient(90deg,var(--mx-a),var(--mx-b),var(--mx-c));box-shadow:0 0 10px rgba(0,246,255,.45);pointer-events:none}
      .ecomax-reveal{opacity:0;transform:translateY(14px);transition:opacity .45s ease,transform .45s ease}
      .ecomax-reveal.ecomax-visible{opacity:1;transform:none}
      .pro-links a.ecomax-active{color:var(--mx-a)!important;background:rgba(0,246,255,.06);box-shadow:inset 0 -2px 0 rgba(0,246,255,.55)}
      .ecomax-top{position:fixed;right:18px;bottom:18px;z-index:4800;width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,246,255,.28);background:rgba(3,14,25,.88);color:var(--mx-a);display:none;place-items:center;cursor:pointer;box-shadow:0 0 18px rgba(0,246,255,.08)}
      .ecomax-top.show{display:grid}
      @keyframes ecomaxMagicGradient{to{background-position:220% center}}
      @media(max-width:760px){body.ecomax-magic-home::after{background-size:34px 34px;opacity:.07}.ecomax-magic-card:hover{transform:none}.ecomax-top{right:12px;bottom:78px}}
      @media(prefers-reduced-motion:reduce){.ecomax-magic-title{animation:none}.ecomax-magic-card,.ecomax-magic-button::after,.ecomax-reveal{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function mark(){
    document.body.classList.add('ecomax-magic-home');
    document.querySelectorAll('.hero h1,.hero-title,.hero h2,[data-hero-title]').forEach(el=>el.classList.add('ecomax-magic-title'));
    document.querySelectorAll('.product-card,.product-item,.product,.pro-card,.pro-product-card').forEach(el=>el.classList.add('ecomax-magic-card'));
    document.querySelectorAll('.hero a,.hero button,.add-cart,.buy-btn,.checkout-btn').forEach(el=>el.classList.add('ecomax-magic-button'));
    document.querySelectorAll('.section-wrap,.info-panel,.contact-card,.safety-item,.guide').forEach(el=>el.classList.add('ecomax-reveal'));
  }

  function progress(){
    if(document.querySelector('.ecomax-scroll-progress')) return;
    const bar=document.createElement('div');
    bar.className='ecomax-scroll-progress';
    document.body.appendChild(bar);
    const update=()=>{
      const h=document.documentElement.scrollHeight-innerHeight;
      bar.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';
    };
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  }

  function reveal(){
    const items=[...document.querySelectorAll('.ecomax-reveal')];
    if(!items.length) return;
    if(!('IntersectionObserver' in window)){
      items.forEach(x=>x.classList.add('ecomax-visible'));
      return;
    }
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('ecomax-visible');
        io.unobserve(e.target);
      }
    }),{threshold:.08,rootMargin:'0px 0px -35px'});
    items.forEach(x=>io.observe(x));
  }

  function activeNav(){
    const links=[...document.querySelectorAll('.pro-links a[href^="#"]')];
    const sections=links.map(a=>({a,s:document.querySelector(a.getAttribute('href'))})).filter(x=>x.s);
    if(!sections.length) return;
    const update=()=>{
      let current=sections[0];
      for(const x of sections){if(x.s.getBoundingClientRect().top<=130) current=x;}
      sections.forEach(x=>x.a.classList.toggle('ecomax-active',x===current));
    };
    addEventListener('scroll',update,{passive:true});
    update();
  }

  function topButton(){
    if(document.querySelector('.ecomax-top')) return;
    const b=document.createElement('button');
    b.className='ecomax-top';
    b.type='button';
    b.setAttribute('aria-label','ზემოთ დაბრუნება');
    b.textContent='↑';
    document.body.appendChild(b);
    b.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
    const update=()=>b.classList.toggle('show',scrollY>650);
    addEventListener('scroll',update,{passive:true});
    update();
  }

  function start(){
    inject();
    mark();
    progress();
    reveal();
    activeNav();
    topButton();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
