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
      .ecomax-magic-card{position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}
      .ecomax-magic-card::before{content:"";position:absolute;inset:-1px;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.22) 48%,transparent 65%);transform:translateX(-120%);pointer-events:none}
      .ecomax-magic-card:hover{transform:translateY(-4px);box-shadow:0 0 28px rgba(0,246,255,.16),0 18px 45px rgba(0,0,0,.25)}
      .ecomax-magic-card:hover::before{transform:translateX(120%);transition:transform .7s ease}
      .ecomax-magic-button{position:relative;overflow:hidden}
      .ecomax-magic-button::after{content:"";position:absolute;top:0;bottom:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);transform:translateX(-180%) skewX(-18deg);pointer-events:none}
      .ecomax-magic-button:hover::after{transform:translateX(380%) skewX(-18deg);transition:transform .65s ease}
      @keyframes ecomaxMagicGradient{to{background-position:220% center}}
      @media(max-width:760px){body.ecomax-magic-home::after{background-size:34px 34px;opacity:.11}.ecomax-magic-orb{width:120px;height:120px;opacity:.12}.ecomax-magic-card:hover{transform:none}}
      @media(prefers-reduced-motion:reduce){.ecomax-magic-title{animation:none}.ecomax-magic-card,.ecomax-magic-button::after{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function mark(){
    document.body.classList.add('ecomax-magic-home');
    document.querySelectorAll('.hero h1,.hero-title,.hero h2,[data-hero-title]').forEach(el=>el.classList.add('ecomax-magic-title'));
    document.querySelectorAll('.product-card,.product-item,.product,.pro-card').forEach(el=>el.classList.add('ecomax-magic-card'));
    document.querySelectorAll('.hero a,.hero button,.add-cart,.buy-btn,.checkout-btn').forEach(el=>el.classList.add('ecomax-magic-button'));
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

  function start(){inject();mark();orb();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
