/* ECOMAX V11 — isolated perspective alloy-wheel overlay.
   A clean vector rim replaces the photo-crop spinner. The body, tyre, foam and
   brake caliper remain static. No external libraries or backend changes. */
(() => {
  'use strict';
  const PHOTO_URL = 'assets/ecomax-foam-hero.webp';
  const WHEEL_SOURCE = [
    {type:'front', x:1164, y:472, rx:57, ry:121},
    {type:'rear', x:765, y:421, rx:24, ry:73}
  ];
  const DURATION = 3250;
  const FULL_TURNS = 3;

  function svgWheel(type) {
    const id = 'ecmx11-' + type;
    const front = type === 'front';
    const spokes = Array.from({length:10}, (_,i) => {
      const angle = i * 36;
      return '<g transform="rotate('+angle+' 100 100)">' +
        '<path d="M94 93 L89 40 Q93 29 98 30 L98 90 Z" fill="url(#'+id+'-metal)" stroke="#131b22" stroke-width="1.4"/>' +
        '<path d="M102 90 L104 30 Q110 28 113 39 L106 93 Z" fill="url(#'+id+'-metal)" stroke="#111820" stroke-width="1.2"/>' +
        '<path d="M92 44 L94 81 M108 45 L105 81" stroke="#afbac2" stroke-opacity=".45" stroke-width="1.2"/>' +
        '</g>';
    }).join('');
    const holes = Array.from({length:24},(_,i)=>{
      const a=i*Math.PI/12;
      return '<circle cx="'+(100+Math.sin(a)*62).toFixed(2)+'" cy="'+(100-Math.cos(a)*62).toFixed(2)+'" r="2.2" fill="#10161c" opacity=".9"/>';
    }).join('');
    return '<span class="ecomax-v11-wheel-assembly" aria-hidden="true">' +
      '<svg class="ecomax-v11-wheel-svg" viewBox="0 0 200 200" preserveAspectRatio="none" role="presentation" focusable="false">' +
      '<defs>' +
        '<radialGradient id="'+id+'-cavity"><stop stop-color="#222a30"/><stop offset=".62" stop-color="#090f15"/><stop offset="1" stop-color="#020509"/></radialGradient>' +
        '<linearGradient id="'+id+'-metal" x1="0" y1="0" x2="1" y2=".75"><stop stop-color="#10171c"/><stop offset=".2" stop-color="#6e7c87"/><stop offset=".42" stop-color="#0b1218"/><stop offset=".75" stop-color="#3f4a55"/><stop offset="1" stop-color="#10161c"/></linearGradient>' +
        '<linearGradient id="'+id+'-lip" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#bccad5"/><stop offset=".21" stop-color="#232d36"/><stop offset=".45" stop-color="#818d96"/><stop offset=".72" stop-color="#111820"/><stop offset="1" stop-color="#78858c"/></linearGradient>' +
        '<radialGradient id="'+id+'-disc"><stop stop-color="#4b5359"/><stop offset=".7" stop-color="#60676c"/><stop offset="1" stop-color="#161c21"/></radialGradient>' +
        '<radialGradient id="'+id+'-hub"><stop stop-color="#8e9da8"/><stop offset=".23" stop-color="#313b45"/><stop offset=".62" stop-color="#0a1218"/><stop offset="1" stop-color="#778a98"/></radialGradient>' +
      '</defs>' +
      '<circle cx="100" cy="100" r="99" fill="#060b10"/>' +
      '<circle cx="100" cy="100" r="97" fill="none" stroke="url(#'+id+'-lip)" stroke-width="4"/>' +
      '<circle cx="100" cy="100" r="91" fill="url(#'+id+'-cavity)" stroke="#101920" stroke-width="4"/>' +
      '<circle cx="100" cy="100" r="77" fill="url(#'+id+'-disc)" stroke="#151e25" stroke-width="1"/>' +
      '<circle cx="100" cy="100" r="69" fill="none" stroke="#8c979d" stroke-opacity=".38" stroke-width="2"/>' +
      '<g class="ecomax-v11-brake-dots">'+holes+'</g>' +
      // The caliper is behind the spokes and never rotates.
      (front ? '<path d="M47 84 C35 83 31 92 31 107 L34 129 Q38 138 50 136 L63 130 L64 96 Z" fill="#bc171b" stroke="#2d0304" stroke-width="3"/><path d="M36 98 L44 92 L54 96 L51 128 L39 127 Z" fill="#ed3433" opacity=".7"/>' :
       '<path d="M44 93 Q34 99 36 114 L40 130 L55 127 L61 101 Z" fill="#991c23" stroke="#2e0709" stroke-width="2"/>') +
      '<g class="ecomax-v11-spoke-rotor">'+spokes+
        '<circle cx="100" cy="100" r="15" fill="url(#'+id+'-hub)" stroke="#10161a" stroke-width="2.5"/>' +
        '<circle cx="100" cy="100" r="7.5" fill="#212e37" stroke="#8b9eaa" stroke-width="1.3"/>' +
        '<circle cx="100" cy="100" r="2.3" fill="#f0ab6a"/>' +
        Array.from({length:5},(_,i)=>{const a=i*Math.PI*2/5;return '<circle cx="'+(100+11*Math.cos(a)).toFixed(2)+'" cy="'+(100+11*Math.sin(a)).toFixed(2)+'" r="2" fill="#adb3b5" stroke="#0b1118" stroke-width="1"/>';}).join('') +
      '</g>' +
      '<circle cx="100" cy="100" r="95" fill="none" stroke="#b1bcc7" stroke-opacity=".38" stroke-width="1.1"/>' +
      '<path d="M24 73 A81 81 0 0 1 78 22" fill="none" stroke="#cbe9f4" stroke-width="1.8" opacity=".28"/>' +
      '<path d="M129 182 A86 86 0 0 0 179 141" fill="none" stroke="#91b8c4" stroke-width="1.5" opacity=".27"/>' +
      '</svg></span>';
  }

  function init() {
    const stage=document.querySelector('.hero-visual .neon-hero-stage');
    if (!stage || stage.dataset.ecomaxWheelV11) return;
    const motion=stage.querySelector('.hero-photo-motion');
    if (!motion) return;
    const data=WHEEL_SOURCE.map(w=>({...w,el:stage.querySelector('.hero-wheel-'+w.type)}));
    if (data.some(w=>!w.el)) return;
    const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    stage.dataset.ecomaxWheelV11='loading';

    // Attach the rim outside of the legacy photo-crop renderer, once.
    for(const w of data) {
      w.el.querySelectorAll('.hero-wheel-disc,.hero-wheel-live,.hero-wheel-hint').forEach(el=>el.remove());
      w.el.insertAdjacentHTML('beforeend',svgWheel(w.type));
      w.rotor=w.el.querySelector('.ecomax-v11-spoke-rotor');
      w.el.setAttribute('aria-label','ბორბლის დისკის რეალისტური დატრიალება');
      w.el.setAttribute('title','დააჭირე დისკის დასატრიალებლად');
    }

    const photo=new Image();
    photo.decoding='async';
    photo.src=new URL(PHOTO_URL,document.baseURI).href;
    let anim=0,started=0,running=false,resizeFrame=0;
    function align() {
      const width=stage.clientWidth,height=stage.clientHeight;
      if(!width||!height||!photo.naturalWidth) return;
      const scale=Math.max(width/photo.naturalWidth,height/photo.naturalHeight);
      const cs=getComputedStyle(stage);
      const position=v=>{
        if(v==='left'||v==='top')return 0;
        if(v==='right'||v==='bottom')return 1;
        if(v?.endsWith('%'))return parseFloat(v)/100;
        return .5;
      };
      const xOffset=(width-photo.naturalWidth*scale)*position(cs.backgroundPositionX);
      const yOffset=(height-photo.naturalHeight*scale)*position(cs.backgroundPositionY);
      data.forEach(w=>{
        const el=w.el;
        el.style.setProperty('left',(xOffset+(w.x-w.rx)*scale)+'px','important');
        el.style.setProperty('top',(yOffset+(w.y-w.ry)*scale)+'px','important');
        el.style.setProperty('width',(w.rx*2*scale)+'px','important');
        el.style.setProperty('height',(w.ry*2*scale)+'px','important');
        el.style.setProperty('aspect-ratio','auto','important');
        el.style.setProperty('transform','none','important');
      });
    }

    function finish() {
      cancelAnimationFrame(anim);
      running=false;
      stage.classList.remove('hero-wheels-spinning','ecomax-v11-spinning');
      data.forEach(w=>{w.rotor.style.transform='rotate(0deg)';});
    }
    function frame(now) {
      if(!running)return;
      const t=Math.max(0,Math.min(1,(now-started)/3250));
      // Quintic ease has continuous acceleration at both ends; an integer
      // number of turns ensures that the wheel finishes at its original pose.
      const ease=t*t*t*(t*(t*6-15)+10);
      const angle=360*FULL_TURNS*ease;
      data.forEach(w=>{w.rotor.style.transform='rotate('+angle.toFixed(2)+'deg)';});
      if(t<1&&!prefersReduced.matches){
        anim=requestAnimationFrame(frame);
      } else finish();
    }
    function spin(event) {
      // Legacy handler must not start the photo-crop effect as well.
      event.preventDefault();
      event.stopImmediatePropagation();
      if(prefersReduced.matches)return;
      finish();
      started=performance.now();
      running=true;
      stage.classList.add('hero-wheels-spinning','ecomax-v11-spinning');
      anim=requestAnimationFrame(frame);
    }
    data.forEach(w=>w.el.addEventListener('click',spin,{capture:true}));
    photo.onload=()=>{
      align();
      stage.classList.add('ecomax-hero-v8','ecomax-wheel-v11');
      stage.dataset.ecomaxWheelV11='ready';
      if(window.ResizeObserver){
        new ResizeObserver(()=>{
          cancelAnimationFrame(resizeFrame);
          resizeFrame=requestAnimationFrame(()=>{if(running)finish();align();});
        }).observe(stage);
      }else{
        window.addEventListener('resize',()=>{
          cancelAnimationFrame(resizeFrame);
          resizeFrame=requestAnimationFrame(()=>{if(running)finish();align();});
        },{passive:true});
      }
    };
    photo.onerror=()=>{
      // Keep the unmodified picture rather than showing a floating rim.
      stage.dataset.ecomaxWheelV11='photo-unavailable';
      data.forEach(w=>w.el.querySelector('.ecomax-v11-wheel-assembly')?.remove());
    };
    prefersReduced.addEventListener?.('change',e=>{if(e.matches)finish();});
  }

  function boot(tries=0) {
    if(document.querySelector('.hero-visual .neon-hero-stage')) return init();
    if(tries<24)requestAnimationFrame(()=>boot(tries+1));
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  else boot();
})();
