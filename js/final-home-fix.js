/* ECOMAX FINAL HOME DOM FIX — runs last and prevents competing visual layers from breaking the hero */
(function(){'use strict';
function apply(){
  var hero=document.querySelector('.hero');
  if(!hero)return;
  document.documentElement.classList.add('ecomax-final-home');
  document.body.classList.add('ecomax-final-home');
  document.querySelectorAll('.magic-sphere').forEach(function(x){x.remove()});
  var visual=hero.querySelector('.hero-visual');
  if(visual){
    var old=visual.querySelector('.hero-bottle');
    var label=visual.querySelector('.hero-label');
    if(old&&label){
      var b=label.querySelector('b'); if(b)b.textContent='LVL-CHEMICAL';
      var s=label.querySelector('span'); if(s)s.textContent='PROFESSIONAL AUTOMOTIVE CARE';
      var strong=label.querySelector('strong'); if(strong)strong.textContent='5 L';
    }
  }
}
function boot(){apply();setTimeout(apply,250);setTimeout(apply,800);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
