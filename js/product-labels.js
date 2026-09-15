// ECOMAX — premium futuristic product bottles + exact ECOMAX color palette
// Visual-only layer. Existing product/cart/order behavior is untouched.
(function(){
  'use strict';
  if(window.__ECOMAX_PRODUCT_LABELS__) return;
  window.__ECOMAX_PRODUCT_LABELS__=true;

  const css=document.createElement('style');
  css.id='ecomaxProductLabelsCss';
  css.textContent=`
    .ecomax-product-label{position:relative;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;margin:0 0 14px;padding:12px 14px;border:1px solid var(--label-color,#00eaff);border-radius:14px;background:linear-gradient(135deg,rgba(255,255,255,.07),color-mix(in srgb,var(--label-color,#00eaff) 12%,transparent) 55%,rgba(0,0,0,.18));box-shadow:0 0 24px color-mix(in srgb,var(--label-color,#00eaff) 24%,transparent),inset 0 0 18px rgba(255,255,255,.035);overflow:hidden}
    .ecomax-product-label:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--label-color,#00eaff);box-shadow:0 0 18px var(--label-color,#00eaff)}
    .ecomax-product-label:after{content:"";position:absolute;inset:-80% -20%;background:linear-gradient(100deg,transparent 42%,rgba(255,255,255,.16) 49%,transparent 56%);transform:translateX(-45%) rotate(8deg);animation:ecomaxLabelSweep 5.5s ease-in-out infinite;pointer-events:none}
    .ecomax-label-brand{font-size:12px;font-weight:1000;letter-spacing:2.4px;color:#fff;text-shadow:0 0 11px var(--label-color,#00eaff);white-space:nowrap}
    .ecomax-label-name{font-size:17px;font-weight:1000;letter-spacing:.4px;line-height:1.12;color:var(--label-color,#00eaff);text-align:right;text-shadow:0 0 12px color-mix(in srgb,var(--label-color,#00eaff) 60%,transparent)}
    .ecomax-label-name b{display:block;font-size:15px;letter-spacing:1px;margin-top:4px;color:#fff;text-shadow:0 0 10px var(--label-color,#00eaff)}
    .ecomax-label-sub{display:block;margin-top:3px;font-size:8px;letter-spacing:1.8px;color:rgba(255,255,255,.72)}
    .ecomax-label-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--label-color,#00eaff);box-shadow:0 0 12px var(--label-color,#00eaff);margin-right:7px;vertical-align:middle}

    .ecomax-label-bottle{position:relative;margin:9px auto 18px;width:86px;height:128px;border-radius:12px 12px 18px 18px;border:2px solid color-mix(in srgb,var(--label-color,#00eaff) 86%,white 14%);background:linear-gradient(105deg,color-mix(in srgb,var(--label-color,#00eaff) 96%,white 4%) 0%,var(--label-color,#00eaff) 55%,color-mix(in srgb,var(--label-color,#00eaff) 78%,black 22%) 100%);box-shadow:0 0 34px color-mix(in srgb,var(--label-color,#00eaff) 45%,transparent),inset 10px 0 18px rgba(255,255,255,.22),inset -10px 0 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;overflow:visible;transform:perspective(320px) rotateY(-4deg);transition:transform .3s ease,filter .3s ease}
    .ecomax-label-bottle:hover{transform:perspective(320px) rotateY(4deg) translateY(-3px);filter:brightness(1.08)}
    .ecomax-label-bottle:before{content:"";position:absolute;top:-13px;left:50%;transform:translateX(-50%);width:38px;height:20px;border-radius:5px 5px 2px 2px;border:1px solid #66727d;background:linear-gradient(#394650,#0b1015);box-shadow:0 0 10px color-mix(in srgb,var(--label-color,#00eaff) 45%,transparent)}
    .ecomax-label-bottle:after{content:"";position:absolute;top:10px;left:10px;width:9px;height:82px;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.52),transparent);filter:blur(2px);opacity:.65}
    .ecomax-bottle-panel{position:absolute;left:9px;right:9px;top:34px;bottom:17px;border:1px solid rgba(255,255,255,.34);border-radius:7px;background:linear-gradient(145deg,rgba(2,8,15,.92),rgba(2,8,15,.72));box-shadow:inset 0 0 13px rgba(0,0,0,.5),0 0 10px rgba(0,0,0,.22);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2}
    .ecomax-bottle-logo{font-size:10px;font-weight:1000;letter-spacing:1.8px;color:#fff;text-shadow:0 0 9px var(--label-color,#00eaff)}
    .ecomax-bottle-ka{margin-top:7px;padding:3px 4px;text-align:center;font-size:7px;font-weight:1000;line-height:1.15;color:#fff}
    .ecomax-bottle-en{margin-top:3px;font-size:6px;font-weight:1000;letter-spacing:.8px;color:var(--label-color,#00eaff)}
    .ecomax-bottle-size{margin-top:8px;padding:2px 6px;border-radius:99px;border:1px solid var(--label-color,#00eaff);font-size:6px;font-weight:1000;letter-spacing:1px;color:#fff;box-shadow:0 0 8px color-mix(in srgb,var(--label-color,#00eaff) 32%,transparent)}
    .ecomax-bottle-brand{position:absolute;bottom:4px;font-size:5px;letter-spacing:1px;font-weight:1000;color:var(--label-color,#00eaff)}
    .ecomax-volume-badge{display:inline-flex;align-items:center;justify-content:center;margin-top:6px;padding:4px 8px;border:1px solid color-mix(in srgb,var(--label-color,#00eaff) 75%,white 5%);border-radius:999px;background:rgba(0,0,0,.38);font-size:9px;font-weight:1000;letter-spacing:1px;color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--label-color,#00eaff) 25%,transparent)}
    @keyframes ecomaxLabelSweep{0%,55%{transform:translateX(-55%) rotate(8deg)}78%,100%{transform:translateX(55%) rotate(8deg)}}
    @media(max-width:760px){.ecomax-product-label{padding:10px 10px;gap:9px}.ecomax-label-brand{font-size:9px;letter-spacing:1.7px}.ecomax-label-name{font-size:14px}.ecomax-label-name b{font-size:12px}.ecomax-label-sub{font-size:7px}.ecomax-label-bottle{width:68px;height:102px}.ecomax-label-bottle:before{width:30px;height:16px;top:-11px}.ecomax-bottle-panel{top:27px;left:7px;right:7px;bottom:13px}.ecomax-bottle-logo{font-size:8px}.ecomax-bottle-ka{font-size:6px}.ecomax-bottle-en{font-size:5px}.ecomax-volume-badge{font-size:8px;padding:3px 7px}}
    @media(prefers-reduced-motion:reduce){.ecomax-product-label:after{animation:none}.ecomax-label-bottle{transition:none}}
  `;
  (document.head||document.documentElement).appendChild(css);

  const TYPES=[
    {keys:['ძრავის','engine wash','engine cleaner'],ka:'ძრავის სარეცხი',en:'ENGINE WASH',color:'#ff2638'},
    {keys:['დისკების','დისკები','wheel','wheel cleaner','ალუმინ'],ka:'დისკების სარეცხი',en:'WHEEL CLEANER',color:'#f5f7fa'},
    {keys:['ნაჭრის','fabric cleaner','fabric clean'],ka:'ნაჭრის ქიმწმენდა',en:'FABRIC CLEANER',color:'#28c9ff'},
    {keys:['ტყავის ქიმ','leather cleaner','leather clean'],ka:'ტყავის ქიმწმენდა',en:'LEATHER CLEANER',color:'#ffd21f'},
    {keys:['საბურავის საპრიალ','საბურავის','tire polish','tyre polish'],ka:'საბურავის საპრიალებელი',en:'TIRE POLISH',color:'#ff2638'},
    {keys:['ტორპედოს','dashboard polish','dashboard','dash'],ka:'ტორპედოს საპრიალებელი',en:'DASHBOARD POLISH',color:'#f5f7fa'},
    {keys:['ტყავის მკვებ','leather nourisher','leather conditioner','conditioner'],ka:'ტყავის მკვებავი',en:'LEATHER NOURISHER',color:'#ff65b8'},
    {keys:['პლასმასების საშავ','პლასტმასების საშავ','პლასტმას','plastic restorer','plastic black'],ka:'პლასმასების საშავებელი',en:'PLASTIC BLACK',color:'#ff2638'},
    {keys:['ქაფი','foam'],ka:'ქაფი',en:'FOAM',color:'#ff2638',priority:true},
    {keys:['წითელი ქაფ','red foam','ქაფი წითელი'],ka:'ქაფი — წითელი',en:'RED FOAM',color:'#ff2638',priority:true},
    {keys:['თეთრი ქაფ','white foam','ქაფი თეთრი'],ka:'ქაფი — თეთრი',en:'WHITE FOAM',color:'#f5f7fa',priority:true},
    {keys:['რადიატორის','radiator'],ka:'რადიატორის სარეცხი',en:'RADIATOR CLEANER',color:'#28c9ff'},
    {keys:['ჟანგ','rust'],ka:'ჟანგის მოსაშორებელი',en:'RUST REMOVER',color:'#ff7a2f'},
    {keys:['ცემენტ','tar','ბიტუმ'],ka:'ცემენტი / ბიტუმი',en:'CEMENT / TAR',color:'#ff9f43'},
    {keys:['სუნამ','perfume','fragrance'],ka:'სუნამო',en:'FRAGRANCE',color:'#ff65b8'}
  ];

  function classify(card){
    const text=(card.textContent||'').toLowerCase();
    const foam=TYPES.filter(t=>t.priority&&t.keys.some(k=>text.includes(k.toLowerCase())));
    if(foam.length)return foam.find(t=>t.en==='RED FOAM'&&t.keys.some(k=>text.includes(k.toLowerCase())))||foam.find(t=>t.en==='WHITE FOAM'&&t.keys.some(k=>text.includes(k.toLowerCase())))||foam[0];
    return TYPES.find(t=>!t.priority&&t.keys.some(k=>text.includes(k.toLowerCase())))||null;
  }

  function apply(){
    document.querySelectorAll('.pro-product-card,.product-card,.product-item,.product,.pro-card').forEach(card=>{
      const type=classify(card); if(!type) return;
      card.style.setProperty('--label-color',type.color);

      let label=card.querySelector('.ecomax-product-label');
      if(!label){label=document.createElement('div');label.className='ecomax-product-label';card.insertBefore(label,card.firstChild);}
      label.innerHTML='<span class="ecomax-label-brand"><i class="ecomax-label-dot"></i>ECOMAX</span><span class="ecomax-label-name">'+type.ka+'<b>'+type.en+'</b><span class="ecomax-label-sub">PROFESSIONAL FORMULA</span></span>';

      let bottle=card.querySelector('.ecomax-label-bottle');
      if(!bottle){
        bottle=document.createElement('div');bottle.className='ecomax-label-bottle';
        const icon=card.querySelector('.pc-icon');
        if(icon&&icon.parentNode)icon.parentNode.insertBefore(bottle,icon);else card.insertBefore(bottle,label.nextSibling);
      }
      bottle.innerHTML='<div class="ecomax-bottle-panel"><div class="ecomax-bottle-logo">ECOMAX</div><div class="ecomax-bottle-ka">'+type.ka+'</div><div class="ecomax-bottle-en">'+type.en+'</div><div class="ecomax-bottle-size">5L</div><div class="ecomax-bottle-brand">CLEAN • PROTECT • DRIVE</div></div>';
    });
  }

  function start(){apply();setTimeout(apply,500);setTimeout(apply,1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
