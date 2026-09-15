// ECOMAX — futuristic product labels
// Visual-only layer. Keeps existing product/cart/order behavior intact.
(function(){
  'use strict';
  if(window.__ECOMAX_PRODUCT_LABELS__) return;
  window.__ECOMAX_PRODUCT_LABELS__=true;

  const css=document.createElement('style');
  css.id='ecomaxProductLabelsCss';
  css.textContent=`
    .ecomax-product-label{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 15px;padding:12px 14px;border:1px solid var(--label-color,#00eaff);border-radius:12px;background:linear-gradient(105deg,rgba(255,255,255,.045),color-mix(in srgb,var(--label-color,#00eaff) 13%,transparent));box-shadow:0 0 20px color-mix(in srgb,var(--label-color,#00eaff) 20%,transparent),inset 0 0 18px rgba(255,255,255,.025);overflow:hidden}
    .ecomax-product-label:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--label-color,#00eaff);box-shadow:0 0 17px var(--label-color,#00eaff)}
    .ecomax-product-label:after{content:"";position:absolute;top:-40%;right:-10%;width:45%;height:180%;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--label-color,#00eaff) 22%,transparent),transparent);transform:skewX(-20deg);animation:ecomaxLabelSweep 4.8s ease-in-out infinite;pointer-events:none}
    .ecomax-label-brand{font-size:11px;font-weight:1000;letter-spacing:2.4px;color:#fff;text-shadow:0 0 10px var(--label-color,#00eaff);white-space:nowrap}
    .ecomax-label-name{font-size:13px;font-weight:1000;letter-spacing:.35px;line-height:1.15;color:var(--label-color,#00eaff);text-align:right;white-space:normal;text-shadow:0 0 10px color-mix(in srgb,var(--label-color,#00eaff) 55%,transparent)}
    .ecomax-label-name b{display:block;font-size:14px;letter-spacing:.7px;margin-top:2px;color:#fff;text-shadow:0 0 9px var(--label-color,#00eaff)}
    .ecomax-label-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--label-color,#00eaff);box-shadow:0 0 11px var(--label-color,#00eaff);margin-right:7px;vertical-align:middle}
    .ecomax-label-bottle{position:relative;margin:8px auto 17px;width:78px;height:116px;border-radius:10px 10px 14px 14px;border:1px solid color-mix(in srgb,var(--label-color,#00eaff) 65%,white 5%);background:linear-gradient(145deg,#111a22,#050a10 58%,color-mix(in srgb,var(--label-color,#00eaff) 24%,#020812));box-shadow:0 0 28px color-mix(in srgb,var(--label-color,#00eaff) 20%,transparent),inset 0 0 25px rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;overflow:hidden}
    .ecomax-label-bottle:before{content:"";position:absolute;top:-10px;width:35px;height:17px;border-radius:4px 4px 2px 2px;border:1px solid #46515b;background:linear-gradient(#26313a,#0c1117);box-shadow:0 0 8px color-mix(in srgb,var(--label-color,#00eaff) 35%,transparent)}
    .ecomax-label-bottle span{font-size:8px;font-weight:1000;letter-spacing:1.4px;color:#fff;transform:rotate(-90deg);text-shadow:0 0 8px var(--label-color,#00eaff)}
    .ecomax-label-bottle i{position:absolute;bottom:10px;font-style:normal;font-size:6px;font-weight:900;letter-spacing:1px;color:var(--label-color,#00eaff)}
    @keyframes ecomaxLabelSweep{0%,55%{transform:translateX(-130%) skewX(-20deg)}75%,100%{transform:translateX(230%) skewX(-20deg)}}
    @media(max-width:760px){.ecomax-product-label{padding:10px 11px;gap:8px}.ecomax-label-brand{font-size:9px;letter-spacing:1.8px}.ecomax-label-name{font-size:11px}.ecomax-label-name b{font-size:12px}.ecomax-label-bottle{width:64px;height:96px;margin-bottom:13px}.ecomax-label-bottle:before{width:29px;height:14px}.ecomax-label-bottle span{font-size:7px}}
    @media(prefers-reduced-motion:reduce){.ecomax-product-label:after{animation:none}}
  `;
  (document.head||document.documentElement).appendChild(css);

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],ka:'ძრავის სარეცხი',name:'ENGINE WASH',color:'#ff2638'},
    {keys:['ნაჭრის','fabric','ქიმწმენდა'],ka:'ნაჭრის ქიმწმენდა',name:'FABRIC CLEAN',color:'#31c8ff'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],ka:'ტყავის ქიმწმენდა',name:'LEATHER CLEAN',color:'#ffd21f'},
    {keys:['დისკების','დისკები','wheel','ალუმინ'],ka:'დისკების სარეცხი',name:'WHEEL CLEAN',color:'#f4f8ff'},
    {keys:['რადიატორის','radiator'],ka:'რადიატორის სარეცხი',name:'RADIATOR CLEAN',color:'#ffe02b'},
    {keys:['წყლის სისტემის','water system','გამოსარეცხი'],ka:'წყლის სისტემის გამორეცხვა',name:'SYSTEM FLUSH',color:'#ff2638'},
    {keys:['საბურ','tire','tyre'],ka:'საბურავის მოვლა',name:'TIRE CARE',color:'#ff2638'},
    {keys:['სუნამ','perfume','fragrance'],ka:'სუნამო',name:'FRAGRANCE',color:'#b86cff'},
    {keys:['ტყავის მკვებ','leather conditioner','conditioner'],ka:'ტყავის კონდიციონერი',name:'LEATHER CARE',color:'#ff65b8'},
    {keys:['ტორპედოს','dashboard','dash'],ka:'ტორპედოს საპრიალებელი',name:'DASHBOARD SHINE',color:'#f7fbff'},
    {keys:['პლასტმას','plastic'],ka:'პლასტმასის შავი',name:'PLASTIC BLACK',color:'#00eaff'},
    {keys:['საპრიალებელ','polish'],ka:'საპრიალებელი',name:'POLISH',color:'#8b5cff'},
    {keys:['ფოსფორ','phosphor'],ka:'ფოსფორი',name:'PHOSPHOR',color:'#baff3b'},
    {keys:['ჟანგ','rust'],ka:'ჟანგის მოსაშორებელი',name:'RUST REMOVER',color:'#ff7a2f'},
    {keys:['ცემენტ','tar','ბიტუმ'],ka:'ცემენტი / ბიტუმი',name:'CEMENT / TAR',color:'#ff9f43'}
  ];

  function classify(card){
    const text=(card.textContent||'').toLowerCase();
    return TYPES.find(t=>t.keys.some(k=>text.includes(k.toLowerCase())))||null;
  }

  function apply(){
    document.querySelectorAll('.pro-product-card,.product-card,.product-item,.product,.pro-card').forEach(card=>{
      if(card.querySelector('.ecomax-product-label')) return;
      const type=classify(card); if(!type) return;
      card.style.setProperty('--label-color',type.color);
      const label=document.createElement('div');
      label.className='ecomax-product-label';
      label.innerHTML='<span class="ecomax-label-brand"><i class="ecomax-label-dot"></i>ECO-MAX</span><span class="ecomax-label-name">'+type.ka+'<b>'+type.name+'</b></span>';
      card.insertBefore(label,card.firstChild);
      const bottle=document.createElement('div');
      bottle.className='ecomax-label-bottle';
      bottle.innerHTML='<span>ECO-MAX</span><i>LVL-CHEMICAL</i>';
      const icon=card.querySelector('.pc-icon');
      if(icon && !icon.previousElementSibling?.classList.contains('ecomax-label-bottle')) icon.parentNode.insertBefore(bottle,icon);
    });
  }

  function start(){apply();setTimeout(apply,500);setTimeout(apply,1500);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
