// ECOMAX — Ultra Premium product cards visual layer
// Visual-only: preserves existing cart, quantity, price and checkout logic.
(function(){
  if(window.__ECOMAX_ULTRA_CARDS__) return;
  window.__ECOMAX_ULTRA_CARDS__=true;

  const style=document.createElement('style');
  style.id='ecomaxUltraCardsCss';
  style.textContent=`
    .pro-product-card{
      --card-accent:#00eaff;--card-accent-soft:rgba(0,234,255,.16);
      position:relative;isolation:isolate;overflow:hidden!important;
      min-height:560px!important;padding:20px!important;
      background:
        radial-gradient(circle at 80% 18%,var(--card-accent-soft),transparent 28%),
        linear-gradient(145deg,rgba(8,25,43,.98),rgba(1,7,15,.99))!important;
      border:1px solid color-mix(in srgb,var(--card-accent) 22%,transparent)!important;
      border-radius:22px!important;
      box-shadow:0 22px 70px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07),0 0 0 1px rgba(255,255,255,.02)!important;
      transition:transform .32s ease,box-shadow .32s ease,border-color .32s ease!important;
    }
    .pro-product-card::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:-1;background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.035) 43%,transparent 58%);transform:translateX(-100%);animation:ecomaxUltraSweep 6s ease-in-out infinite}
    .pro-product-card::after{content:"";position:absolute;inset:auto -80px -100px auto;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,var(--card-accent-soft),transparent 68%);filter:blur(8px);z-index:-1;pointer-events:none}
    .pro-product-card:hover{transform:translateY(-11px) scale(1.012)!important;border-color:color-mix(in srgb,var(--card-accent) 62%,transparent)!important;box-shadow:0 34px 95px rgba(0,0,0,.58),0 0 42px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.1)!important}

    .pro-product-card .pc-top{position:relative;z-index:5;color:#718a99!important}
    .pro-product-card .pc-top b{color:var(--card-accent)!important;text-shadow:0 0 16px var(--card-accent-soft)}

    /* LARGE 5L BOTTLE ZONE */
    .ecomax-bottle-zone{position:relative;height:235px;margin:-2px -2px 4px;display:flex;align-items:center;justify-content:center;perspective:900px;overflow:hidden;border-radius:18px;background:radial-gradient(circle at 50% 58%,var(--card-accent-soft),transparent 45%),linear-gradient(180deg,rgba(255,255,255,.025),transparent)}
    .ecomax-bottle-zone::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;border:1px solid color-mix(in srgb,var(--card-accent) 24%,transparent);box-shadow:0 0 45px var(--card-accent-soft),inset 0 0 35px var(--card-accent-soft);animation:ecomaxOrbit 8s linear infinite}
    .ecomax-bottle{position:relative;width:122px;height:188px;transform:rotateY(-12deg) rotateX(2deg);filter:drop-shadow(18px 22px 18px rgba(0,0,0,.5));animation:ecomaxBottleFloat 4.8s ease-in-out infinite}
    .ecomax-bottle-cap{position:absolute;left:43px;top:3px;width:36px;height:27px;border-radius:7px 7px 4px 4px;background:linear-gradient(90deg,#0a1017,#6e8490 45%,#0b1118);border:1px solid rgba(255,255,255,.18);box-shadow:0 0 12px rgba(255,255,255,.08)}
    .ecomax-bottle-neck{position:absolute;left:45px;top:25px;width:32px;height:22px;background:linear-gradient(90deg,#0b1720,#45606d 45%,#071019);border:1px solid rgba(255,255,255,.12)}
    .ecomax-bottle-body{position:absolute;left:9px;top:40px;width:104px;height:140px;border-radius:15px 15px 21px 21px;background:linear-gradient(90deg,#07111a 0%,#193545 18%,#06101a 43%,#244655 67%,#050c14 100%);border:1px solid rgba(255,255,255,.19);box-shadow:inset 8px 0 16px rgba(255,255,255,.08),inset -9px 0 16px rgba(0,0,0,.5),0 0 28px var(--card-accent-soft)}
    .ecomax-bottle-body::after{content:"";position:absolute;left:9px;top:8px;width:12px;height:112px;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.5),transparent);filter:blur(3px);opacity:.6}
    .ecomax-bottle-label{position:absolute;left:16px;top:68px;width:90px;height:75px;border-radius:8px;padding:7px 5px;text-align:center;background:linear-gradient(145deg,rgba(3,13,22,.98),rgba(10,28,42,.96));border:1px solid color-mix(in srgb,var(--card-accent) 58%,white 8%);box-shadow:0 0 18px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.14);transform:translateZ(4px)}
    .ecomax-bottle-label .brand{font-size:8px;font-weight:1000;letter-spacing:2px;color:#fff}.ecomax-bottle-label .ka{font-size:12px;font-weight:1000;color:#fff;line-height:1.05;margin-top:8px}.ecomax-bottle-label .en{font-size:8px;font-weight:1000;letter-spacing:1.1px;color:var(--card-accent);margin-top:4px}.ecomax-bottle-label .size{display:inline-block;margin-top:7px;padding:3px 7px;border-radius:999px;background:var(--card-accent);color:#001018;font-size:9px;font-weight:1000;box-shadow:0 0 12px var(--card-accent-soft)}
    .ecomax-bottle-ground{position:absolute;bottom:13px;width:150px;height:18px;border-radius:50%;background:var(--card-accent-soft);filter:blur(9px);animation:ecomaxGround 4.8s ease-in-out infinite}
    .ecomax-volume-chip{position:absolute;right:12px;top:12px;z-index:4;padding:7px 10px;border-radius:999px;background:rgba(1,9,16,.82);border:1px solid color-mix(in srgb,var(--card-accent) 45%,transparent);color:var(--card-accent);font-size:9px;font-weight:1000;letter-spacing:1px;box-shadow:0 0 18px var(--card-accent-soft)}
    .ecomax-card-cars{position:absolute!important;left:0;right:0;bottom:6px;height:54px;z-index:40;pointer-events:none;overflow:hidden!important;opacity:1!important;display:block!important;visibility:visible!important}
    .ecomax-card-road{position:absolute;left:5%;right:5%;bottom:12px;height:1px;background:linear-gradient(90deg,transparent,var(--card-accent),transparent);opacity:.5;box-shadow:0 0 8px var(--card-accent)}
    .ecomax-mini-car{position:absolute!important;width:62px;height:25px;filter:drop-shadow(0 0 10px var(--card-accent));will-change:left;z-index:1000!important;display:block!important;visibility:visible!important;opacity:1!important}
    .ecomax-mini-car .body{position:absolute;left:3px;right:3px;bottom:2px;height:12px;border:1px solid var(--card-accent);border-radius:6px 8px 3px 3px;background:linear-gradient(180deg,var(--card-accent-soft),#06121c);box-shadow:0 0 6px var(--card-accent-soft)}
    .ecomax-mini-car .body:before{content:"";position:absolute;left:10px;top:-6px;width:19px;height:7px;border:1px solid var(--card-accent);border-bottom:0;border-radius:7px 7px 0 0;background:rgba(0,234,255,.08)}
    .ecomax-mini-car .wheel{position:absolute;bottom:0;width:5px;height:5px;border:1px solid #d9fbff;border-radius:50%;background:#02080d}.ecomax-mini-car .w1{left:8px}.ecomax-mini-car .w2{right:8px}
    .ecomax-mini-car .light{position:absolute;right:1px;bottom:6px;width:3px;height:3px;border-radius:50%;background:#fff;box-shadow:0 0 6px 2px var(--card-accent)}
    .ecomax-mini-car.one{left:8px;top:4px;animation:ecomaxCardCarForward 4.2s linear infinite!important}
    .ecomax-mini-car.two{left:auto;right:8px;bottom:3px;animation:ecomaxCardCarBackward 4.8s linear infinite!important}
    /* STATIC FALLBACK — always visible even if animation is paused */
    .ecomax-card-cars .one::after{content:"";position:absolute;left:2px;right:2px;bottom:-5px;height:2px;background:var(--card-accent);box-shadow:0 0 8px var(--card-accent);opacity:.7}
    .ecomax-card-cars .two::after{content:"";position:absolute;left:2px;right:2px;bottom:-5px;height:2px;background:var(--card-accent);box-shadow:0 0 8px var(--card-accent);opacity:.7}
    @keyframes ecomaxCardCarForward{0%{left:-70px;opacity:1}8%{opacity:1}92%{opacity:1}100%{left:calc(100% + 8px);opacity:1}}
    @keyframes ecomaxCardCarBackward{0%{left:calc(100% + 8px);opacity:1}8%{opacity:1}92%{opacity:1}100%{left:-70px;opacity:1}}

    .pro-product-card .pc-icon{display:none!important}
    .pro-product-card .pc-code{font-size:10px!important;letter-spacing:2.5px;color:#78909d!important}.pro-product-card .pc-code strong{font-size:18px!important;color:#fff!important}
    .pro-product-card h3{font-size:20px!important;line-height:1.25!important;margin:11px 0 8px!important;font-weight:1000!important}
    .pro-product-card .pc-desc{color:#8ba2ae!important;line-height:1.62!important;min-height:55px}
    .pro-product-card .pc-detail{border-top-color:rgba(255,255,255,.075)!important;padding:9px 0!important}.pro-product-card .pc-detail b{color:#e2eef3!important}
    .pro-product-card .pc-buy{margin-top:10px!important;padding-top:12px!important;border-top-color:rgba(255,255,255,.09)!important}
    .pro-product-card .selected-price{font-size:31px!important;font-weight:1000!important;color:var(--card-accent)!important;text-shadow:0 0 22px var(--card-accent-soft)}
    .pro-product-card .selected-volume{font-weight:900!important;color:#c3d2d9!important}
    .pro-product-card .volume-select{height:46px!important;border-radius:11px!important;border-color:color-mix(in srgb,var(--card-accent) 38%,rgba(255,255,255,.08))!important;background:rgba(1,10,18,.96)!important;color:#ecfbff!important;font-weight:800}
    .pro-product-card .volume-select:focus{border-color:var(--card-accent)!important;box-shadow:0 0 0 3px var(--card-accent-soft),0 0 22px var(--card-accent-soft)!important}
    .pro-product-card .add-cart{height:48px!important;margin-top:10px!important;border-radius:11px!important;border-color:color-mix(in srgb,var(--card-accent) 60%,transparent)!important;background:linear-gradient(100deg,var(--card-accent-soft),rgba(124,60,255,.16))!important;color:#fff!important;font-weight:1000!important;letter-spacing:.3px;box-shadow:0 0 24px var(--card-accent-soft),inset 0 1px 0 rgba(255,255,255,.09);position:relative;overflow:hidden}
    .pro-product-card .add-cart::after{content:"";position:absolute;inset:0;transform:translateX(-130%);background:linear-gradient(100deg,transparent,rgba(255,255,255,.24),transparent);transition:transform .55s ease}.pro-product-card .add-cart:hover::after{transform:translateX(130%)}
    .pro-product-card .add-cart:hover{box-shadow:0 0 34px var(--card-accent-soft)!important}
    .ecomax-card-badge{display:inline-flex;align-items:center;gap:6px;margin:9px 0 0;padding:6px 9px;border:1px solid color-mix(in srgb,var(--card-accent) 28%,transparent);border-radius:999px;background:rgba(255,255,255,.025);color:#91a6b0;font-size:8px;font-weight:1000;letter-spacing:1.35px}.ecomax-card-badge i{width:6px;height:6px;border-radius:50%;background:var(--card-accent);box-shadow:0 0 11px var(--card-accent)}
    @keyframes ecomaxBottleFloat{0%,100%{transform:rotateY(-12deg) translateY(0)}50%{transform:rotateY(-12deg) translateY(-8px)}}
    @keyframes ecomaxGround{0%,100%{transform:scaleX(.86);opacity:.45}50%{transform:scaleX(1.08);opacity:.75}}
    @keyframes ecomaxOrbit{to{transform:rotate(360deg)}}
    @keyframes ecomaxUltraSweep{0%,65%{transform:translateX(-110%)}82%,100%{transform:translateX(120%)}}
    @media(max-width:900px){.pro-product-card{min-height:540px!important}.ecomax-bottle-zone{height:220px}}
    @media(max-width:700px){.pro-product-card{min-height:525px!important;border-radius:18px!important;padding:16px!important}.pro-product-card:hover{transform:none!important}.ecomax-bottle-zone{height:205px}.ecomax-card-cars{height:48px!important;bottom:4px!important}.ecomax-mini-car{width:56px!important;height:22px!important}.ecomax-bottle{transform:scale(.92) rotateY(-10deg)}.pro-product-card .selected-price{font-size:28px!important}.pro-product-card .add-cart,.pro-product-card .volume-select{height:48px!important}}
    @media(prefers-reduced-motion:reduce){.pro-product-card::before,.ecomax-bottle,.ecomax-bottle-ground,.ecomax-bottle-zone::before{animation:none!important}.pro-product-card,.pro-product-card:hover{transition:none!important;transform:none!important}.pro-product-card .add-cart::after{display:none}}
  `;
  (document.head||document.documentElement).appendChild(style);

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],ka:'ძრავის სარეცხი',en:'ENGINE WASH',c:'#ff2638'},
    {keys:['ნაჭრის','fabric','ქიმწმენდა'],ka:'ნაჭრის ქიმწმენდა',en:'FABRIC CLEAN',c:'#31c8ff'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],ka:'ტყავის ქიმწმენდა',en:'LEATHER CLEAN',c:'#ffd21f'},
    {keys:['დისკების','დისკები','wheel','ალუმინ'],ka:'დისკების სარეცხი',en:'WHEEL CLEAN',c:'#f4f8ff'},
    {keys:['რადიატორის','radiator'],ka:'რადიატორის სარეცხი',en:'RADIATOR CLEAN',c:'#ffe02b'},
    {keys:['წყლის სისტემის','water system','გამოსარეცხი'],ka:'წყლის სისტემის გამორეცხვა',en:'SYSTEM FLUSH',c:'#ff2638'},
    {keys:['საბურ','tire','tyre'],ka:'საბურავის მოვლა',en:'TIRE CARE',c:'#ff2638'},
    {keys:['სუნამ','perfume','fragrance'],ka:'სუნამო',en:'FRAGRANCE',c:'#b86cff'},
    {keys:['კონდიციონერი','conditioner'],ka:'ტყავის კონდიციონერი',en:'LEATHER CARE',c:'#ff65b8'},
    {keys:['ტორპედოს','dashboard','dash'],ka:'ტორპედოს საპრიალებელი',en:'DASHBOARD SHINE',c:'#f7fbff'},
    {keys:['პლასტმას','plastic'],ka:'პლასტმასის შავი',en:'PLASTIC BLACK',c:'#00eaff'},
    {keys:['ფოსფორ','phosphor'],ka:'ფოსფორი',en:'PHOSPHOR',c:'#baff3b'},
    {keys:['ჟანგ','rust'],ka:'ჟანგის მოსაშორებელი',en:'RUST REMOVER',c:'#ff7a2f'},
    {keys:['ცემენტ','tar','ბიტუმ'],ka:'ცემენტი / ბიტუმი',en:'TAR & CEMENT',c:'#ff9f43'}
  ];
  function typeFor(card){const t=(card.innerText||'').toLowerCase();return TYPES.find(x=>x.keys.some(k=>t.includes(k)))||{ka:'ECOMAX პროდუქტი',en:'PROFESSIONAL CARE',c:'#00eaff'}}
  function enhance(card){
    if(!card||card.dataset.ecomaxUltra==='1')return;
    card.dataset.ecomaxUltra='1';
    const t=typeFor(card);
    card.style.setProperty('--card-accent',t.c);
    card.style.setProperty('--card-accent-soft',t.c.replace('#','rgba(').replace(/^rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,(_,r,g,b)=>`rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},.16)`));
    // reliable color conversion
    const hex=t.c.replace('#','');
    const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
    card.style.setProperty('--card-accent-soft',`rgba(${r},${g},${b},.16)`);

    const zone=document.createElement('div');zone.className='ecomax-bottle-zone';
    zone.innerHTML=`<span class="ecomax-volume-chip">5 L • PRO</span><div class="ecomax-bottle-ground"></div><div class="ecomax-bottle"><div class="ecomax-bottle-cap"></div><div class="ecomax-bottle-neck"></div><div class="ecomax-bottle-body"></div><div class="ecomax-bottle-label"><div class="brand">ECO-MAX</div><div class="ka">${t.ka}</div><div class="en">${t.en}</div><span class="size">5 L</span></div></div>`;
    const cars=document.createElement('div');
    cars.className='ecomax-card-cars';
    cars.setAttribute('aria-hidden','true');
    cars.innerHTML='<div class="ecomax-card-road"></div><div class="ecomax-mini-car one"><span class="body"></span><i class="wheel w1"></i><i class="wheel w2"></i><b class="light"></b></div><div class="ecomax-mini-car two"><span class="body"></span><i class="wheel w1"></i><i class="wheel w2"></i><b class="light"></b></div>';
    zone.appendChild(cars);
    const top=card.querySelector('.pc-top');
    if(top) top.insertAdjacentElement('afterend',zone); else card.insertAdjacentElement('afterbegin',zone);

    if(!card.querySelector('.ecomax-card-badge')){
      const badge=document.createElement('div');badge.className='ecomax-card-badge';badge.innerHTML='<i></i> LVL-CHEMICAL • PROFESSIONAL FORMULA';
      const buy=card.querySelector('.pc-buy');
      if(buy) buy.parentNode.insertBefore(badge,buy);
    }
  }
  function scan(){document.querySelectorAll('.pro-product-card').forEach(enhance)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  const productsRoot=document.getElementById('productsGrid')||document.querySelector('.products-grid');
  if(productsRoot&&'MutationObserver' in window){
    let scanTimer=0;
    const observer=new MutationObserver(function(){clearTimeout(scanTimer);scanTimer=setTimeout(scan,80);});
    observer.observe(productsRoot,{childList:true});
  }
})();
