/* ECOMAX Studio V15: exact-photo registered ambient effects, no wheel animation.
   The store's products, cart, login, registration and orders are untouched. */
(() => {
  'use strict';
  const PHOTO = 'assets/ecomax-foam-hero.webp';
  const regions = {
    main:[1241,281,301,90],
    far:[1834,281,68,78],
    floor:[735,626,1140,115],
    foam:[941,164,800,250]
  };
  function init() {
    const hero=document.querySelector('.hero');
    const stage=hero?.querySelector('.hero-visual .neon-hero-stage');
    if(!stage || stage.dataset.ecomaxStudioV15==='ready')return !!stage;

    // The previous generated photo masks and water stripes were not aligned to
    // the full-car image. Remove them rather than stacking visual artifacts.
    stage.querySelectorAll(
      '.hero-photo-motion,.ecmx14-effects,.hero-wheel-control,'+
      '.ecomax-v11-wheel-assembly,.neon-car-ground,.neon-car-rig,'+
      '.neon-product-rack,.neon-hero-note'
    ).forEach(node=>node.remove());

    stage.classList.remove('hero-wheels-spinning','ecomax-v11-spinning','ecmx14-ready');
    stage.dataset.ecomaxStudioV15='ready';

    const layer=document.createElement('div');
    layer.className='ecmx15-light-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML=[
      '<span class="ecmx15-lamp front" data-area="main"></span>',
      '<span class="ecmx15-lamp far" data-area="far"></span>',
      '<span class="ecmx15-floor-glow" data-area="floor"></span>',
      '<span class="ecmx15-foam-sheen" data-area="foam"></span>'
    ].join('');
    stage.appendChild(layer);

    const photo=new Image();
    photo.decoding='async';
    const query=window.matchMedia('(max-width: 760px)');
    let raf=0;

    const fraction=value=>{
      if(value==='left'||value==='top')return 0;
      if(value==='right'||value==='bottom')return 1;
      if(value?.endsWith('%')){
        const p=parseFloat(value)/100;
        return Number.isFinite(p)?p:.5;
      }
      return .5;
    };

    function align(){
      if(!photo.naturalWidth||!stage.clientWidth||!stage.clientHeight)return;
      const sw=stage.clientWidth,sh=stage.clientHeight;
      const iw=photo.naturalWidth,ih=photo.naturalHeight;
      const style=getComputedStyle(stage);
      const bgSize=style.backgroundSize.trim();
      let scale;
      if(bgSize==='cover')scale=Math.max(sw/iw,sh/ih);
      else if(bgSize==='contain')scale=Math.min(sw/iw,sh/ih);
      else if(bgSize.match(/^auto\s+[\d.]+%$/)){
        scale=sh*parseFloat(bgSize.match(/[\d.]+%/)[0])/(100*ih);
      } else scale=Math.max(sw/iw,sh/ih);
      const offsetX=(sw-iw*scale)*fraction(style.backgroundPositionX);
      const offsetY=(sh-ih*scale)*fraction(style.backgroundPositionY);
      for(const element of layer.children){
        const r=regions[element.dataset.area];
        if(!r)continue;
        element.style.left=(offsetX+r[0]*scale)+'px';
        element.style.top=(offsetY+r[1]*scale)+'px';
        element.style.width=(r[2]*scale)+'px';
        element.style.height=(r[3]*scale)+'px';
      }
    }
    const redraw=()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(align);
    };
    photo.onload=redraw;
    photo.onerror=()=>layer.remove();
    photo.src=new URL(PHOTO,document.baseURI).href;
    if(photo.complete&&photo.naturalWidth)redraw();
    window.addEventListener('resize',redraw,{passive:true});
    query.addEventListener?.('change',redraw);
    if(window.ResizeObserver)new ResizeObserver(redraw).observe(stage);
    return true;
  }
  function boot(n=0){
    if(init()||n>=50)return;
    requestAnimationFrame(()=>boot(n+1));
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  else boot();
})();
