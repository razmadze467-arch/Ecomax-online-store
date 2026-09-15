// ECOMAX — exact product bottle colors
(function(){
  'use strict';
  if(window.__ECOMAX_BOTTLE_COLORS__) return;
  window.__ECOMAX_BOTTLE_COLORS__=true;

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],color:'#ff2638',name:'ძრავის სარეცხი'},
    {keys:['დისკების','დისკები','wheel'],color:'#f7f9fb',name:'დისკების სარეცხი'},
    {keys:['ნაჭრის','fabric'],color:'#35cfff',name:'ნაჭრის ქიმწმენდა'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],color:'#ffd21f',name:'ტყავის ქიმწმენდა'},
    {keys:['საბურ','tire','tyre'],color:'#ff2638',name:'საბურავის საპრიალებელი'},
    {keys:['ტორპედოს','dashboard','dash'],color:'#f7f9fb',name:'ტორპედოს საპრიალებელი'},
    {keys:['ტყავის მკვებ','კონდიციონერი','leather conditioner','conditioner'],color:'#ff65b8',name:'ტყავის მკვებავი'},
    {keys:['პლასტმას','plastic'],color:'#ff2638',name:'პლასმასების საშავებელი'},
    {keys:['ქაფი','foam'],color:'#ff2638',name:'ქაფი'}
  ];

  function findType(card){
    const text=(card.textContent||'').toLowerCase();
    return TYPES.find(t=>t.keys.some(k=>text.includes(k.toLowerCase())));
  }

  function apply(){
    document.querySelectorAll('.pro-product-card').forEach(card=>{
      const type=findType(card);
      if(!type) return;
      card.style.setProperty('--card-accent',type.color);
      card.style.setProperty('--card-accent-soft',type.color.replace(')',',.18)').replace('rgb','rgba'));
      card.querySelectorAll('.ecomax-bottle-body,.ecomax-bottle-label,.ecomax-bottle-zone,.ecomax-bottle-ground').forEach(el=>{
        el.style.setProperty('--bottle-color',type.color);
      });
      const bottle=card.querySelector('.ecomax-bottle');
      if(bottle){
        bottle.setAttribute('aria-label','ECOMAX 5 ლიტრი — '+type.name);
        bottle.title='ECOMAX 5 ლიტრი — '+type.name;
      }
      const label=card.querySelector('.ecomax-bottle-label');
      if(label && !label.querySelector('.ecomax-five-liter')){
        const size=document.createElement('div');
        size.className='ecomax-five-liter';
        size.textContent='5 L';
        size.style.cssText='position:absolute;right:7px;bottom:7px;padding:3px 6px;border-radius:99px;background:'+type.color+';color:#071018;font-size:8px;font-weight:1000;letter-spacing:1px;box-shadow:0 0 12px '+type.color+'66;';
        label.appendChild(size);
      }
    });
  }

  function start(){apply();setTimeout(apply,400);setTimeout(apply,1200);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
