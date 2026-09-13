(function(){
'use strict';
var COPYRIGHT='© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ — 2026';
var DEVELOPER='DEVELOPED BY BTCGAMER';
function addStyles(){
 if(document.getElementById('ecomaxFinalStyle')) return;
 var s=document.createElement('style'); s.id='ecomaxFinalStyle';
 s.textContent='footer.footer .footer-bottom,footer.footer .footer-main>p{display:none!important}'+
 '.ecomax-final-care{padding:75px 4%;max-width:1400px;margin:auto;position:relative;z-index:2}'+
 '.ecomax-final-head{text-align:center;margin-bottom:32px}.ecomax-final-head small{color:#00eaff;letter-spacing:3px;font-weight:900}.ecomax-final-head h2{font-size:clamp(30px,4vw,50px);margin:12px 0;color:#eefbff}.ecomax-final-head h2 span{color:#00eaff}.ecomax-final-head p{max-width:820px;margin:auto;color:#91a9b8;line-height:1.8}'+
 '.ecomax-final-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.ecomax-final-card{min-height:270px;padding:26px;border:1px solid rgba(0,234,255,.2);border-radius:22px;background:linear-gradient(145deg,rgba(7,31,52,.95),rgba(2,11,23,.98));box-shadow:0 18px 50px rgba(0,0,0,.3);transition:.3s}.ecomax-final-card:hover{transform:translateY(-7px);border-color:#00eaff;box-shadow:0 0 28px rgba(0,234,255,.16)}.ecomax-final-card .num{color:#00eaff;font-size:10px;letter-spacing:3px;font-weight:900}.ecomax-final-card h3{font-size:21px;margin:13px 0;color:#eefbff}.ecomax-final-card p,.ecomax-final-card li{color:#9db2c0;font-size:13px;line-height:1.8}.ecomax-final-card ul{padding-left:18px}'+
 '.ecomax-final-stage{position:relative;height:125px;overflow:hidden;border-top:1px solid rgba(0,234,255,.16);background:linear-gradient(180deg,#020912,#01050d)}'+
 '.ecomax-final-stage .copy{position:absolute;left:15px;top:15px;color:#91a9b8;font-size:9px;font-weight:700;z-index:2}'+
 '.ecomax-final-stage .road{position:absolute;left:0;right:0;bottom:20px;height:2px;background:repeating-linear-gradient(90deg,#00eaff 0 70px,transparent 70px 125px);opacity:.55;animation:ecomaxRoad 1.1s linear infinite}'+
 '.ecomax-final-car{position:absolute;left:-180px;bottom:28px;width:125px;height:48px;animation:ecomaxDrive 12s linear infinite,ecomaxZig 1.15s ease-in-out infinite;filter:drop-shadow(0 0 9px #00eaff);z-index:5}'+
 '.ecomax-final-car .body{position:absolute;left:17px;bottom:5px;width:96px;height:21px;border:2px solid #00eaff;border-radius:9px 21px 6px 6px;background:rgba(0,70,95,.45)}'+
 '.ecomax-final-car .roof{position:absolute;left:40px;bottom:25px;width:49px;height:18px;border:2px solid #00eaff;border-bottom:0;border-radius:22px 22px 0 0}'+
 '.ecomax-final-car .wheel{position:absolute;bottom:0;width:14px;height:14px;border:2px solid #00eaff;border-radius:50%;background:#01050d}.ecomax-final-car .w1{left:27px}.ecomax-final-car .w2{right:15px}'+
 '.ecomax-final-car .text{position:absolute;right:105px;top:11px;white-space:nowrap;color:#00eaff;font:900 8px Arial,sans-serif;letter-spacing:1px;text-shadow:0 0 9px #00eaff;transition:opacity .18s}'+
 '@keyframes ecomaxDrive{from{left:-180px}to{left:calc(100% + 180px)}}@keyframes ecomaxZig{0%,100%{margin-bottom:0}50%{margin-bottom:14px}}@keyframes ecomaxRoad{to{background-position:-125px 0}}'+
 '@media(max-width:900px){.ecomax-final-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.ecomax-final-care{padding:55px 20px}.ecomax-final-grid{grid-template-columns:1fr;gap:15px}.ecomax-final-card{min-height:0;padding:21px}.ecomax-final-stage{height:105px}.ecomax-final-car{width:105px}.ecomax-final-car .text{right:88px;font-size:6px}.ecomax-final-stage .copy{font-size:8px;max-width:90%}}';
 document.head.appendChild(s);
}
function addCare(){
 if(document.querySelector('.ecomax-final-care')) return;
 var contact=document.querySelector('#contact'); if(!contact) return;
 var sec=document.createElement('section'); sec.className='ecomax-final-care'; sec.id='car-care';
 sec.innerHTML='<div class="ecomax-final-head"><small>ECOMAX • CAR CARE GUIDE</small><h2>ავტომობილის <span>სრული მოვლა</span></h2><p>ავტომობილის მოვლა იწყება სწორი საშუალების შერჩევით და გრძელდება სწორი გამოყენებით. ECOMAX-ის ავტოქიმია შექმნილია სხვადასხვა ზედაპირის სისუფთავისა და მოვლილი იერსახის შესანარჩუნებლად.</p></div><div class="ecomax-final-grid">'+
 '<article class="ecomax-final-card"><div class="num">01 / EXTERIOR</div><h3>კორპუსის მოვლა და ბზინვარება</h3><p>კორპუსზე გროვდება მტვერი, გზის ჭუჭყი, ცხიმი და სხვა ნარჩენი. რეგულარული წმენდა ხელს უწყობს ზედაპირის სუფთა და მოვლილი მდგომარეობის შენარჩუნებას.</p><ul><li>ზედაპირისთვის შესაფერისი საშუალება გამოიყენე.</li><li>დაიცავი მითითებული გაზავება.</li><li>ქიმიური საშუალება ზედაპირზე არ დატოვო საჭიროზე დიდხანს.</li></ul></article>'+
 '<article class="ecomax-final-card"><div class="num">02 / ENGINE</div><h3>ძრავის სისუფთავე</h3><p>ძრავის განყოფილებაში ზეთი, მტვერი და მძიმე ჭუჭყი დროთა განმავლობაში გროვდება. ფრთხილი და კონტროლირებული წმენდა უკეთეს შედეგს იძლევა.</p><ul><li>ელექტრო კომპონენტები წინასწარ დაიცავი.</li><li>გაზავება დაბინძურების მიხედვით შეარჩიე.</li><li>სამუშაოს შემდეგ კარგად ჩამორეცხე და გააშრე.</li></ul></article>'+
 '<article class="ecomax-final-card"><div class="num">03 / INTERIOR</div><h3>სალონი და კომფორტი</h3><p>ტყავი, ქსოვილი და პლასტმასა განსხვავებულ მოვლას საჭიროებს. თითოეული ზედაპირისთვის გამოიყენე შესაბამისი პროდუქტი.</p><ul><li>ტყავისთვის გამოიყენე ტყავის ქიმწმენდა.</li><li>ტექსტილისთვის გამოიყენე ნაჭრის ქიმწმენდა.</li><li>ახალი საშუალება ჯერ მცირე ადგილზე გამოცადე.</li></ul></article>'+
 '<article class="ecomax-final-card"><div class="num">04 / WHEELS</div><h3>დისკები და საბურავები</h3><p>დისკებზე გროვდება მუხრუჭის მტვერი და გზის ჭუჭყი. საბურავების მოვლა კი ავტომობილის საერთო იერსახეს აუმჯობესებს.</p><ul><li>დისკის საწმენდი დაბინძურების მიხედვით გააზავე.</li><li>საშუალება ზედაპირზე გაშრობამდე ჩამოიბანე.</li><li>საბურავის პროდუქტი მუხრუჭის სამუშაო ზედაპირს მოარიდე.</li></ul></article>'+
 '<article class="ecomax-final-card"><div class="num">05 / DETAILING</div><h3>დეტეილინგი — ყურადღება დეტალებზე</h3><p>პროფესიონალური შედეგისთვის მნიშვნელოვანია სწორი პროდუქტი, სწორი გაზავება, შესაბამისი ხელსაწყო და თანმიმდევრული მუშაობა.</p><ul><li>იმუშავე სუფთა ხელსაწყოებით.</li><li>დაიწყე ნაკლებად აგრესიული მეთოდით.</li><li>სხვადასხვა ქიმიური საშუალება თვითნებურად არ აურიო.</li></ul></article>'+
 '<article class="ecomax-final-card"><div class="num">06 / ROUTINE</div><h3>მოვლის სწორი რუტინა</h3><p>რეგულარული მოვლა ამცირებს ჭუჭყის დაგროვებას და გეხმარება ავტომობილის მუდმივად მოვლილი მდგომარეობის შენარჩუნებაში.</p><ul><li>კორპუსი — რეგულარულად.</li><li>სალონი — საჭიროების მიხედვით.</li><li>დისკები, საბურავები და ძრავის განყოფილება — პერიოდულად და ფრთხილად.</li></ul></article></div>';
 contact.parentNode.insertBefore(sec,contact);
}
function addCar(){
 var footer=document.querySelector('footer.footer'); if(!footer||document.querySelector('.ecomax-final-stage')) return;
 var stage=document.createElement('div'); stage.className='ecomax-final-stage';
 stage.innerHTML='<div class="copy">'+COPYRIGHT+'</div><div class="road"></div><div class="ecomax-final-car"><span class="text">'+DEVELOPER+'</span><i class="roof"></i><i class="body"></i><i class="wheel w1"></i><i class="wheel w2"></i></div>';
 footer.appendChild(stage);
 var car=stage.querySelector('.ecomax-final-car'), text=stage.querySelector('.text'), i=0, messages=[DEVELOPER,COPYRIGHT];
 car.addEventListener('animationiteration',function(e){if(e.animationName!=='ecomaxDrive')return;i=(i+1)%2;text.style.opacity='0';setTimeout(function(){text.textContent=messages[i];text.style.opacity='1';},180);});
}
function run(){addStyles();document.querySelector('.ecomax-bottom-ui')?.remove();addCare();addCar();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();