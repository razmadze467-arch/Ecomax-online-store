/* ECOMAX RESTORED V23: photo-registered headlamp glows and wet-floor reflection.
   Original vehicle image stays static. No wheels or foam replacements. */
(() => {
  'use strict';
  const source='assets/ecomax-foam-hero.webp';
  const areas={
    main:[1240,282,305,94],
    far:[1832,282,70,85],
    floor:[775,609,1150,155]
  };
  function init(){
    const body=document.body;
    const hero=document.querySelector('.hero');
    const visual=hero?.querySelector('.hero-visual');
    const stage=visual?.querySelector('.neon-hero-stage');
    if(!body||!hero||!visual||!stage)return false;
    if(body.dataset.ecomaxRestoredV23==='ready')return true;
    body.classList.add('ecomax-restored-v23');
    body.dataset.ecomaxRestoredV23='ready';
    stage.querySelectorAll('.hero-photo-motion,.hero-wheel-control,.n20-hero-atmosphere,.v21-hero-depth,.ecmx14-effects,.ecmx15-light-layer').forEach(el=>el.remove());
    const layer=document.createElement('div');
    layer.className='r23-photo-lights';
    layer.setAttribute('aria-hidden','true');
    for(const key of Object.keys(areas)){
      const glow=document.createElement('span');
      glow.className=key==='floor'?'r23-floor':'r23-lamp '+(key==='far'?'far':'main');
      glow.dataset.area=key;
      layer.appendChild(glow);
    }
    stage.appendChild(layer);
    const image=new Image();
    image.decoding='async';
    const calcPos=v=>{
      if(v==='left'||v==='top')return 0;
      if(v==='right'||v==='bottom')return 1;
      if(typeof v==='string'&&v.endsWith('%')){
        const n=parseFloat(v);
        return Number.isFinite(n)?n/100:.5;
      }
      return .5;
    };
    const update=()=>{
      if(!image.naturalWidth||!stage.clientWidth||!stage.clientHeight)return;
      const cs=getComputedStyle(stage);
      const sw=stage.clientWidth,sh=stage.clientHeight;
      const iw=image.naturalWidth,ih=image.naturalHeight;
      let scale;
      if(cs.backgroundSize==='cover'){
        scale=Math.max(sw/iw,sh/ih);
      }else{
        const pct=cs.backgroundSize.match(/^auto\s+([\d.]+)%$/);
        scale=pct ? sh*Number(pct[1])/(100*ih):Math.max(sw/iw,sh/ih);
      }
      const ox=(sw-iw*scale)*calcPos(cs.backgroundPositionX);
      const oy=(sh-ih*scale)*calcPos(cs.backgroundPositionY);
      for(const el of layer.children){
        const [x,y,w,h]=areas[el.dataset.area];
        el.style.left=(ox+x*scale)+'px';
        el.style.top=(oy+y*scale)+'px';
        el.style.width=(w*scale)+'px';
        el.style.height=(h*scale)+'px';
      }
    };
    let frame=0;
    const schedule=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(update);
    };
    image.onload=schedule;
    image.onerror=()=>layer.remove();
    image.src=new URL(source,document.baseURI).href;
    if(image.complete&&image.naturalWidth)schedule();
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('orientationchange',schedule,{passive:true});
    if(window.ResizeObserver)new ResizeObserver(schedule).observe(stage);
    return true;
  }
  function boot(n=0){
    if(init())return;
    if(n<90)requestAnimationFrame(()=>boot(n+1));
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  }else boot();
})();
