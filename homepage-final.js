(function(){
'use strict';

var COPYRIGHT='© ყველა უფლება დაცულია შპს „ეკომაქსის“ მიერ — 2026';
var DEVELOPER='DEVELOPED BY BTCGAMER';

function styles(){
 if(document.getElementById('ecomaxFinalStyle')) return;
 var s=document.createElement('style');
 s.id='ecomaxFinalStyle';
 s.textContent=`
footer.footer .footer-bottom{display:none!important}
footer.footer .footer-main>p{display:none!important}
.ecomax-final-care{padding:72px 4%;max-width:1400px;margin:0 auto;position:relative;z-index:3}
.ecomax-final-head{text-align:center;margin-bottom:34px}
.ecomax-final-head small{color:#00eaff;letter-spacing:3px;font-weight:900}
.ecomax-final-head h2{font-size:clamp(30px,4vw,50px);margin:12px 0;color:#eefbff}
.ecomax-final-head h2 span{color:#00eaff}
.ecomax-final-head p{max-width:850px;margin:auto;color:#91a9b8;line-height:1.85}
.ecomax-final-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.ecomax-final-card{min-height:280px;padding:26px;border:1px solid rgba(0,234,255,.20);border-radius:22px;background:linear-gradient(145deg,rgba(7,31,52,.96),rgba(2,11,23,.99));box-shadow:0 18px 50px rgba(0,0,0,.30);transition:.3s}
.ecomax-final-card:hover{transform:translateY(-7px);border-color:#00eaff;box-shadow:0 0 28px rgba(0,234,255,.16)}
.ecomax-final-card .num{color:#00eaff;font-size:10px;letter-spacing:3px;font-weight:900}
.ecomax-final-card h3{font-size:21px;margin:13px 0;color:#eefbff}
.ecomax-final-card p,.ecomax-final-card li{color:#9db2c0;font-size:13px;line-height:1.8}
.ecomax-final-card ul{padding-left:18px}
.ecomax-final-stage{position:relative;height:145px;overflow:hidden;border-top:1px solid rgba(0,234,255,.16);background:linear-gradient(180deg,#020912,#01050d)}
.ecomax-final-stage .road{position:absolute;left:0;right:0;bottom:22px;height:2px;background:repeating-linear-gradient(90deg,#00eaff 0 70px,transparent 70px 125px);opacity:.55;animation:ecomaxRoad 1.1s linear infinite}
.ecomax-final-car{position:absolute;left:-190px;bottom:31px;width:140px;height:52px;animation:ecomaxDrive 12s linear infinite,ecomaxZig 1.15s ease-in-out infinite;filter:drop-shadow(0 0 9px #00eaff);z-index:5}
.ecomax-final-car .body{position:absolute;left:28px;bottom:5px;width:100px;height:22px;border:2px solid #00eaff;border-radius:9px 22px 6px 6px;background:rgba(0,70,95,.45)}
.ecomax-final-car .roof{position:absolute;left:52px;bottom:27px;width:50px;height:18px;border:2px solid #00eaff;border-bottom:0;border-radius:22px 22px 0 0}
.ecomax-final-car .wheel{position:absolute;bottom:0;width:14px;height:14px;border:2px solid #00eaff;border-radius:50%;background:#01050d}
.ecomax-final-car .w1{left:38px}.ecomax-final-car .w2{right:13px}
.ecomax-final-car .text{position:absolute;left:-118px;top:12px;white-space:nowrap;color:#00eaff;font:900 8px Arial,sans-serif;letter-spacing:1px;text-shadow:0 0 9px #00eaff;transition:opacity .18s}
@keyframes ecomaxDrive{from{left:-190px}to{left:calc(100% + 190px)}}
@keyframes ecomaxZig{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes ecomaxRoad{to{background-position:-125px 0}}
@media(max-width:900px){.ecomax-final-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.ecomax-final-care{padding:55px 20px}.ecomax-final-grid{grid-template-columns:1fr;gap:15px}.ecomax-final-card{min-height:0;padding:21px}.ecomax-final-stage{height:115px}.ecomax-final-car{width:110px}.ecomax-final-car .body{left:20px;width:78px}.ecomax-final-car .roof{left:38px;width:40px}.ecomax-final-car .w1{left:28px}.ecomax-final-car .w2{right:10px}.ecomax-final-car .text{left:-105px;font-size:6px}}
`;
 document.head.appendChild(s);
}

function removeOldBottom(){
 document.querySelectorAll('footer.footer .footer-bottom').forEach(function(x){x.remove();});
 document.querySelectorAll('.ecomax-bottom-ui,.ecomax-road,.ecomax-car').forEach(function(x){x.remove();});
}

function addCare(){
 if(document.querySelector('.ecomax-final-care')) return;
 var contact=document.querySelector('#contact');
 if(!contact) return;
 var sec=document.createElement('section');
 sec.className='ecomax-final-care';
 sec.id='car-care';
 sec.innerHTML=`
 <div class="ecomax-final-head"><small>ECOMAX • CAR CARE GUIDE</small><h2>ავტომობილის <span>სრული მოვლა</span></h2><p>სუფთა და მოვლილი ავტომობილი იწყება სწორი პროდუქტის შერჩევით. ECOMAX-ის პროფესიონალური ავტოქიმია დაგეხმარება კორპუსის, ძრავის, სალონის, დისკებისა და სხვა ზედაპირების ყოველდღიურ მოვლაში.</p></div>
 <div class="ecomax-final-grid">
 <article class="ecomax-final-card"><div class="num">01 / EXTERIOR</div><h3>კორპუსის მოვლა და ბზინვარება</h3><p>კორპუსზე გროვდება მტვერი, გზის ჭუჭყი, ცხიმი და სხვა ნარჩენი. რეგულარული წმენდა ხელს უწყობს ზედაპირის სუფთა და მოვლილი იერსახის შენარჩუნებას.</p><ul><li>აირჩიე შესაბამისი პროდუქტი ზედაპირის მიხედვით.</li><li>დაიცავი პროდუქტის მითითებული გაზავება.</li><li>ქიმიური საშუალება ზედაპირზე საჭიროზე დიდხანს არ დატოვო.</li></ul></article>
 <article class="ecomax-final-card"><div class="num">02 / ENGINE</div><h3>ძრავის სისუფთავე და დეტალები</h3><p>ძრავის განყოფილებაში ზეთი, მტვერი და მძიმე ჭუჭყი დროთა განმავლობაში გროვდება. ფრთხილი და კონტროლირებული წმენდა უკეთეს შედეგს იძლევა.</p><ul><li>ელექტრო კომპონენტები წინასწარ დაიცავი.</li><li>გაზავება დაბინძურების ხარისხის მიხედვით შეარჩიე.</li><li>სამუშაოს შემდეგ ზედაპირი კარგად ჩამორეცხე და გააშრე.</li></ul></article>
 <article class="ecomax-final-card"><div class="num">03 / INTERIOR</div><h3>სალონი და კომფორტი</h3><p>ტყავი, ქსოვილი და პლასტმასა განსხვავებულ მოვლას საჭიროებს. თითოეული ზედაპირისთვის გამოიყენე შესაბამისი პროდუქტი, რათა შეინარჩუნო სისუფთავე და მოვლილი იერი.</p><ul><li>ტყავისთვის გამოიყენე ტყავის ქიმწმენდა.</li><li>ტექსტილისთვის გამოიყენე ნაჭრის ქიმწმენდა.</li><li>ახალი საშუალება ჯერ მცირე ადგილზე გამოცადე.</li></ul></article>
 <article class="ecomax-final-card"><div class="num">04 / WHEELS</div><h3>დისკები და საბურავები</h3><p>დისკებზე გროვდება მუხრუჭის მტვერი და გზის ჭუჭყი, ხოლო საბურავების მოვლა ავტომობილის საერთო იერსახეს აძლიერებს.</p><ul><li>დისკის საწმენდი დაბინძურების მიხედვით გააზავე.</li><li>საშუალება ზედაპირზე გაშრობამდე ჩამოიბანე.</li><li>საბურავის მოვლის პროდუქტი მუხრუჭის სამუშაო ზედაპირზე არ გამოიყენო.</li></ul></article>
 <article class="ecomax-final-card"><div class="num">05 / DETAILING</div><h3>დეტეილინგი — ყურადღება დეტალებზე</h3><p>დეტეილინგი მხოლოდ გარეცხვას არ ნიშნავს. მნიშვნელოვანია რთულად მისადგომი ადგილების, ნაკერების, პლასტმასის, რეზინისა და სხვა დეტალების თანმიმდევრული მოვლა.</p><ul><li>იმუშავე ეტაპობრივად და მცირე მონაკვეთებად.</li><li>გამოიყენე სუფთა მიკროფიბრა შესაბამისი ზედაპირისთვის.</li><li>ყოველი პროდუქტი მისი დანიშნულებით გამოიყენე.</li></ul></article>
 <article class="ecomax-final-card"><div class="num">06 / ROUTINE</div><h3>სწორი მოვლის რუტინა</h3><p>საუკეთესო შედეგი მიიღება მაშინ, როდესაც ავტომობილის მოვლა ერთჯერადი პროცედურა კი არა, რეგულარული რუტინაა. სწორი პროდუქტი, სწორი გაზავება და უსაფრთხო გამოყენება შედეგს აუმჯობესებს.</p><ul><li>დაიცავი ეტიკეტზე მითითებული გამოყენების წესი.</li><li>გამოიყენე ხელთათმანი და თვალის/კანის დაცვა საჭიროებისას.</li><li>პროდუქტები შეინახე ბავშვებისთვის მიუწვდომელ ადგილზე.</li></ul></article>
 </div>`;
 contact.parentNode.insertBefore(sec,contact);
}

function addFinalStage(){
 if(document.querySelector('.ecomax-final-stage')) return;
 var footer=document.querySelector('footer.footer');
 if(!footer) return;
 var stage=document.createElement('div');
 stage.className='ecomax-final-stage';
 stage.innerHTML='<div class="ecomax-final-car" aria-label="ECOMAX"><span class="text"></span><span class="body"></span><span class="roof"></span><span class="wheel w1"></span><span class="wheel w2"></span></div><div class="road"></div>';
 footer.appendChild(stage);
 var car=stage.querySelector('.ecomax-final-car');
 var text=stage.querySelector('.text');
 var cycle=0;
 function show(){text.textContent=cycle%2===0?DEVELOPER:COPYRIGHT;}
 show();
 car.addEventListener('animationiteration',function(e){if(e.animationName==='ecomaxDrive'){cycle++;show();}});
}

function init(){styles();removeOldBottom();addCare();addFinalStage();}
window.ECOMAX_FINAL_INIT=init;
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
window.addEventListener('load',init,{once:true});
})();
