// ECOMAX — exact product bottle colors + premium labels + product drawings
(function(){
  'use strict';
  if(window.__ECOMAX_BOTTLE_COLORS__) return;
  window.__ECOMAX_BOTTLE_COLORS__=true;

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],color:'#ff2638',name:'ძრავის სარეცხი',en:'ENGINE WASH',icon:'⚙️',art:'engine'},
    {keys:['დისკების','დისკები','wheel'],color:'#f7f9fb',name:'დისკების სარეცხი',en:'WHEEL CLEANER',icon:'◉',art:'wheel'},
    {keys:['რადიატორის','radiator'],color:'#ff405c',name:'რადიატორის სარეცხი',en:'RADIATOR CLEANER',icon:'▤',art:'radiator'},
    {keys:['ნაჭრის','fabric'],color:'#35cfff',name:'ნაჭრის ქიმწმენდა',en:'FABRIC DRY CLEANING',icon:'✦',art:'fabric'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],color:'#ffd21f',name:'ტყავის ქიმწმენდა',en:'LEATHER DRY CLEANING',icon:'◆',art:'leather'},
    {keys:['საბურ','tire','tyre'],color:'#ff2638',name:'საბურავის საპრიალებელი',en:'TIRE POLISH',icon:'◉',art:'tire'},
    {keys:['ტორპედოს','dashboard','dash'],color:'#f7f9fb',name:'ტორპედოს საპრიალებელი',en:'DASHBOARD POLISH',icon:'▣',art:'dashboard'},
    {keys:['ტყავის მკვებ','კონდიციონერი','leather conditioner','conditioner'],color:'#ff65b8',name:'ტყავის მკვებავი',en:'LEATHER CONDITIONER',icon:'♥',art:'conditioner'},
    {keys:['პლასტმას','plastic'],color:'#ff2638',name:'პლასტმასების საშავებელი',en:'PLASTIC BLACKENER',icon:'◆',art:'plastic'},
    {keys:['ქაფი','foam'],color:'#ff2638',name:'ქაფი',en:'CAR WASH FOAM',icon:'✧',art:'foam'},
    {keys:['სანთ','candle'],color:'#c77cff',name:'სანთელი',en:'CANDLE',icon:'✦',art:'candle'},
    {keys:['პარფ','perfume'],color:'#ff65b8',name:'პარფიუმი',en:'PERFUME',icon:'✿',art:'perfume'},
    {keys:['ფოსფორ','phosphor'],color:'#7cff55',name:'ფოსფორი',en:'PHOSPHOR',icon:'✧',art:'phosphor'},
    {keys:['ჟანგ','rust remover','rust'],color:'#ff2638',name:'ჟანგის მოსაშორებელი',en:'RUST REMOVER',icon:'⚡',art:'rust'},
    {keys:['ცემენტ','ტარის','tar remover','cement'],color:'#c77cff',name:'ცემენტ/ტარის მოსაშორებელი',en:'CEMENT / TAR REMOVER',icon:'⬢',art:'tar'}
  ];

  const css=document.createElement('style');
  css.id='ecomaxBottleColorCss';
  css.textContent=`
    .pro-product-card .ecomax-bottle{position:relative!important;overflow:visible!important}
    .pro-product-card .ecomax-bottle-body{
      background:linear-gradient(90deg,#07111a 0%,color-mix(in srgb,var(--card-accent) 42%,#193545) 22%,#06101a 43%,color-mix(in srgb,var(--card-accent) 52%,#244655) 67%,#050c14 100%)!important;
      box-shadow:inset 8px 0 16px rgba(255,255,255,.08),inset -9px 0 16px rgba(0,0,0,.5),0 0 34px var(--card-accent-soft)!important;
    }
    .pro-product-card .ecomax-bottle-label{
      background:linear-gradient(145deg,rgba(3,13,22,.98),color-mix(in srgb,var(--card-accent) 20%,#0a1c2a))!important;
      overflow:hidden!important;
      border:1px solid color-mix(in srgb,var(--card-accent) 60%,#fff 8%)!important;
    }
    .pro-product-card .ecomax-label-brand{font-weight:1000;letter-spacing:2px;line-height:1;color:#fff;text-shadow:0 0 8px var(--card-accent);font-size:12px}
    .pro-product-card .ecomax-label-icon{font-size:18px;line-height:1;margin:3px 0;color:var(--card-accent);filter:drop-shadow(0 0 5px var(--card-accent))}
    .pro-product-card .ecomax-label-product{font-size:9px;font-weight:900;line-height:1.15;color:#fff;max-width:100%;text-align:center}
    .pro-product-card .ecomax-label-line{height:2px;width:72%;margin:4px auto;background:var(--card-accent);box-shadow:0 0 8px var(--card-accent);border-radius:99px}
    .pro-product-card .ecomax-five-liter{pointer-events:none}
    .pro-product-card .ecomax-product-art{
      position:absolute;left:50%;top:50%;width:42px;height:42px;transform:translate(-50%,-50%);
      opacity:.18;pointer-events:none;z-index:1;filter:drop-shadow(0 0 6px var(--card-accent));
    }
    .pro-product-card .ecomax-bottle-art{
      position:absolute;left:50%;bottom:7px;width:24px;height:24px;transform:translateX(-50%);
      opacity:.55;pointer-events:none;z-index:8;filter:drop-shadow(0 0 5px var(--card-accent));
    }
    .pro-product-card .ecomax-product-art svg,.pro-product-card .ecomax-bottle-art svg{width:100%;height:100%;display:block}
    .pro-product-card .ecomax-product-art path,.pro-product-card .ecomax-product-art circle,.pro-product-card .ecomax-product-art rect,.pro-product-card .ecomax-product-art line,.pro-product-card .ecomax-product-art polyline,.pro-product-card .ecomax-product-art polygon,
    .pro-product-card .ecomax-bottle-art path,.pro-product-card .ecomax-bottle-art circle,.pro-product-card .ecomax-bottle-art rect,.pro-product-card .ecomax-bottle-art line,.pro-product-card .ecomax-bottle-art polyline,.pro-product-card .ecomax-bottle-art polygon{
      stroke:var(--card-accent);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round
    }

    #productsGrid .pro-product-card:nth-child(1)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.10),inset -12px 0 20px rgba(0,0,0,.72),0 0 44px rgba(255,38,56,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(1)::after{border-color:#ff2638!important;color:#ff4b59!important;background:linear-gradient(145deg,#21060b,#4a0d16)!important;text-shadow:0 0 18px rgba(255,38,56,.85)!important}
    #productsGrid .pro-product-card:nth-child(2)::before{background:linear-gradient(90deg,#b9c0c5 0%,#ffffff 20%,#dce3e8 45%,#ffffff 68%,#8f989f 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.38),inset -12px 0 20px rgba(0,0,0,.24),0 0 42px rgba(255,255,255,.22),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(2)::after{border-color:#ffffff!important;color:#ffffff!important;background:linear-gradient(145deg,#12202a,#30414b)!important;text-shadow:0 0 16px rgba(255,255,255,.85)!important}
    #productsGrid .pro-product-card:nth-child(3)::before{background:linear-gradient(90deg,#3b2f02 0%,#d6b927 20%,#75650b 45%,#e4cf45 68%,#221c02 100%)!important}
    #productsGrid .pro-product-card:nth-child(4)::before{background:linear-gradient(90deg,#073244 0%,#31c8ff 20%,#0a536c 45%,#58d7ff 68%,#05202b 100%)!important}
    #productsGrid .pro-product-card:nth-child(5)::before{background:linear-gradient(90deg,#4a3c02 0%,#ffd21f 20%,#a98e0d 45%,#ffe24a 68%,#292203 100%)!important}
    #productsGrid .pro-product-card:nth-child(6)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important}
    #productsGrid .pro-product-card:nth-child(7)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important}
    #productsGrid .pro-product-card:nth-child(8)::before{background:linear-gradient(90deg,#b9c0c5 0%,#ffffff 20%,#dce3e8 45%,#ffffff 68%,#8f989f 100%)!important}
    #productsGrid .pro-product-card:nth-child(9)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important}
    #productsGrid .pro-product-card:nth-child(10)::before{background:linear-gradient(90deg,#43091d 0%,#ff65b8 20%,#8d214f 45%,#ff83c8 68%,#250510 100%)!important}
  `;
  document.head.appendChild(css);

  function svgArt(kind){
    const common='viewBox="0 0 64 64" aria-hidden="true"';
    switch(kind){
      case 'engine': return `<svg ${common}><circle cx="32" cy="32" r="15"/><circle cx="32" cy="32" r="6"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"/></svg>`;
      case 'wheel': return `<svg ${common}><circle cx="32" cy="32" r="21"/><circle cx="32" cy="32" r="8"/><path d="M32 11v13M32 40v13M11 32h13M40 32h13"/></svg>`;
      case 'radiator': return `<svg ${common}><rect x="13" y="14" width="38" height="36" rx="3"/><path d="M20 18v28M27 18v28M34 18v28M41 18v28"/></svg>`;
      case 'fabric': return `<svg ${common}><path d="M12 35h40v10H12zM16 23h13v12H16zM35 23h13v12H35zM16 45l-2 8M48 45l2 8"/></svg>`;
      case 'leather': return `<svg ${common}><path d="M18 51V24l9-9h12l7 8v16l6 12M18 38h28M27 15v15"/></svg>`;
      case 'tire': return `<svg ${common}><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="9"/><path d="M18 18l8 8M46 18l-8 8M18 46l8-8M46 46l-8-8"/></svg>`;
      case 'dashboard': return `<svg ${common}><path d="M12 39a20 20 0 0 1 40 0"/><path d="M32 39l10-11M20 43h24"/></svg>`;
      case 'conditioner': return `<svg ${common}><path d="M32 8C22 21 15 27 15 37a17 17 0 0 0 34 0C49 27 42 21 32 8z"/><path d="M24 39c3 4 7 5 12 2"/></svg>`;
      case 'foam': return `<svg ${common}><circle cx="22" cy="39" r="10"/><circle cx="36" cy="27" r="12"/><circle cx="47" cy="41" r="8"/></svg>`;
      case 'candle': return `<svg ${common}><rect x="22" y="27" width="20" height="25" rx="3"/><path d="M32 27V20M32 8c-6 8 3 10 0 12-4-3-7-1-7 3"/></svg>`;
      case 'perfume': return `<svg ${common}><rect x="18" y="25" width="28" height="27" rx="5"/><rect x="25" y="16" width="14" height="9" rx="2"/><path d="M29 12h9"/></svg>`;
      case 'phosphor': return `<svg ${common}><path d="M32 7l4 17 16 8-16 8-4 17-4-17-16-8 16-8z"/></svg>`;
      case 'rust': return `<svg ${common}><path d="M29 8l-14 25h13l-4 23 25-30H36l7-18z"/></svg>`;
      case 'tar': return `<svg ${common}><path d="M32 8c-8 11-15 17-15 27a15 15 0 0 0 30 0C47 25 40 19 32 8z"/><path d="M13 54h38"/></svg>`;
      case 'plastic': return `<svg ${common}><path d="M20 18h24l4 34H16z"/><path d="M24 18V11h16v7M21 27h22"/></svg>`;
      default: return `<svg ${common}><circle cx="32" cy="32" r="18"/><path d="M32 20v24M20 32h24"/></svg>`;
    }
  }

  function findType(card){
    const text=(card.textContent||'').toLowerCase();
    if(text.includes('ქაფ')||text.includes('foam')) return TYPES.find(t=>t.art==='foam');
    return TYPES.find(t=>t.keys.some(k=>text.includes(k.toLowerCase())));
  }

  function apply(){
    document.querySelectorAll('.pro-product-card').forEach(card=>{
      const type=findType(card); if(!type)return;
      card.style.setProperty('--card-accent',type.color);
      card.style.setProperty('--card-accent-soft',type.color+'55');

      const bottle=card.querySelector('.ecomax-bottle');
      if(bottle){
        bottle.setAttribute('aria-label','ECOMAX 5 ლიტრი — '+type.name+' / '+type.en);
        bottle.title='ECOMAX 5 ლიტრი — '+type.name+' / '+type.en;

        let art=bottle.querySelector('.ecomax-bottle-art');
        if(!art){
          art=document.createElement('div');
          art.className='ecomax-bottle-art';
          bottle.appendChild(art);
        }
        art.innerHTML=svgArt(type.art);
      }

      const label=card.querySelector('.ecomax-bottle-label');
      if(!label)return;

      let content=label.querySelector('.ecomax-premium-label-content');
      if(!content){
        content=document.createElement('div');
        content.className='ecomax-premium-label-content';
        content.style.cssText='position:absolute;inset:7px 8px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:2;pointer-events:none;';
        label.appendChild(content);
      }
      content.innerHTML='<div class="ecomax-label-brand">ECOMAX</div><div class="ecomax-label-icon">'+type.icon+'</div><div class="ecomax-label-product">'+type.name+'</div><div class="ecomax-label-line"></div>';

      let productArt=label.querySelector('.ecomax-product-art');
      if(!productArt){
        productArt=document.createElement('div');
        productArt.className='ecomax-product-art';
        label.appendChild(productArt);
      }
      productArt.innerHTML=svgArt(type.art);

      let size=label.querySelector('.ecomax-five-liter');
      if(!size){
        size=document.createElement('div');
        size.className='ecomax-five-liter';
        label.appendChild(size);
      }
      size.textContent='5 L';
      size.style.cssText='position:absolute;right:7px;bottom:7px;padding:3px 6px;border-radius:99px;background:'+type.color+';color:#071018;font-size:8px;font-weight:1000;letter-spacing:1px;box-shadow:0 0 12px '+type.color+'66;z-index:4;';
    });
  }

  function start(){apply();setTimeout(apply,400);setTimeout(apply,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  const productsRoot=document.getElementById('productsGrid')||document.querySelector('.products-grid');
  if(productsRoot&&'MutationObserver' in window){
    let applyTimer=0;
    const observer=new MutationObserver(function(){
      clearTimeout(applyTimer);
      applyTimer=setTimeout(apply,120);
    });
    observer.observe(productsRoot,{childList:true});
  }
})();