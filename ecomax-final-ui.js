(function(){
'use strict';
function init(){
  if(document.documentElement.dataset.ecomaxFinalUi==='1') return;
  document.documentElement.dataset.ecomaxFinalUi='1';

  /* Remove every legacy footer/bottom block. */
  document.querySelectorAll('footer, .ecomax-final-stage, .ecomax-bottom-ui, .ecomax-road, .ecomax-car').forEach(function(el){
    el.style.display='none';
    if(el.tagName==='FOOTER') el.setAttribute('aria-hidden','true');
  });

  /* Remove visibly corrupted UTF-8 text nodes anywhere near the bottom. */
  var bad=/[ÃÂâ€™â€œâ€�áƒ�áƒ|�]{2,}/;
  document.querySelectorAll('body *').forEach(function(el){
    if(el.children.length===0 && bad.test(el.textContent||'')) el.style.display='none';
  });

  var footer=document.createElement('footer');
  footer.className='ecomax-clean-footer';
  footer.innerHTML=`
    <div class="ecomax-footer-main">
      <div>
        <div class="ecomax-brand">ECO<span>MAX</span></div>
        <div class="ecomax-sub">PROFESSIONAL AUTO CHEMISTRY</div>
        <p style="color:#8298a7;line-height:1.8;max-width:430px;margin-top:18px;font-size:13px">პროფესიონალური ავტოქიმია ავტომობილის სისუფთავისა და მოვლისთვის. ხარისხი, სწორი გამოყენება და თანამედროვე მიდგომა.</p>
      </div>
      <div>
        <div class="ecomax-footer-title">ნავიგაცია</div>
        <div class="ecomax-footer-links">
          <a href="#home">მთავარი</a>
          <a href="#products">პროდუქცია</a>
          <a href="#dilution">გაზავებები</a>
          <a href="#safety">უსაფრთხოება</a>
        </div>
      </div>
      <div>
        <div class="ecomax-footer-title">ECOMAX</div>
        <div class="ecomax-footer-links">
          <a href="#contact">კონტაქტი</a>
          <a href="login.html">შესვლა</a>
          <a href="register.html">რეგისტრაცია</a>
          <a href="checkout.html">შეკვეთა</a>
        </div>
      </div>
    </div>
    <div class="ecomax-footer-bottom"><strong>© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ — 2026</strong></div>
    <div class="ecomax-clean-road" aria-label="ECOMAX credits">
      <div class="ecomax-clean-car">
        <div class="carbody"></div><div class="roof"></div><div class="wheel one"></div><div class="wheel two"></div>
        <div class="ecomax-clean-credit">DEVELOPED BY BTCGAMER</div>
      </div>
    </div>`;
  document.body.appendChild(footer);

  var car=footer.querySelector('.ecomax-clean-car');
  var credit=footer.querySelector('.ecomax-clean-credit');
  var messages=['DEVELOPED BY BTCGAMER','© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ — 2026'];
  var i=0;
  car.addEventListener('animationiteration',function(e){
    if(e.animationName!=='ecomaxCarDrive') return;
    i=(i+1)%messages.length;
    credit.textContent=messages[i];
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
