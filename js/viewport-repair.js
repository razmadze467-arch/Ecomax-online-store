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
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix,{once:true});
  else fix();
})();
