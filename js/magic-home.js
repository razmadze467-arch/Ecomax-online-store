// ECOMAX — Magic Home
// Visual-only enhancement layer. Never replaces store/cart/auth logic.
(function(){
  'use strict';
  if (window.__ECOMAX_MAGIC_HOME__) return;
  window.__ECOMAX_MAGIC_HOME__ = true;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function inject(){
    if (!document.head) return;
    const style=document.createElement('style');
    style.id='ecomaxMagicHomeCss';
    style.textContent=`
      :root{--mx-a:#00f6ff;--mx-b:#8b5cff;--mx-c:#ff3bd4}
      body.ecomax-magic-home{position:relative;isolation:isolate}
      body.ecomax-magic-home::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;background:radial-gradient(circle at 15% 20%,rgba(0,246,255,.08),transparent 30%),radial-gradient(circle at 85% 30%,rgba(139,92,255,.09),transparent 32%),radial-gradient(circle at 50% 90%,rgba(255,59,212,.06),transparent 35%)}
      body.ecomax-magic-home::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;opacity:.16;background-image:linear-gradient(rgba(0,246,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(0,246,255,.12) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,black,transparent 85%)}
      .ecomax-magic-orb{position:fixed;width:170px;height:170px;border-radius:50%;pointer-events:none;z-index:-1;opacity:.18;filter:blur(18px);background:radial-gradient(circle,rgba(0,246,255,.65),rgba(139,92,255,.25),transparent 68%);transform:translate(-50%,-50%);transition:opacity .3s}
      .ecomax-magic-title{background:linear-gradient(90deg,var(--mx-a),#fff,var(--mx-b),var(--mx-c));background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ecomaxMagicGradient 7s linear infinite}
      .ecomax-magic-card{position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease,opacity .55s ease}
      .ecomax-magic-card::before{content:"";position:absolute;inset:-1px;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.22) 48%,transparent 65%);transform:translateX(-120%);pointer-events:none}
      .ecomax-magic-card:hover{transform:translateY(-4px);box-shadow:0 0 28px rgba(0,246,255,.16),0 18px 45px rgba(0,0,0,.25)}
      .ecomax-magic-card:hover::before{transform:translateX(120%);transition:transform .7s ease}
      .ecomax-magic-button{position:relative;overflow:hidden}
      .ecomax-magic-button::after{content:"";position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);transform:translateX(-180%) skewX(-18deg);pointer-events:none}
      .ecomax-magic-button:hover::after{transform:translateX(380%) skewX(-18deg);transition:transform .65s ease}

      /* Premium scroll progress */
      .ecomax-scroll-progress{position:fixed;top:0;left:0;width:0;height:3px;z-index:10000;background:linear-gradient(90deg,var(--mx-a),var(--mx-b),var(--mx-c));box-shadow:0 0 14px rgba(0,246,255,.65);pointer-events:none}

      /* Sections/cards enter softly without changing layout */
      .ecomax-reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
      .ecomax-reveal.ecomax-visible{opacity:1;transform:none}

      /* Active section in desktop navigation */
      .pro-links a.ecomax-active{color:var(--mx-a)!important;background:rgba(0,246,255,.07);box-shadow:inset 0 -2px 0 rgba(0,246,255,.65)}

      /* Mobile quick cart */
      .ecomax-mobile-cart{display:none;position:fixed;left:12px;right:12px;bottom:12px;z-index:4900;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid rgba(0,246,255,.35);border-radius:15px;background:rgba(3,14,25,.94);backdrop-filter:blur(16px);box-shadow:0 12px 40px rgba(0,0,0,.48),0 0 28px rgba(0,246,255,.10)}
      .ecomax-mobile-cart.show{display:flex}
      .ecomax-mobile-cart-info{min-width:0}.ecomax-mobile-cart-info small{display:block;color:#718996;font-size:8px;letter-spacing:1.5px}.ecomax-mobile-cart-info strong{display:block;color:#fff;font-size:14px;margin-top:2px}.ecomax-mobile-cart button{border:0;border-radius:10px;padding:11px 14px;background:var(--mx-a);color:#001018;font-weight:1000;white-space:nowrap}

      /* Back to top */
      .ecomax-top{position:fixed;right:18px;bottom:18px;z-index:4800;width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,246,255,.28);background:rgba(3,14,25,.88);color:var(--mx-a);display:none;place-items:center;cursor:pointer;box-shadow:0 0 22px rgba(0,246,255,.10)}
      .ecomax-top.show{display:grid}
      @keyframes ecomaxMagicGradient{to{background-position:220% center}}
      @media(max-width:760px){body.ecomax-magic-home::after{background-size:34px 34px;opacity:.11}.ecomax-magic-orb{width:120px;height:120px;opacity:.12}.ecomax-magic-card:hover{transform:none}.ecomax-top{right:12px;bottom:78px}.ecomax-mobile-cart{bottom:10px}}
      @media(prefers-reduced-motion:reduce){.ecomax-magic-title{animation:none}.ecomax-magic-card,.ecomax-magic-button::after,.ecomax-reveal{transition:none!important}.ecomax-mobile-cart{backdrop-filter:none}}
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

  function orb(){
    if(reduce || document.querySelector('.ecomax-magic-orb')) return;
    const el=document.createElement('div');
    el.className='ecomax-magic-orb';
    document.body.appendChild(el);
    let x=innerWidth*.5,y=innerHeight*.25,tx=x,ty=y;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;},{passive:true});
    function tick(){x+=(tx-x)*.035;y+=(ty-y)*.035;el.style.left=x+'px';el.style.top=y+'px';requestAnimationFrame(tick)}
    tick();
  }

  function progress(){
    if(document.querySelector('.ecomax-scroll-progress'))return;
    const bar=document.createElement('div');bar.className='ecomax-scroll-progress';document.body.appendChild(bar);
    const update=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%'};
    addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  }

  function reveal(){
    const items=[...document.querySelectorAll('.ecomax-reveal')];
    if(!items.length)return;
    if(!('IntersectionObserver' in window)){items.forEach(x=>x.classList.add('ecomax-visible'));return}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ecomax-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -35px'});
    items.forEach(x=>io.observe(x));
  }

  function activeNav(){
    const links=[...document.querySelectorAll('.pro-links a[href^="#"]')];
    const sections=links.map(a=>({a,s:document.querySelector(a.getAttribute('href'))})).filter(x=>x.s);
    if(!sections.length)return;
    const update=()=>{let current=sections[0];for(const x of sections){if(x.s.getBoundingClientRect().top<=130)current=x}sections.forEach(x=>x.a.classList.toggle('ecomax-active',x===current))};
    addEventListener('scroll',update,{passive:true});update();
  }

  function mobileCart(){
    if(document.querySelector('.ecomax-mobile-cart'))return;
    const box=document.createElement('div');box.className='ecomax-mobile-cart';
    box.innerHTML='<div class="ecomax-mobile-cart-info"><small>ECOMAX CART</small><strong id="ecomaxMobileCartText">კალათა ცარიელია</strong></div><button type="button">კალათის ნახვა →</button>';
    document.body.appendChild(box);
    const button=box.querySelector('button');
    button.addEventListener('click',()=>{if(typeof window.openCart==='function')window.openCart();});
    function refresh(){
      let items=[];try{items=JSON.parse(localStorage.getItem('ecomax_cart')||'[]')}catch(e){items=[]}
      const count=Array.isArray(items)?items.reduce((n,x)=>n+Number(x.quantity||1),0):0;
      box.classList.toggle('show',count>0 && innerWidth<=760);
      const text=box.querySelector('#ecomaxMobileCartText');if(text)text.textContent=count?`${count} პროდუქტი • კალათის ნახვა`:'კალათა ცარიელია';
    }
    addEventListener('resize',refresh,{passive:true});setInterval(refresh,800);refresh();
  }

  function topButton(){
    if(document.querySelector('.ecomax-top'))return;
    const b=document.createElement('button');b.className='ecomax-top';b.type='button';b.setAttribute('aria-label','ზემოთ დაბრუნება');b.textContent='↑';
    document.body.appendChild(b);b.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
    const update=()=>b.classList.toggle('show',scrollY>650);addEventListener('scroll',update,{passive:true});update();
  }

  function start(){inject();mark();orb();progress();reveal();activeNav();mobileCart();topButton();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
