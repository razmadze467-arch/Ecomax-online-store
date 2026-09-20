// ECOMAX — lightweight viewport guard
// Keeps the page inside the viewport without scanning every DOM element.
(function(){
  'use strict';

  function fix(){
    var html=document.documentElement;
    var body=document.body;
    if(!html||!body)return;
    html.style.width='100%';
    html.style.maxWidth='100%';
    body.style.width='100%';
    body.style.maxWidth='100%';
    body.style.margin='0';
    body.style.padding='0';
    body.style.overflowX='hidden';
  }

  function addBottleCatalog(){
    if(document.getElementById('ecomaxBottleCatalog'))return;
    var hero=document.querySelector('.hero');
    if(!hero||!hero.parentNode)return;

    var products=[
      ['01','ENGINE WASH','ძრავის სარეცხი','#ff334d','⚙'],
      ['02','WHEEL CLEANER','დისკების სარეცხი','#d9f7ff','◉'],
      ['03','RADIATOR CLEANER','რადიატორის სარეცხი','#ffb52e','▤'],
      ['04','FABRIC CLEANING','ნაჭრის ქიმწმენდა','#31d8ff','✦'],
      ['05','LEATHER CLEANING','ტყავის ქიმწმენდა','#ffd83d','◆'],
      ['06','TIRE POLISH','საბურავის საპრიალებელი','#ff334d','◉'],
      ['07','DASHBOARD POLISH','ტორპედოს საპრიალებელი','#d9f7ff','▣'],
      ['08','LEATHER CONDITIONER','ტყავის მკვებავი','#ff63c4','♥']
    ];

    var section=document.createElement('section');
    section.id='ecomaxBottleCatalog';
    section.className='section ecomax-bottle-catalog';
    section.innerHTML='<div class="section-head"><div><div class="section-label">ECOMAX // LEVEL CHEMICAL</div><h2>პრემიუმ <span>ბოთლების კოლექცია</span></h2></div><p>თითოეულ ECOMAX პროდუქტს აქვს საკუთარი ვიზუალური იდენტობა, ეტიკეტი და პროფესიონალური დასახელება.</p></div><div class="ecomax-showcase-grid"></div>';

    var style=document.createElement('style');
    style.id='ecomax-bottle-catalog-style';
    style.textContent=`
      .ecomax-bottle-catalog{width:100%;box-sizing:border-box;padding:48px 0!important}
      .ecomax-bottle-catalog .section-head{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(280px,.8fr)!important;gap:28px!important;align-items:end!important;margin-bottom:24px!important}
      .ecomax-bottle-catalog .section-head h2{margin:6px 0 0!important;line-height:1.05!important}
      .ecomax-bottle-catalog .section-head p{margin:0!important;max-width:620px!important;line-height:1.65!important}
      .ecomax-showcase-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;width:100%;box-sizing:border-box}
      .ecomax-showcase-card{position:relative;min-width:0;min-height:350px;padding:15px;border:1px solid color-mix(in srgb,var(--ec) 40%,transparent);border-radius:18px;background:linear-gradient(145deg,rgba(7,25,39,.96),rgba(2,9,16,.98));overflow:hidden;box-shadow:0 0 28px color-mix(in srgb,var(--ec) 12%,transparent),inset 0 0 25px rgba(0,246,255,.025);box-sizing:border-box}
      .ecomax-showcase-card:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,color-mix(in srgb,var(--ec) 10%,transparent) 50%,transparent 70%);pointer-events:none}
      .ecomax-showcase-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--ec);font:900 7px Arial,sans-serif;letter-spacing:1.3px;white-space:nowrap}
      .ecomax-showcase-bottle{position:relative;z-index:2;width:104px;height:176px;margin:28px auto 17px;border-radius:18px 18px 27px 27px;background:linear-gradient(105deg,rgba(255,255,255,.24),transparent 14% 35%,rgba(255,255,255,.1) 48%,transparent 62%),linear-gradient(90deg,#071018,var(--ec) 35%,#102b38 58%,#03080e);border:1px solid rgba(255,255,255,.38);box-shadow:inset 10px 0 13px rgba(255,255,255,.1),inset -12px 0 16px rgba(0,0,0,.65),0 18px 28px rgba(0,0,0,.5),0 0 25px color-mix(in srgb,var(--ec) 24%,transparent);transform:perspective(600px) rotateY(-7deg)}
      .ecomax-showcase-bottle:before{content:"";position:absolute;left:50%;top:-11px;transform:translateX(-50%);width:46px;height:14px;border-radius:5px 5px 2px 2px;background:#07121b;border:1px solid color-mix(in srgb,var(--ec) 55%,#789)}
      .ecomax-showcase-label{position:absolute;left:8px;right:8px;top:50px;height:86px;padding:7px 5px;box-sizing:border-box;border:1px solid var(--ec);border-radius:9px;background:rgba(2,10,17,.95);display:grid;grid-template-rows:auto 25px minmax(22px,auto) auto;align-content:center;justify-items:center;gap:3px;text-align:center;box-shadow:0 0 14px color-mix(in srgb,var(--ec) 28%,transparent);font-family:"Noto Sans Georgian","Noto Sans",Arial,sans-serif;overflow:hidden}
      .ecomax-showcase-label b{font-family:Arial,sans-serif;font-size:8px;line-height:1;letter-spacing:1.8px;color:#fff;text-shadow:0 0 6px var(--ec)}
      .ecomax-showcase-label i{font-style:normal;font-family:Arial,sans-serif;font-size:20px;line-height:1;color:var(--ec);text-shadow:0 0 8px var(--ec)}
      .ecomax-showcase-label span{max-width:100%;font-size:8px;line-height:1.25;color:#fff;font-weight:900;overflow-wrap:anywhere;text-shadow:0 0 5px var(--ec)}
      .ecomax-showcase-name{position:relative;z-index:2;min-height:44px;display:flex;align-items:center;justify-content:center;text-align:center;font:900 13px/1.35 "Noto Sans Georgian","Noto Sans",Arial,sans-serif;color:#fff;text-shadow:0 0 7px color-mix(in srgb,var(--ec) 45%,transparent)}
      .ecomax-showcase-en{position:relative;z-index:2;min-height:28px;margin-top:5px;text-align:center;font:700 7px/1.45 Arial,sans-serif;color:#87a6b5;letter-spacing:1px;overflow-wrap:anywhere}
      @media(max-width:1100px){.ecomax-showcase-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ecomax-bottle-catalog .section-head{grid-template-columns:1fr!important}}
      @media(max-width:650px){
        .ecomax-bottle-catalog{padding:34px 0!important}
        .ecomax-bottle-catalog .section-head{display:block!important;margin-bottom:18px!important}
        .ecomax-bottle-catalog .section-head p{margin-top:12px!important;font-size:13px!important;line-height:1.55!important}
        .ecomax-showcase-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
        .ecomax-showcase-card{min-height:286px;padding:9px;border-radius:14px}
        .ecomax-showcase-top{font-size:5.5px;letter-spacing:.8px}
        .ecomax-showcase-bottle{width:76px;height:132px;margin:23px auto 13px;border-radius:14px 14px 20px 20px}
        .ecomax-showcase-bottle:before{width:34px;height:10px;top:-8px}
        .ecomax-showcase-label{left:6px;right:6px;top:37px;height:65px;padding:5px 3px;grid-template-rows:auto 19px minmax(17px,auto) auto;gap:2px}
        .ecomax-showcase-label b{font-size:6px;letter-spacing:1.2px}
        .ecomax-showcase-label i{font-size:15px}
        .ecomax-showcase-label span{font-size:6.5px}
        .ecomax-showcase-name{min-height:46px;font-size:10px;line-height:1.35}
        .ecomax-showcase-en{font-size:5.5px;line-height:1.35;letter-spacing:.5px;min-height:27px}
      }
      @media(max-width:360px){
        .ecomax-showcase-grid{grid-template-columns:1fr}
        .ecomax-showcase-card{min-height:300px}
      }
    `
    document.head.appendChild(style);
    hero.insertAdjacentElement('afterend',section);

    var grid=section.querySelector('.ecomax-showcase-grid');
    products.forEach(function(p){
      var card=document.createElement('article');
      card.className='ecomax-showcase-card';
      card.style.setProperty('--ec',p[3]);
      card.innerHTML='<div class="ecomax-showcase-top"><span>ECOMAX // PRO</span><span>'+p[0]+'</span></div><div class="ecomax-showcase-bottle"><div class="ecomax-showcase-label"><b>ECOMAX</b><i>'+p[4]+'</i><span>'+p[1]+'</span></div></div><div class="ecomax-showcase-name">'+p[2]+'</div><div class="ecomax-showcase-en">'+p[1]+' • 5 L</div>';
      grid.appendChild(card);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){
      fix();
      addBottleCatalog();
    },{once:true});
  }else{
    fix();
    addBottleCatalog();
  }
})();
