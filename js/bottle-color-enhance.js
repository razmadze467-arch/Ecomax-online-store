// ECOMAX — exact product bottle colors + premium labels
(function(){
  'use strict';
  if(window.__ECOMAX_BOTTLE_COLORS__) return;
  window.__ECOMAX_BOTTLE_COLORS__=true;

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],color:'#ff2638',name:'ძრავის სარეცხი',icon:'⚙️'},
    {keys:['დისკების','დისკები','wheel'],color:'#f7f9fb',name:'დისკების სარეცხი',icon:'◉'},
    {keys:['ნაჭრის','fabric'],color:'#35cfff',name:'ნაჭრის ქიმწმენდა',icon:'✦'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],color:'#ffd21f',name:'ტყავის ქიმწმენდა',icon:'◆'},
    {keys:['საბურ','tire','tyre'],color:'#ff2638',name:'საბურავის საპრიალებელი',icon:'◉'},
    {keys:['ტორპედოს','dashboard','dash'],color:'#f7f9fb',name:'ტორპედოს საპრიალებელი',icon:'▣'},
    {keys:['ტყავის მკვებ','კონდიციონერი','leather conditioner','conditioner'],color:'#ff65b8',name:'ტყავის მკვებავი',icon:'♥'},
    {keys:['პლასტმას','plastic'],color:'#ff2638',name:'პლასმასების საშავებელი',icon:'◆'},
    {keys:['ქაფი','foam'],color:'#ff2638',name:'ქაფი',icon:'✧'}
  ];

  const css=document.createElement('style');
  css.id='ecomaxBottleColorCss';
  css.textContent=`
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

    /* FORCE the visible bottle pseudo-element to use the requested colors.
       The homepage has an inline style block loaded after the external CSS,
       so this style is injected by JS after the page is rendered. */
    #productsGrid .pro-product-card:nth-child(1)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.10),inset -12px 0 20px rgba(0,0,0,.72),0 0 44px rgba(255,38,56,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(1)::after{border-color:#ff2638!important;color:#ff4b59!important;background:linear-gradient(145deg,#21060b,#4a0d16)!important;text-shadow:0 0 18px rgba(255,38,56,.85)!important}
    #productsGrid .pro-product-card:nth-child(2)::before{background:linear-gradient(90deg,#b9c0c5 0%,#ffffff 20%,#dce3e8 45%,#ffffff 68%,#8f989f 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.38),inset -12px 0 20px rgba(0,0,0,.24),0 0 42px rgba(255,255,255,.22),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(2)::after{border-color:#ffffff!important;color:#ffffff!important;background:linear-gradient(145deg,#12202a,#30414b)!important;text-shadow:0 0 16px rgba(255,255,255,.85)!important}
    #productsGrid .pro-product-card:nth-child(3)::before{background:linear-gradient(90deg,#3b2f02 0%,#d6b927 20%,#75650b 45%,#e4cf45 68%,#221c02 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.15),inset -12px 0 20px rgba(0,0,0,.62),0 0 38px rgba(214,185,39,.20),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(4)::before{background:linear-gradient(90deg,#073244 0%,#31c8ff 20%,#0a536c 45%,#58d7ff 68%,#05202b 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.14),inset -12px 0 20px rgba(0,0,0,.60),0 0 42px rgba(49,200,255,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(4)::after{border-color:#31c8ff!important;color:#31c8ff!important}
    #productsGrid .pro-product-card:nth-child(5)::before{background:linear-gradient(90deg,#4a3c02 0%,#ffd21f 20%,#a98e0d 45%,#ffe24a 68%,#292203 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.16),inset -12px 0 20px rgba(0,0,0,.62),0 0 42px rgba(255,210,31,.26),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(5)::after{border-color:#ffd21f!important;color:#ffd21f!important}
    #productsGrid .pro-product-card:nth-child(6)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.10),inset -12px 0 20px rgba(0,0,0,.72),0 0 44px rgba(255,38,56,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(6)::after{border-color:#ff2638!important;color:#ff4b59!important}
    #productsGrid .pro-product-card:nth-child(7)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.10),inset -12px 0 20px rgba(0,0,0,.72),0 0 44px rgba(255,38,56,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(7)::after{border-color:#ff2638!important;color:#ff4b59!important}
    #productsGrid .pro-product-card:nth-child(8)::before{background:linear-gradient(90deg,#b9c0c5 0%,#ffffff 20%,#dce3e8 45%,#ffffff 68%,#8f989f 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.38),inset -12px 0 20px rgba(0,0,0,.24),0 0 42px rgba(255,255,255,.22),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(8)::after{border-color:#ffffff!important;color:#ffffff!important;background:linear-gradient(145deg,#12202a,#30414b)!important;text-shadow:0 0 16px rgba(255,255,255,.85)!important}
    #productsGrid .pro-product-card:nth-child(9)::before{background:linear-gradient(90deg,#21050a 0%,#ff2638 18%,#5b1018 43%,#ff3c4d 66%,#160307 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.10),inset -12px 0 20px rgba(0,0,0,.72),0 0 44px rgba(255,38,56,.30),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(9)::after{border-color:#ff2638!important;color:#ff4b59!important}
    #productsGrid .pro-product-card:nth-child(10)::before{background:linear-gradient(90deg,#43091d 0%,#ff65b8 20%,#8d214f 45%,#ff83c8 68%,#250510 100%)!important;box-shadow:inset 10px 0 20px rgba(255,255,255,.15),inset -12px 0 20px rgba(0,0,0,.62),0 0 42px rgba(255,101,184,.28),0 26px 32px rgba(0,0,0,.45)!important}
    #productsGrid .pro-product-card:nth-child(10)::after{border-color:#ff65b8!important;color:#ff83c8!important}
  `;
  document.head.appendChild(css);

  function findType(card){
    const text=(card.textContent||'').toLowerCase();
    const foam=text.includes('ქაფ')||text.includes('foam');
    if(foam){
      if(text.includes('თეთ')||text.includes('white')){
        return {keys:[],color:'#f7f9fb',name:'ქაფი — თეთრი',icon:'✧'};
      }
      return TYPES.find(t=>t.name==='ქაფი');
    }
    return TYPES.find(t=>t.keys.some(k=>text.includes(k.toLowerCase())));
  }

  function apply(){
    document.querySelectorAll('.pro-product-card').forEach(card=>{
      const type=findType(card);if(!type)return;
      card.style.setProperty('--card-accent',type.color);
      card.style.setProperty('--card-accent-soft',type.color+'55');
      const bottle=card.querySelector('.ecomax-bottle');
      if(bottle){
        bottle.setAttribute('aria-label','ECOMAX 5 ლიტრი — '+type.name);
        bottle.title='ECOMAX 5 ლიტრი — '+type.name;
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
      content.innerHTML=`<div class="ecomax-label-brand">ECOMAX</div><div class="ecomax-label-icon">${type.icon}</div><div class="ecomax-label-product">${type.name}</div><div class="ecomax-label-line"></div>`;

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
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
