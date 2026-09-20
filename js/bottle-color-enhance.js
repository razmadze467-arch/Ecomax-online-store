// ECOMAX — premium bottle identity system: product-specific bottles, labels and vector art
(function(){
  'use strict';
  if(window.__ECOMAX_BOTTLE_COLORS__) return;
  window.__ECOMAX_BOTTLE_COLORS__=true;

  const TYPES=[
    {keys:['ძრავის','engine'],color:'#ff334d',name:'ძრავის სარეცხი',en:'ENGINE WASH',code:'01',art:'engine',shape:'tall'},
    {keys:['დისკების','დისკები','wheel'],color:'#d9f7ff',name:'დისკების სარეცხი',en:'WHEEL CLEANER',code:'02',art:'wheel',shape:'wide'},
    {keys:['რადიატორის','radiator'],color:'#ffb52e',name:'რადიატორის სარეცხი',en:'RADIATOR CLEANER',code:'03',art:'radiator',shape:'tall'},
    {keys:['ნაჭრის','fabric'],color:'#31d8ff',name:'ნაჭრის ქიმწმენდა',en:'FABRIC DRY CLEANING',code:'04',art:'fabric',shape:'soft'},
    {keys:['ტყავის ქიმ','leather cleaner'],color:'#ffd83d',name:'ტყავის ქიმწმენდა',en:'LEATHER CLEANING',code:'05',art:'leather',shape:'soft'},
    {keys:['საბურ','tire','tyre'],color:'#ff334d',name:'საბურავის საპრიალებელი',en:'TIRE POLISH',code:'06',art:'tire',shape:'tall'},
    {keys:['ტორპედოს','dashboard'],color:'#d9f7ff',name:'ტორპედოს საპრიალებელი',en:'DASHBOARD POLISH',code:'07',art:'dashboard',shape:'wide'},
    {keys:['ტყავის მკვებ','კონდიციონერი','conditioner'],color:'#ff63c4',name:'ტყავის მკვებავი',en:'LEATHER CONDITIONER',code:'08',art:'conditioner',shape:'soft'},
    {keys:['პლასტმას','plastic'],color:'#ff334d',name:'პლასტმასების საშავებელი',en:'PLASTIC BLACKENER',code:'09',art:'plastic',shape:'wide'},
    {keys:['ქაფი','foam'],color:'#8b6cff',name:'ქაფი',en:'CAR WASH FOAM',code:'10',art:'foam',shape:'wide'},
    {keys:['სანთ','candle'],color:'#b87cff',name:'სანთელი',en:'CANDLE',code:'11',art:'candle',shape:'soft'},
    {keys:['პარფ','perfume'],color:'#ff63c4',name:'პარფიუმი',en:'PERFUME',code:'12',art:'perfume',shape:'soft'},
    {keys:['ფოსფორ','phosphor'],color:'#54ff9c',name:'ფოსფორი',en:'PHOSPHOR',code:'13',art:'phosphor',shape:'tall'},
    {keys:['ჟანგ','rust'],color:'#ff6b3d',name:'ჟანგის მოსაშორებელი',en:'RUST REMOVER',code:'14',art:'rust',shape:'tall'},
    {keys:['ცემენტ','ტარის','tar','cement'],color:'#b87cff',name:'ცემენტ / ტარის მოსაშორებელი',en:'CEMENT / TAR REMOVER',code:'15',art:'tar',shape:'wide'}
  ];

  const art={
    engine:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="6"/><path d="M32 6v12M32 46v12M6 32h12M46 32h12M14 14l8 8M42 42l8 8M50 14l-8 8M22 42l-8 8"/></svg>',
    wheel:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="8"/><path d="M32 9v15M32 40v15M9 32h15M40 32h15"/></svg>',
    radiator:'<svg viewBox="0 0 64 64"><rect x="12" y="12" width="40" height="40" rx="4"/><path d="M20 16v32M28 16v32M36 16v32M44 16v32"/></svg>',
    fabric:'<svg viewBox="0 0 64 64"><path d="M12 36h40v11H12zM16 23h13v13H16zM35 23h13v13H35zM18 47l-3 9M46 47l3 9"/></svg>',
    leather:'<svg viewBox="0 0 64 64"><path d="M18 53V24l10-10h11l8 9v17l5 13M18 39h29M28 14v16"/></svg>',
    tire:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="9"/><path d="M18 18l9 9M46 18l-9 9M18 46l9-9M46 46l-9-9"/></svg>',
    dashboard:'<svg viewBox="0 0 64 64"><path d="M11 41a21 21 0 0 1 42 0"/><path d="M32 41l11-13M20 46h24"/></svg>',
    conditioner:'<svg viewBox="0 0 64 64"><path d="M32 8C22 21 15 28 15 39a17 17 0 0 0 34 0C49 28 42 21 32 8z"/><path d="M24 39c4 4 8 4 13 1"/></svg>',
    foam:'<svg viewBox="0 0 64 64"><circle cx="21" cy="41" r="10"/><circle cx="36" cy="27" r="13"/><circle cx="48" cy="42" r="8"/></svg>',
    candle:'<svg viewBox="0 0 64 64"><rect x="22" y="28" width="20" height="25" rx="3"/><path d="M32 28V20M32 8c-6 8 3 10 0 13-4-3-7-1-7 3"/></svg>',
    perfume:'<svg viewBox="0 0 64 64"><rect x="18" y="25" width="28" height="28" rx="5"/><rect x="25" y="16" width="14" height="9" rx="2"/><path d="M29 12h9"/></svg>',
    phosphor:'<svg viewBox="0 0 64 64"><path d="M32 7l4 17 16 8-16 8-4 17-4-17-16-8 16-8z"/></svg>',
    rust:'<svg viewBox="0 0 64 64"><path d="M30 7L15 34h14l-4 23 24-31H36l7-19z"/></svg>',
    tar:'<svg viewBox="0 0 64 64"><path d="M32 8c-8 11-15 18-15 28a15 15 0 0 0 30 0c0-10-7-17-15-28z"/><path d="M13 55h38"/></svg>',
    plastic:'<svg viewBox="0 0 64 64"><path d="M20 18h24l4 35H16z"/><path d="M24 18v-7h16v7M21 27h22"/></svg>'
  };

  const css=document.createElement('style');
  css.id='ecomaxBottlePremiumCss';
  css.textContent=`
    .product-card{--mx-accent:var(--accent,#00eaff);--mx-glow:var(--accent-glow,rgba(0,234,255,.22))}
    .product-card .product-visual{perspective:900px}
    .product-card .product-bottle{
      width:138px!important;height:220px!important;
      border-radius:20px 20px 30px 30px!important;
      background:
        linear-gradient(105deg,rgba(255,255,255,.22) 0 5%,transparent 12% 32%,rgba(255,255,255,.10) 43%,transparent 58%),
        var(--bottle)!important;
      border:1px solid rgba(255,255,255,.38)!important;
      transform:perspective(700px) rotateY(-7deg) rotateX(1deg)!important;
      box-shadow:
        inset 14px 0 18px rgba(255,255,255,.12),
        inset -17px 0 23px rgba(0,0,0,.62),
        0 22px 34px rgba(0,0,0,.48),
        0 0 34px var(--mx-glow)!important;
    }
    .product-card .product-bottle::before{
      width:62px!important;height:21px!important;top:-15px!important;
      background:linear-gradient(#263f4c,#071019)!important;
      border:1px solid rgba(0,246,255,.38)!important;
      box-shadow:0 -3px 12px var(--mx-glow)!important;
    }
    .product-card .product-bottle::after{
      content:"";position:absolute;left:10px;top:18px;width:8px;height:72%;
      border-radius:99px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.25),transparent);
      filter:blur(2px);pointer-events:none;
    }
    .product-card .product-label{
      left:9px!important;right:9px!important;top:57px!important;height:108px!important;
      border-radius:12px!important;overflow:hidden!important;
      background:
        radial-gradient(circle at 50% 42%,color-mix(in srgb,var(--mx-accent) 16%,transparent),transparent 58%),
        linear-gradient(145deg,rgba(2,10,17,.98),rgba(4,25,38,.94))!important;
      border:1px solid var(--mx-accent)!important;
      box-shadow:0 0 18px var(--mx-glow),inset 0 0 20px rgba(0,246,255,.04)!important;
    }
    .ecomax-premium-label-content{font-family:Arial,sans-serif!important}
    .ecomax-label-brand{font-size:11px!important;letter-spacing:2.5px!important;color:#fff!important;text-shadow:0 0 8px var(--mx-accent)!important}
    .ecomax-label-icon{font-size:20px!important;line-height:1!important;margin:5px 0!important;color:var(--mx-accent)!important;filter:drop-shadow(0 0 7px var(--mx-accent))}
    .ecomax-label-product{font-size:8px!important;line-height:1.25!important;font-weight:900!important;color:#fff!important;text-shadow:0 0 5px var(--mx-accent)}
    .ecomax-label-line{height:1px!important;width:70%!important;background:var(--mx-accent)!important;box-shadow:0 0 8px var(--mx-accent)!important}
    .ecomax-product-art{opacity:.13!important;width:48px!important;height:48px!important;filter:drop-shadow(0 0 6px var(--mx-accent))!important}
    .ecomax-bottle-art{width:27px!important;height:27px!important;bottom:8px!important;opacity:.75!important;filter:drop-shadow(0 0 7px var(--mx-accent))!important}
    .ecomax-bottle-art svg *,.ecomax-product-art svg *{stroke:var(--mx-accent)!important}
    .ecomax-five-liter{font-family:Arial,sans-serif!important;font-size:8px!important}
    @media(max-width:768px){
      .product-card .product-bottle{width:124px!important;height:204px!important}
      .product-card .product-label{top:53px!important;height:101px!important}
    }
  `;
  document.head.appendChild(css);

  function findType(card){
    const text=(card.textContent||'').toLowerCase();
    if(text.includes('ქაფ')||text.includes('foam')) return TYPES[9];
    return TYPES.find(t=>t.keys.some(k=>text.includes(k.toLowerCase())))||TYPES[0];
  }

  function apply(){
    document.querySelectorAll('#productsGrid .product-card').forEach(card=>{
      const t=findType(card);
      card.style.setProperty('--mx-accent',t.color);
      card.style.setProperty('--mx-glow',t.color+'55');

      const bottle=card.querySelector('.product-bottle');
      const label=card.querySelector('.product-label');
      if(!bottle||!label)return;

      bottle.setAttribute('aria-label','ECOMAX — '+t.name+' / '+t.en);
      bottle.title='ECOMAX — '+t.name+' / '+t.en;

      let artNode=bottle.querySelector('.ecomax-bottle-art');
      if(!artNode){artNode=document.createElement('div');artNode.className='ecomax-bottle-art';bottle.appendChild(artNode)}
      artNode.innerHTML=art[t.art];

      let content=label.querySelector('.ecomax-premium-label-content');
      if(!content){content=document.createElement('div');content.className='ecomax-premium-label-content';content.style.cssText='position:absolute;inset:8px 8px 25px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:3;pointer-events:none';label.appendChild(content)}
      content.innerHTML='<div class="ecomax-label-brand">ECOMAX</div><div class="ecomax-label-icon">'+art[t.art]+'</div><div class="ecomax-label-product">'+t.name+'</div><div class="ecomax-label-line"></div>';

      let watermark=label.querySelector('.ecomax-product-art');
      if(!watermark){watermark=document.createElement('div');watermark.className='ecomax-product-art';label.appendChild(watermark)}
      watermark.innerHTML=art[t.art];

      let size=label.querySelector('.ecomax-five-liter');
      if(!size){size=document.createElement('div');size.className='ecomax-five-liter';label.appendChild(size)}
      size.textContent='5 L';
      size.style.cssText='position:absolute;right:7px;bottom:7px;padding:3px 6px;border-radius:99px;background:'+t.color+';color:#041018;font-weight:900;letter-spacing:1px;z-index:5;box-shadow:0 0 10px '+t.color+'77';
    });
  }

  function init(){apply();setTimeout(apply,250);setTimeout(apply,800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  const root=document.getElementById('productsGrid');
  if(root&&window.MutationObserver){
    let timer=0;
    new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,150)}).observe(root,{childList:true});
  }
})();