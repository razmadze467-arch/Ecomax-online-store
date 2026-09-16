/* ECOMAX — LIVE LVL-CHEMICAL 3D/4D/5D MAGIC ENGINE */
(function(){'use strict';
function init(){
 if(!document.body)return;
 document.body.classList.add('lvl5d-site','lvl-magic-live');
 document.documentElement.classList.add('lvl-magic-live');
 document.body.dataset.magic5d='1';
 var hero=document.querySelector('.hero');
 if(hero){hero.classList.add('lvl5d-hero');var visual=hero.querySelector('.hero-visual');if(visual){visual.classList.add('lvl5d-stage');}}
 var stage=document.querySelector('.lvl5d-stage');
 if(stage){
   if(!stage.querySelector('.magic-particles')){var p=document.createElement('div');p.className='magic-particles';for(var i=0;i<90;i++){var s=document.createElement('i');s.style.setProperty('--mx',Math.random()*100+'%');s.style.setProperty('--my',Math.random()*100+'%');s.style.setProperty('--md',(2+Math.random()*6)+'s');s.style.setProperty('--ms',(1+Math.random()*3)+'px');p.appendChild(s)}stage.appendChild(p)}
   if(!stage.querySelector('.magic-sphere')){var sp=document.createElement('div');sp.className='magic-sphere';sp.innerHTML='<i></i><i></i><i></i><b>LVL-CHEMICAL</b>';stage.appendChild(sp)}
 }
 document.querySelectorAll('.card').forEach(function(card){card.classList.add('lvl-5d-card');});
 var pointer=function(e){var x=e.clientX/window.innerWidth-.5,y=e.clientY/window.innerHeight-.5;document.documentElement.style.setProperty('--mx',x.toFixed(4));document.documentElement.style.setProperty('--my',y.toFixed(4));};
 window.addEventListener('pointermove',pointer,{passive:true});
 window.addEventListener('scroll',function(){document.documentElement.style.setProperty('--scrollDepth',window.scrollY+'px');},{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();