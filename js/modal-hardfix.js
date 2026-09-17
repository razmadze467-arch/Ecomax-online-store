/* ECOMAX — hard guard for product modal */
(function(){
  'use strict';
  if(window.__ECOMAX_MODAL_HARDFIX_V1__) return;
  window.__ECOMAX_MODAL_HARDFIX_V1__=true;

  function modal(){return document.getElementById('ecomaxStoreModal');}
  function hide(){
    const m=modal();
    if(!m)return;
    m.classList.remove('active');
    m.setAttribute('aria-hidden','true');
    m.style.setProperty('display','none','important');
    m.style.setProperty('visibility','hidden','important');
    m.style.setProperty('opacity','0','important');
    m.style.setProperty('pointer-events','none','important');
    if(document.body)document.body.style.overflow='';
  }
  function show(){
    const m=modal();
    if(!m)return;
    m.classList.add('active','ecomax-user-modal-open');
    m.removeAttribute('aria-hidden');
    m.style.setProperty('display','flex','important');
    m.style.setProperty('visibility','visible','important');
    m.style.setProperty('opacity','1','important');
    m.style.setProperty('pointer-events','auto','important');
    m.style.setProperty('z-index','100000','important');
    if(document.body)document.body.style.overflow='hidden';
  }

  const style=document.createElement('style');
  style.id='ecomax-modal-hardfix-css';
  style.textContent='#ecomaxStoreModal:not(.ecomax-user-modal-open){display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}#ecomaxStoreModal.ecomax-user-modal-open{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:100000!important;}';
  (document.head||document.documentElement).appendChild(style);

  function install(){
    hide();
    document.addEventListener('click',function(e){
      const t=e.target;
      if(!t||!t.closest)return;
      const close=t.closest('.store-modal-close,[data-store-modal-close],#storeModalClose');
      if(close){e.preventDefault();e.stopPropagation();hide();return;}
      const detail=t.closest('.store-detail-btn');
      if(detail){setTimeout(show,0);return;}
      const m=modal();
      if(m&&t===m){e.preventDefault();e.stopPropagation();hide();}
    },true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')hide();},true);
    let n=0;
    const timer=setInterval(function(){
      n++;
      const m=modal();
      if(m&&!m.classList.contains('ecomax-user-modal-open'))hide();
      if(n>80)clearInterval(timer);
    },250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
