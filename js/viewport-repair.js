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

    var section=document.createElement('section');
    section.id='ecomaxBottleCatalog';
    section.className='section ecomax-bottle-catalog';
    section.innerHTML=
      '<div class="section-head">'+
        '<div>'+
          '<div class="section-label">ECOMAX // LEVEL CHEMICAL</div>'+
          '<h2>ყველა ბოთლი — <span>თავისი ეტიკეტით</span></h2>'+
        '</div>'+
        '<p>ECOMAX • LEVEL CHEMICAL — შპს ეკომაქსი-ლეველ ქიმიქალ. თითოეულ პროდუქტს აქვს საკუთარი დასახელება და პროფესიონალური ეტიკეტი ქართულ და ინგლისურ ენებზე.</p>'+
      '</div>'+
      '<div class="ecomax-bottle-catalog-frame">'+
        '<div class="ecomax-bottle-catalog-status">PRODUCT LABEL SYSTEM // READY</div>'+
        '<div class="ecomax-bottle-catalog-loading">ECOMAX BOTTLE CATALOG — იტვირთება...</div>'+
        '<img class="ecomax-bottle-catalog-image" alt="ECOMAX LEVEL CHEMICAL — ყველა პროდუქტის ბოთლები და სახელები ქართულად და ინგლისურად" loading="lazy" decoding="async">'+
      '</div>';

    var style=document.createElement('style');
    style.id='ecomax-bottle-catalog-style';
    style.textContent=
      '.ecomax-bottle-catalog{padding-top:34px!important;padding-bottom:34px!important}'+
      '.ecomax-bottle-catalog-frame{position:relative;overflow:hidden;border:1px solid rgba(0,246,255,.28);border-radius:20px;background:linear-gradient(145deg,rgba(4,18,29,.94),rgba(2,8,15,.98));box-shadow:0 0 30px rgba(0,246,255,.08),inset 0 0 28px rgba(0,246,255,.025);padding:10px}'+
      '.ecomax-bottle-catalog-status{position:absolute;z-index:2;left:20px;top:16px;padding:5px 9px;border:1px solid rgba(0,246,255,.25);border-radius:99px;background:rgba(2,9,18,.78);color:#8df8ff;font-size:7px;letter-spacing:1.6px;text-shadow:0 0 8px #00f6ff}'+
      '.ecomax-bottle-catalog-loading{min-height:180px;display:grid;place-items:center;color:#6f8996;font-size:10px;letter-spacing:1px}'+
      '.ecomax-bottle-catalog-image{display:block;width:100%;height:auto;border-radius:14px;border:1px solid rgba(0,246,255,.16);box-shadow:0 0 24px rgba(0,246,255,.09);opacity:0;transition:opacity .35s ease}'+
      '.ecomax-bottle-catalog-image.is-loaded{opacity:1}'+
      '@media(max-width:768px){.ecomax-bottle-catalog{padding-top:24px!important;padding-bottom:24px!important}.ecomax-bottle-catalog-frame{padding:6px;border-radius:14px}.ecomax-bottle-catalog-status{left:12px;top:10px;font-size:6px}.ecomax-bottle-catalog-loading{min-height:120px}}';

    document.head.appendChild(style);
    hero.insertAdjacentElement('afterend',section);

    var img=section.querySelector('.ecomax-bottle-catalog-image');
    var loading=section.querySelector('.ecomax-bottle-catalog-loading');
    var loaded=false;

    function loadImage(){
      if(loaded)return;
      loaded=true;
      var paths=Array.from({length:9},function(_,i){
        return '_ecomax_image_chunks/'+String(i).padStart(2,'0')+'.b64';
      });
      Promise.all(paths.map(function(path){return fetch(path,{cache:'force-cache'}).then(function(r){
        if(!r.ok)throw new Error('catalog chunk '+path+' '+r.status);
        return r.text();
      });})).then(function(parts){
        var b64=parts.join('').replace(/\s+/g,'');
        img.src='data:image/jpeg;base64,'+b64;
        img.onload=function(){
          img.classList.add('is-loaded');
          loading.style.display='none';
        };
      }).catch(function(err){
        loaded=false;
        loading.textContent='ECOMAX BOTTLE CATALOG — ჩატვირთვა ვერ მოხერხდა';
        console.warn('[ECOMAX] bottle catalog image',err);
      });
    }

    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        if(entries.some(function(e){return e.isIntersecting;})){
          io.disconnect();
          loadImage();
        }
      },{rootMargin:'700px 0px'});
      io.observe(section);
    }else{
      setTimeout(loadImage,900);
    }
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
