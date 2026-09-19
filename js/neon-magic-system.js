/* ECOMAX MAGIC NEON SYSTEM — lightweight visual/UX layer */
(function(){
'use strict';
if(window.__ECOMAX_MAGIC_SYSTEM__)return;
window.__ECOMAX_MAGIC_SYSTEM__=true;

const css=document.createElement('style');
css.id='ecomax-magic-system';
css.textContent=`
:root{--mx-c:#00f6ff;--mx-v:#7b4dff;--mx-p:#ff25d9;--mx-g:#42ff9b}
.ecomax-mx-progress{position:fixed;left:0;top:0;width:100%;height:2px;z-index:100000;pointer-events:none;transform-origin:left;background:linear-gradient(90deg,var(--mx-c),var(--mx-v),var(--mx-p),var(--mx-c));box-shadow:0 0 8px var(--mx-c),0 0 20px var(--mx-v);transform:scaleX(0)}
.ecomax-mx-status{position:fixed;right:10px;bottom:10px;z-index:99990;padding:7px 10px;border:1px solid rgba(0,246,255,.35);border-radius:99px;background:rgba(2,9,16,.9);color:#a9f7ff;font:900 7px Arial;letter-spacing:1.2px;box-shadow:0 0 18px rgba(0,246,255,.12);pointer-events:none}
.ecomax-mx-status i{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--mx-g);box-shadow:0 0 9px var(--mx-g);margin-right:5px}
.ecomax-mx-dock{position:fixed;left:10px;bottom:10px;z-index:99990;display:flex;gap:5px;padding:5px;border:1px solid rgba(0,246,255,.25);border-radius:12px;background:rgba(2,9,16,.9);box-shadow:0 0 22px rgba(0,246,255,.12)}
.ecomax-mx-dock button{height:28px;min-width:34px;padding:0 7px!important;border-radius:8px!important;font:900 7px Arial!important;color:#dfffff!important}
.ecomax-mx-dock button.active{background:rgba(0,246,255,.15)!important;border-color:#00f6ff!important;box-shadow:0 0 15px rgba(0,246,255,.3)!important}
.product-card.mx-live{border-color:rgba(0,246,255,.8)!important;box-shadow:0 0 0 1px rgba(0,246,255,.1),0 0 25px rgba(0,246,255,.2),0 0 55px rgba(123,77,255,.12),inset 0 0 25px rgba(0,246,255,.05)!important}
.product-card.mx-flash{animation:mxFlash .55s ease}
@keyframes mxFlash{45%{box-shadow:0 0 30px rgba(0,246,255,.65),0 0 60px rgba(255,37,217,.25)}}
.ecomax-mx-label{position:absolute;left:8px;right:8px;bottom:7px;z-index:50;display:flex;align-items:center;justify-content:center;gap:5px;padding:4px 6px;border:1px solid var(--mx-a,#00f6ff);border-radius:7px;background:rgba(2,10,17,.9);color:#fff;font:900 7px Arial;letter-spacing:.5px;pointer-events:none;box-shadow:0 0 10px color-mix(in srgb,var(--mx-a,#00f6ff) 35%,transparent)}
.ecomax-mx-label svg{width:14px;height:14px;color:var(--mx-a,#00f6ff);filter:drop-shadow(0 0 5px currentColor)}
.ecomax-mx-label svg *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ecomax-mx-hud{display:flex;justify-content:space-between;gap:8px;margin:8px 0;padding:7px 9px;border:1px solid rgba(0,246,255,.12);border-radius:8px;background:rgba(0,246,255,.025);font:700 7px Arial;letter-spacing:.7px;color:#7895a3}
.ecomax-mx-hud b{color:#00f6ff;text-shadow:0 0 7px #00f6ff}.ecomax-mx-hud em{font-style:normal;color:#42ff9b}
body.mx-boost .product-card,body.mx-boost .info-card{box-shadow:0 0 0 1px rgba(0,246,255,.1),0 0 25px rgba(0,246,255,.2),0 0 50px rgba(123,77,255,.13),inset 0 0 25px rgba(0,246,255,.05)!important}
body.mx-scan .product-card{animation:mxScan 1s ease}
@keyframes mxScan{45%{filter:brightness(1.15)}}
@media(max-width:600px){.ecomax-mx-status{right:6px;bottom:6px}.ecomax-mx-dock{left:6px;bottom:6px}.ecomax-mx-dock button{min-width:30px}}
`;
document.head.appendChild(css);

const A={
engine:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="6"/><path d="M32 7v10M32 47v10M7 32h10M47 32h10M14 14l7 7M43 43l7 7M50 14l-7 7M21 43l-7 7"/></svg>',
wheel:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="8"/><path d="M32 9v15M32 40v15M9 32h15M40 32h15"/></svg>',
radiator:'<svg viewBox="0 0 64 64"><rect x="12" y="13" width="40" height="38" rx="3"/><path d="M20 17v30M28 17v30M36 17v30M44 17v30"/></svg>',
fabric:'<svg viewBox="0 0 64 64"><path d="M13 36h38v12H13zM17 23h12v13H17zM35 23h12v13H35zM18 48l-3 8M46 48l3 8"/></svg>',
leather:'<svg viewBox="0 0 64 64"><path d="M17 53V25l10-10h12l8 9v16l6 13M17 39h30M27 15v15"/></svg>',
tire:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="9"/><path d="M18 18l9 9M46 18l-9 9M18 46l9-9M46 46l-9-9"/></svg>',
dashboard:'<svg viewBox="0 0 64 64"><path d="M11 41a21 21 0 0 1 42 0M32 41l11-13M20 46h24"/></svg>',
conditioner:'<svg viewBox="0 0 64 64"><path d="M32 8C22 21 15 28 15 39a17 17 0 0 0 34 0C49 28 42 21 32 8z"/></svg>',
foam:'<svg viewBox="0 0 64 64"><circle cx="21" cy="40" r="10"/><circle cx="36" cy="27" r="13"/><circle cx="48" cy="41" r="8"/></svg>',
candle:'<svg viewBox="0 0 64 64"><rect x="22" y="28" width="20" height="25" rx="3"/><path d="M32 28v-8M32 8c-5 7 3 10 0 13"/></svg>',
perfume:'<svg viewBox="0 0 64 64"><rect x="18" y="25" width="28" height="28" rx="5"/><rect x="25" y="16" width="14" height="9" rx="2"/></svg>',
phosphor:'<svg viewBox="0 0 64 64"><path d="M32 7l4 17 16 8-16 8-4 17-4-17-16-8 16-8z"/></svg>',
rust:'<svg viewBox="0 0 64 64"><path d="M30 7L15 34h14l-4 23 24-31H36l7-19z"/></svg>',
tar:'<svg viewBox="0 0 64 64"><path d="M32 8c-8 11-15 18-15 28a15 15 0 0 0 30 0c0-10-7-17-15-28z"/><path d="M13 55h38"/></svg>',
plastic:'<svg viewBox="0 0 64 64"><path d="M20 18h24l4 35H16z"/><path d="M24 18v-7h16v7"/></svg>'
};
const T=[
['ძრავის','engine','ENGINE WASH','engine','#ff2638'],['დისკების','wheel','WHEEL CLEANER','wheel','#00f6ff'],['რადიატორის','radiator','RADIATOR CLEANER','radiator','#ff405c'],['ნაჭრის','fabric','FABRIC CLEANING','fabric','#35cfff'],['ტყავის ქიმ','leather','LEATHER CLEANING','leather','#ffd21f'],['საბურ','tire','TIRE POLISH','tire','#ff2638'],['ტორპედოს','dashboard','DASHBOARD POLISH','dashboard','#00f6ff'],['ტყავის მკვებ','conditioner','LEATHER CONDITIONER','conditioner','#ff65b8'],['პლასტმას','plastic','PLASTIC BLACKENER','plastic','#ff2638'],['ქაფი','foam','CAR WASH FOAM','foam','#7b4dff'],['სანთ','candle','CANDLE','candle','#c77cff'],['პარფ','perfume','PERFUME','perfume','#ff65b8'],['ფოსფორ','phosphor','PHOSPHOR','phosphor','#42ff9b'],['ჟანგ','rust','RUST REMOVER','rust','#ff405c'],['ცემენტ','tar','CEMENT / TAR','tar','#c77cff'],['ტარის','tar','CEMENT / TAR','tar','#c77cff']
];
function type(card){const s=(card.textContent||'').toLowerCase();if(s.includes('ქაფ')||s.includes('foam'))return T[9];return T.find(x=>s.includes(x[0])||s.includes(x[1]))||T[0]}
function apply(){
document.querySelectorAll('#productsGrid .product-card').forEach(card=>{
const x=type(card),color=x[4];card.style.setProperty('--mx-a',color);
const bottle=card.querySelector('.product-bottle'),label=card.querySelector('.product-label');
if(bottle){bottle.setAttribute('aria-label','ECOMAX — '+x[2]);bottle.title='ECOMAX — '+x[2];let a=bottle.querySelector('.mx-bottle-art');if(!a){a=document.createElement('div');a.className='mx-bottle-art';bottle.appendChild(a)}a.innerHTML=A[x[3]]||A.engine;a.style.cssText='position:absolute;left:50%;bottom:8px;transform:translateX(-50%);width:24px;height:24px;color:'+color+';opacity:.8;z-index:30;filter:drop-shadow(0 0 7px '+color+');pointer-events:none';a.querySelectorAll('svg *').forEach(e=>{e.style.fill='none';e.style.stroke='currentColor';e.style.strokeWidth='2.2'})}
if(label){let la=label.querySelector('.mx-label-art');if(!la){la=document.createElement('div');la.className='mx-label-art';label.appendChild(la)}la.innerHTML=A[x[3]]||A.engine;la.style.cssText='position:absolute;inset:7px;display:grid;place-items:center;color:'+color+';opacity:.14;z-index:1;pointer-events:none';la.querySelectorAll('svg *').forEach(e=>{e.style.fill='none';e.style.stroke='currentColor';e.style.strokeWidth='1.6'});let brand=label.querySelector('.mx-brand');if(!brand){brand=document.createElement('div');brand.className='mx-brand';label.appendChild(brand)}brand.textContent='ECOMAX // LEVEL CHEMICAL';brand.style.cssText='position:absolute;top:5px;left:6px;right:6px;text-align:center;z-index:4;font:900 5px Arial;letter-spacing:.8px;color:'+color+';text-shadow:0 0 7px '+color+';pointer-events:none';let name=label.querySelector('.mx-name');if(!name){name=document.createElement('div');name.className='mx-name';label.appendChild(name)}name.textContent=x[2];name.style.cssText='position:absolute;left:5px;right:5px;top:24px;text-align:center;z-index:4;font:900 7px Arial;letter-spacing:.4px;color:#fff;text-shadow:0 0 6px '+color+',0 0 12px '+color+';pointer-events:none'}
let badge=card.querySelector('.ecomax-mx-label');if(!badge){badge=document.createElement('div');badge.className='ecomax-mx-label';card.appendChild(badge)}badge.style.setProperty('--mx-a',color);badge.innerHTML=(A[x[3]]||A.engine)+'<b>'+x[2]+'</b><span>PRO</span>';
let hud=card.querySelector('.ecomax-mx-hud');if(!hud){hud=document.createElement('div');hud.className='ecomax-mx-hud';const info=card.querySelector('.product-info');if(info)info.parentNode.insertBefore(hud,info)}const d=card.querySelector('.product-info b')?.textContent?.trim()||'PRO FORMULA';hud.innerHTML='<span>FORMULA <b>'+d+'</b></span><em>● READY</em>';
});}
function hud(){
if(!document.querySelector('.ecomax-mx-progress')){const p=document.createElement('div');p.className='ecomax-mx-progress';document.body.appendChild(p);let busy=false;const u=()=>{busy=false;const m=document.documentElement.scrollHeight-innerHeight;p.style.transform='scaleX('+Math.min(1,scrollY/Math.max(1,m))+')'};addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(u)}},{passive:true});u()}
if(!document.querySelector('.ecomax-mx-status')){const s=document.createElement('div');s.className='ecomax-mx-status';s.innerHTML='<i></i> ECOMAX SYSTEM ONLINE';document.body.appendChild(s)}
if(!document.querySelector('.ecomax-mx-dock')){const d=document.createElement('div');d.className='ecomax-mx-dock';d.innerHTML='<button data-m="boost">NEON</button><button data-m="scan">SCAN</button><button data-m="search">⌕</button><button data-m="top">↑</button>';document.body.appendChild(d);d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.m;if(a==='boost'){document.body.classList.toggle('mx-boost');b.classList.toggle('active')}if(a==='scan'){document.body.classList.remove('mx-scan');void document.body.offsetWidth;document.body.classList.add('mx-scan');setTimeout(()=>document.body.classList.remove('mx-scan'),1100)}if(a==='search'){document.getElementById('searchInput')?.focus();document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}if(a==='top')scrollTo({top:0,behavior:'smooth'})})}
}
function init(){apply();hud();setTimeout(apply,300);document.addEventListener('click',e=>{const b=e.target.closest?.('.add-cart');if(!b)return;const c=b.closest('.product-card');if(c){c.classList.add('mx-flash');setTimeout(()=>c.classList.remove('mx-flash'),600)}});document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){e.preventDefault();document.getElementById('searchInput')?.focus()}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
const root=document.getElementById('productsGrid');if(root&&'MutationObserver' in window){let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(apply,180)}).observe(root,{childList:true})}
})();