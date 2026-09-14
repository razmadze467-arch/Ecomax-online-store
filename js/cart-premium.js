/* ECOMAX — Premium cart layer */
(function(){
  'use strict';
  if(window.__ECOMAX_CART_PREMIUM__) return;
  window.__ECOMAX_CART_PREMIUM__=true;

  const css=`
  #cartOverlay .cart-item{position:relative;display:grid!important;grid-template-columns:1fr auto auto;align-items:center;gap:12px;padding:16px 0!important;border-bottom:1px solid rgba(0,234,255,.10)!important}
  #cartOverlay .cart-item-info{min-width:0;display:flex;flex-direction:column;gap:5px}
  #cartOverlay .cart-item-info strong{color:#f2fbff;line-height:1.35}
  #cartOverlay .cart-item-info span{color:#78a6b5;font-size:12px}
  #cartOverlay .cart-item-price{font-weight:900;color:#00eaff;white-space:nowrap}
  #cartOverlay .remove-item{width:32px!important;height:32px!important;border-radius:9px!important;border:1px solid rgba(255,80,120,.20)!important;background:rgba(255,80,120,.06)!important;color:#ff8aa5!important;cursor:pointer;transition:.2s!important}
  #cartOverlay .remove-item:hover{transform:scale(1.06);border-color:rgba(255,80,120,.5)!important}
  .mx-cart-qty{display:inline-flex;align-items:center;gap:5px;margin-top:5px}
  .mx-cart-qty button{width:28px;height:28px;border-radius:8px;border:1px solid rgba(0,234,255,.25);background:rgba(0,234,255,.05);color:#00eaff;cursor:pointer;font-weight:900;line-height:1}
  .mx-cart-qty button:hover{background:rgba(0,234,255,.13)}
  .mx-cart-qty b{min-width:24px;text-align:center;color:#fff;font-size:13px}
  #cartOverlay .empty-cart{text-align:center;padding:42px 18px!important;color:#7891a1}
  #cartOverlay .empty-cart>div{font-size:48px;filter:drop-shadow(0 0 18px rgba(0,234,255,.25))}
  @media(max-width:600px){
    #cartOverlay{padding:0!important}
    #cartOverlay>*{max-height:100dvh}
    #cartOverlay .cart-item{grid-template-columns:1fr auto!important;gap:8px!important}
    #cartOverlay .cart-item-price{grid-column:2;grid-row:1;align-self:start}
    #cartOverlay .remove-item{grid-column:2;grid-row:2;justify-self:end}
    .mx-cart-qty{grid-column:1;grid-row:2}
  }
  `;
  const style=document.createElement('style');style.id='ecomaxCartPremiumCss';style.textContent=css;document.head.appendChild(style);

  function read(){
    try{const x=JSON.parse(localStorage.getItem('ecomax_cart')||'[]');return Array.isArray(x)?x:[];}catch(e){return []}
  }
  function write(items){localStorage.setItem('ecomax_cart',JSON.stringify(items));}
  function refresh(){
    if(typeof window.updateCart==='function') window.updateCart();
    else if(typeof window.renderCart==='function') window.renderCart();
    const overlay=document.getElementById('cartOverlay');
    if(overlay) decorate(overlay);
  }
  function change(index,delta){
    const items=read();
    if(!items[index]) return;
    items[index].quantity=Math.max(1,Number(items[index].quantity||1)+delta);
    write(items);refresh();
  }
  function decorate(root){
    root.querySelectorAll('.cart-item').forEach((row,index)=>{
      if(row.querySelector('.mx-cart-qty')) return;
      const info=row.querySelector('.cart-item-info');
      if(!info) return;
      const items=read();
      const qty=Number(items[index]?.quantity||1);
      const box=document.createElement('div');
      box.className='mx-cart-qty';
      box.innerHTML='<button type="button" data-mx-cart-minus aria-label="შემცირება">−</button><b>'+qty+'</b><button type="button" data-mx-cart-plus aria-label="გაზრდა">+</button>';
      box.querySelector('[data-mx-cart-minus]').onclick=()=>change(index,-1);
      box.querySelector('[data-mx-cart-plus]').onclick=()=>change(index,1);
      info.appendChild(box);
    });
  }
  function install(){
    const original=window.renderCart;
    if(typeof original==='function'&&!original.__mxWrapped){
      const wrapped=function(){const r=original.apply(this,arguments);setTimeout(()=>decorate(document.getElementById('cartOverlay')||document),0);return r};
      wrapped.__mxWrapped=true;
      window.renderCart=wrapped;
    }
    const overlay=document.getElementById('cartOverlay');
    if(overlay) decorate(overlay);
    if(typeof window.openCart==='function'&&!window.openCart.__mxWrapped){
      const originalOpen=window.openCart;
      const wrappedOpen=function(){const r=originalOpen.apply(this,arguments);setTimeout(()=>decorate(document.getElementById('cartOverlay')||document),20);return r};
      wrappedOpen.__mxWrapped=true;window.openCart=wrappedOpen;
    }
    return !!(window.renderCart||window.openCart);
  }
  function wait(){if(!install())setTimeout(wait,100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
