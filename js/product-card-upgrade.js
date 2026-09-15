// ECOMAX — professional product card finishing layer
(function(){
  'use strict';
  if(window.__ECOMAX_CARD_UPGRADE__) return;
  window.__ECOMAX_CARD_UPGRADE__=true;

  const style=document.createElement('style');
  style.id='ecomaxProductCardUpgradeCss';
  style.textContent=`
    .pro-product-card{display:flex!important;flex-direction:column!important}
    .pro-product-card .pc-top{min-height:22px}
    .pro-product-card h3{letter-spacing:-.25px}
    .pro-product-card .pc-desc{font-size:13px!important}
    .pro-product-card .pc-buy{margin-top:auto!important}
    .pro-product-card .volume-select{width:100%!important;cursor:pointer}
    .pro-product-card .add-cart{width:100%!important;cursor:pointer;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important}
    .ecomax-buy-caption{display:flex;justify-content:space-between;align-items:center;margin:8px 1px 0;color:#718893;font-size:9px;font-weight:800;letter-spacing:.7px}
    .ecomax-buy-caption strong{color:var(--card-accent);font-size:10px}
    .ecomax-card-stock{display:inline-flex;align-items:center;gap:5px;margin-left:7px;color:#8ea6b1;font-size:8px;font-weight:900;letter-spacing:.7px}
    .ecomax-card-stock::before{content:"";width:5px;height:5px;border-radius:50%;background:#4cff91;box-shadow:0 0 8px #4cff91}
    @media(max-width:700px){.ecomax-buy-caption{font-size:8px}.ecomax-card-stock{font-size:7px}}
  `;
  document.head.appendChild(style);

  function enhance(){
    document.querySelectorAll('.pro-product-card').forEach(card=>{
      const buy=card.querySelector('.pc-buy');
      if(!buy || buy.querySelector('.ecomax-buy-caption')) return;
      const select=buy.querySelector('.volume-select');
      const button=buy.querySelector('.add-cart');
      if(!select || !button) return;
      const row=document.createElement('div');
      row.className='ecomax-buy-caption';
      row.innerHTML='<span>აირჩიე მოცულობა</span><strong>ECOMAX • ORIGINAL</strong>';
      select.insertAdjacentElement('afterend',row);
      const stock=document.createElement('span');
      stock.className='ecomax-card-stock';
      stock.textContent='მარაგშია';
      const top=card.querySelector('.pc-top');
      if(top && !top.querySelector('.ecomax-card-stock')) top.appendChild(stock);
      if(!button.dataset.ecomaxEnhanced){
        button.dataset.ecomaxEnhanced='1';
        const text=(button.textContent||'').trim();
        if(text && !/🛒/.test(text)) button.innerHTML='<span aria-hidden="true">🛒</span><span>'+text+'</span>';
      }
    });
  }
  function start(){enhance();setTimeout(enhance,500);setTimeout(enhance,1500);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
})();
