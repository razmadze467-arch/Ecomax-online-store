/* ECOMAX — fast product search layer */
(function(){
  'use strict';
  if(window.__ECOMAX_STORE_SEARCH__) return;
  window.__ECOMAX_STORE_SEARCH__=true;

  const css=document.createElement('style');
  css.id='ecomaxStoreSearchCss';
  css.textContent=`
    .store-search{display:flex;align-items:center;gap:10px;min-width:260px;flex:1}
    .store-search input{width:100%;padding:12px 14px;border:1px solid rgba(0,234,255,.18);border-radius:10px;background:rgba(2,12,22,.82);color:#eafaff;outline:none;font-size:13px;transition:.2s}
    .store-search input::placeholder{color:#627d8c}
    .store-search input:focus{border-color:rgba(0,234,255,.55);box-shadow:0 0 0 3px rgba(0,234,255,.06),0 0 24px rgba(0,234,255,.07)}
    .store-search-clear{display:none;border:0;background:transparent;color:#7895a4;cursor:pointer;font-size:18px;margin-left:-42px;padding:8px}
    .store-search-clear.active{display:block}
    .store-search-hidden{display:none!important}
    @media(max-width:650px){.store-toolbar{display:flex!important;flex-direction:column!important;align-items:stretch!important}.store-search{min-width:0;width:100%;order:-1}.store-search input{font-size:14px;padding:13px 14px}}
  `;
  document.head.appendChild(css);

  const cards=()=>[...document.querySelectorAll('#productsGrid .product-card')];
  const text=c=>(c.textContent||'').toLocaleLowerCase('ka-GE');
  let input=null,clear=null;

  function visibleCount(){
    const n=cards().filter(c=>!c.classList.contains('store-hidden')&&!c.classList.contains('store-search-hidden')).length;
    const out=document.getElementById('storeResultCount');
    if(out) out.textContent=' • '+n+' პროდუქტი';
  }

  function apply(){
    const q=(input?.value||'').trim().toLocaleLowerCase('ka-GE');
    cards().forEach(c=>c.classList.toggle('store-search-hidden',!!q&&!text(c).includes(q)));
    if(clear)clear.classList.toggle('active',!!q);
    visibleCount();
  }

  function install(){
    const toolbar=document.querySelector('.store-toolbar');
    const grid=document.getElementById('productsGrid');
    if(!toolbar||!grid||!cards().length) return false;
    if(toolbar.querySelector('.store-search')) return true;

    const box=document.createElement('div');
    box.className='store-search';
    box.innerHTML='<input id="ecomaxProductSearch" type="search" autocomplete="off" placeholder="🔎 მოძებნე პროდუქტი..." aria-label="პროდუქტის ძებნა"><button class="store-search-clear" type="button" aria-label="ძებნის გასუფთავება">×</button>';
    toolbar.prepend(box);
    input=box.querySelector('input');
    clear=box.querySelector('button');
    input.addEventListener('input',apply);
    clear.addEventListener('click',()=>{input.value='';input.focus();apply();});

    toolbar.querySelector('#storeSort')?.addEventListener('change',()=>setTimeout(visibleCount,0));
    toolbar.closest('.products-section')?.querySelectorAll('.store-category-chip,.store-sidebar-item').forEach(b=>b.addEventListener('click',()=>setTimeout(visibleCount,0)));
    visibleCount();
    return true;
  }

  function wait(){if(!install())setTimeout(wait,150);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
