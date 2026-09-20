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
      .ecomax-bottle-catalog{padding:36px 0!important}
      .ecomax-showcase-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
      .ecomax-showcase-card{position:relative;min-height:310px;padding:13px;border:1px solid color-mix(in srgb,var(--ec) 40%,transparent);border-radius:18px;background:linear-gradient(145deg,rgba(7,25,39,.96),rgba(2,9,16,.98));overflow:hidden;box-shadow:0 0 28px color-mix(in srgb,var(--ec) 12%,transparent),inset 0 0 25px rgba(0,246,255,.025)}
      .ecomax-showcase-card:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,color-mix(in srgb,var(--ec) 10%,transparent) 50%,transparent 70%);pointer-events:none}
      .ecomax-showcase-top{display:flex;justify-content:space-between;color:var(--ec);font:900 7px Arial;letter-spacing:1.3px}
      .ecomax-showcase-bottle{position:relative;width:92px;height:155px;margin:25px auto 15px;border-radius:16px 16px 23px 23px;background:linear-gradient(105deg,rgba(255,255,255,.24),transparent 14% 35%,rgba(255,255,255,.1) 48%,transparent 62%),linear-gradient(90deg,#071018,var(--ec) 35%,#102b38 58%,#03080e);border:1px solid rgba(255,255,255,.38);box-shadow:inset 10px 0 13px rgba(255,255,255,.1),inset -12px 0 16px rgba(0,0,0,.65),0 18px 28px rgba(0,0,0,.5),0 0 25px color-mix(in srgb,var(--ec) 24%,transparent);transform:perspective(600px) rotateY(-7deg)}
      .ecomax-showcase-bottle:before{content:"";position:absolute;left:50%;top:-10px;transform:translateX(-50%);width:42px;height:13px;border-radius:5px 5px 2px 2px;background:#07121b;border:1px solid color-mix(in srgb,var(--ec) 55%,#789)}
      .ecomax-showcase-label{position:absolute;left:7px;right:7px;top:45px;height:75px;border:1px solid var(--ec);border-radius:8px;background:rgba(2,10,17,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 14px color-mix(in srgb,var(--ec) 28%,transparent);font-family:Arial,sans-serif}
      .ecomax-showcase-label b{font-size:8px;letter-spacing:1.7px;color:#fff;text-shadow:0 0 6px var(--ec)}
      .ecomax-showcase-label i{font-style:normal;font-size:18px;color:var(--ec);text-shadow:0 0 8px var(--ec);margin:3px}
      .ecomax-showcase-label span{font-size:7px;color:#fff;font-weight:900;line-height:1.2}
      .ecomax-showcase-name{font:900 11px "Noto Sans Georgian",Arial,sans-serif;color:#fff;text-align:center}
      .ecomax-showcase-en{margin-top:4px;font:700 6px Arial;color:#6f8c9b;text-align:center;letter-spacing:1px}
      @media(max-width:900px){.ecomax-showcase-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:500px){.ecomax-showcase-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ecomax-showcase-card{min-height:275px;padding:9px}.ecomax-showcase-bottle{width:78px;height:137px;margin-top:22px}.ecomax-showcase-label{top:39px;height:66px}}
    `;
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
