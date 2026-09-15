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
  `;
  document.head.appendChild(css);

  function findType(card){
    const text=(card.textContent||'').toLowerCase();
    const foam=text.includes('ქაფ')||text.includes('foam');
    if(foam){
      // White foam variant stays white when the product title/variant says white.
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
