// ECOMAX — Premium product cards visual layer
// Visual-only: does not replace cart, quantity, price, or checkout logic.
(function(){
  if(window.__ECOMAX_PREMIUM_CARDS__) return;
  window.__ECOMAX_PREMIUM_CARDS__=true;

  const cssId='ecomaxPremiumCardsCss';
  const style=document.createElement('style');
  style.id=cssId;
  style.textContent=`
    .pro-product-card{--card-accent:#00eaff;--card-accent-soft:rgba(0,234,255,.16);position:relative;isolation:isolate;background:linear-gradient(145deg,rgba(7,24,40,.97),rgba(2,9,18,.98))!important;border-color:rgba(255,255,255,.08)!important;box-shadow:0 18px 55px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.045)!important;transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease!important}
    .pro-product-card::before{content:"";position:absolute;inset:-1px;z-index:-1;border-radius:19px;padding:1px;background:linear-gradient(135deg,var(--card-accent-soft),transparent 42%,rgba(124,60,255,.12));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
    .pro-product-card::after{content:"";position:absolute;width:170px;height:170px;right:-75px;top:-80px;border-radius:50%;background:radial-gradient(circle,var(--card-accent-soft),transparent 68%);filter:blur(5px);pointer-events:none;z-index:-1}
    .pro-product-card:hover{transform:translateY(-8px) scale(1.008)!important;border-color:color-mix(in srgb,var(--card-accent) 52%,transparent)!important;box-shadow:0 25px 75px rgba(0,0,0,.42),0 0 34px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.06)!important}
    .pro-product-card .pc-top{position:relative;z-index:2;color:#718b9a}
    .pro-product-card .pc-top b{color:var(--card-accent);text-shadow:0 0 12px var(--card-accent-soft)}
    .pro-product-card .pc-icon{position:relative;overflow:hidden;width:58px;height:58px;margin:22px 0 16px;border-radius:16px;border-color:color-mix(in srgb,var(--card-accent) 35%,transparent);background:linear-gradient(145deg,var(--card-accent-soft),rgba(255,255,255,.02));box-shadow:0 0 25px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.08);color:var(--card-accent)}
    .pro-product-card .pc-icon::after{content:"";position:absolute;inset:-60% 35%;transform:rotate(28deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.24),transparent);animation:ecomaxCardSweep 4.8s ease-in-out infinite}
    .pro-product-card h3{font-size:19px!important;letter-spacing:-.2px;margin:12px 0 8px!important}
    .pro-product-card .pc-desc{color:#8198a5!important}
    .pro-product-card .pc-detail{border-top-color:rgba(255,255,255,.07)!important}
    .pro-product-card .pc-detail b{color:#d5e5ec!important}
    .pro-product-card .pc-buy{position:relative;margin-top:15px;padding-top:15px;border-top-color:rgba(255,255,255,.08)!important}
    .pro-product-card .pc-buy>div:first-child{justify-content:space-between;align-items:flex-end;margin-bottom:11px}
    .pro-product-card .pc-buy small{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#688291}
    .pro-product-card .selected-price{font-size:30px!important;font-weight:950;line-height:1;color:var(--card-accent)!important;text-shadow:0 0 18px var(--card-accent-soft)}
    .pro-product-card .selected-volume{font-weight:800;color:#b5c8d2!important}
    .pro-product-card .volume-select{height:44px;padding:0 12px!important;border-color:color-mix(in srgb,var(--card-accent) 25%,rgba(255,255,255,.08))!important;background:rgba(2,12,22,.94)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
    .pro-product-card .volume-select:focus{border-color:var(--card-accent)!important;box-shadow:0 0 0 3px var(--card-accent-soft)!important}
    .pro-product-card .add-cart{height:46px;margin-top:10px!important;border-color:color-mix(in srgb,var(--card-accent) 48%,transparent)!important;background:linear-gradient(100deg,var(--card-accent-soft),rgba(124,60,255,.10))!important;color:#f1fcff!important;box-shadow:0 0 20px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.07);position:relative;overflow:hidden}
    .pro-product-card .add-cart::after{content:"";position:absolute;inset:0;transform:translateX(-120%);background:linear-gradient(100deg,transparent,rgba(255,255,255,.18),transparent);transition:transform .55s ease}
    .pro-product-card .add-cart:hover::after{transform:translateX(120%)}
    .pro-product-card .add-cart:hover{background:linear-gradient(100deg,color-mix(in srgb,var(--card-accent) 22%,transparent),rgba(124,60,255,.15))!important;box-shadow:0 0 30px var(--card-accent-soft)}
    .ecomax-card-badge{display:inline-flex;align-items:center;gap:6px;margin-top:13px;padding:6px 9px;border:1px solid color-mix(in srgb,var(--card-accent) 24%,transparent);border-radius:999px;background:rgba(255,255,255,.025);color:#7e98a6;font-size:8px;font-weight:900;letter-spacing:1.4px}
    .ecomax-card-badge i{width:5px;height:5px;border-radius:50%;background:var(--card-accent);box-shadow:0 0 10px var(--card-accent);flex:0 0 auto}
    @keyframes ecomaxCardSweep{0%,65%{transform:translateX(-120%) rotate(28deg);opacity:0}72%{opacity:1}92%,100%{transform:translateX(170%) rotate(28deg);opacity:0}}
    @media(max-width:700px){.pro-product-card{border-radius:16px!important;padding:18px!important}.pro-product-card:hover{transform:none!important}.pro-product-card .pc-icon{width:52px;height:52px}.pro-product-card .selected-price{font-size:27px!important}.pro-product-card .add-cart,.pro-product-card .volume-select{height:46px}}
    @media(prefers-reduced-motion:reduce){.pro-product-card,.pro-product-card .pc-icon::after{animation:none!important;transition:none!important}.pro-product-card:hover{transform:none!important}.pro-product-card .add-cart::after{display:none}}
  `;
  (document.head||document.documentElement).appendChild(style);

  const colors=[
    ['ძრავის','engine wash','#ff2638'],
    ['ნაჭრის','fabric','#31c8ff'],
    ['ტყავის ქიმ','leather','#ffd21f'],
    ['დისკების','wheel','#f4f8ff'],
    ['რადიატორის','radiator','#ffe02b'],
    ['წყლის სისტემის','system flush','#ff2638'],
    ['საბურ','tire','#ff2638'],
    ['სუნამ','perfume','#b86cff'],
    ['კონდიციონერი','conditioner','#ff65b8'],
    ['ტორპედოს','dashboard','#f7fbff'],
    ['პლასტმას','plastic','#00eaff'],
    ['ფოსფორ','phosphor','#baff3b'],
    ['ჟანგ','rust','#ff7a2f'],
    ['ცემენტ','tar','#ff9f43']
  ];

  function accent(card){
    const text=(card.innerText||'').toLowerCase();
    for(const row of colors){if(text.includes(row[0])||text.includes(row[1]))return row[2]}
    return '#00eaff';
  }
  function enhance(card){
    if(!card||card.dataset.ecomaxPremium==='1')return;
    card.dataset.ecomaxPremium='1';
    const c=accent(card);
    card.style.setProperty('--card-accent',c);
    card.style.setProperty('--card-accent-soft',c.replace(')',', .15)').replace('rgb(','rgba('));
    if(!card.querySelector('.ecomax-card-badge')){
      const badge=document.createElement('div');
      badge.className='ecomax-card-badge';
      badge.innerHTML='<i></i> PROFESSIONAL FORMULA';
      const buy=card.querySelector('.pc-buy');
      if(buy) buy.parentNode.insertBefore(badge,buy);
    }
  }
  function scan(){document.querySelectorAll('.pro-product-card').forEach(enhance)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
