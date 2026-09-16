/* ECOMAX — EMERGENCY VIEWPORT REPAIR
   Removes the persistent half-width/empty-right-side layout on real devices.
   Does not remove the 3D/4D/5D effects inside the page. */
(function(){'use strict';
  function repair(){
    var vw=window.innerWidth||document.documentElement.clientWidth||0;
    if(!vw) return;

    document.documentElement.style.setProperty('width','100%','important');
    document.documentElement.style.setProperty('max-width','none','important');
    document.documentElement.style.setProperty('min-width','0','important');
    document.documentElement.style.setProperty('overflow-x','hidden','important');

    Array.prototype.slice.call(document.body.children).forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.width>0 && r.width<vw*.86){
        el.style.setProperty('width','100vw','important');
        el.style.setProperty('max-width','none','important');
        el.style.setProperty('min-width','0','important');
        el.style.setProperty('margin-left','0','important');
        el.style.setProperty('margin-right','0','important');
        el.style.setProperty('transform','none','important');
        el.style.setProperty('zoom','1','important');
      }
    });

    ['header','.header','main','.hero','.lvl5d-hero','.section','footer','.footer'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        var r=el.getBoundingClientRect();
        if(r.width>0 && r.width<vw*.86){
          el.style.setProperty('width','100vw','important');
          el.style.setProperty('max-width','none','important');
          el.style.setProperty('min-width','0','important');
          el.style.setProperty('margin-left','0','important');
          el.style.setProperty('margin-right','0','important');
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',repair); else repair();
  window.addEventListener('load',repair,{once:true});
  window.addEventListener('resize',repair,{passive:true});
})();
