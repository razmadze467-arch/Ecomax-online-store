/* ECOMAX ORIGINS V19 — distinct, alternate storefront structure.
   Reorganizes existing functional DOM only. No new products or fake reviews. */
(() => {
  'use strict';
  function init() {
    const products=document.getElementById('products');
    const grid=document.getElementById('productsGrid');
    const tools=document.querySelector('#products .tools');
    const nav=products?.querySelector('.ecmx16-categories');
    if(!products||!grid||!tools||!nav||!document.body)return false;
    if(document.body.classList.contains('ecomax-origins-v19'))return true;

    // V18's sidebar and widget layout is removed; the same functional inputs,
    // category buttons and product nodes are moved to a flat wide retail grid.
    document.body.classList.add('ecomax-origins-v19');
    const hero=document.querySelector('.hero');
    const eyebrow=hero?.querySelector('.eyebrow');
    if(eyebrow)eyebrow.textContent='ECOMAX / AUTOMOTIVE CARE';
    const h1=hero?.querySelector('h1');
    if(h1)h1.innerHTML='სუფთა ზედაპირები.<span>ახალი სტანდარტი.</span>';
    const desc=hero?.querySelector('.hero-description');
    if(desc)desc.textContent='პროფესიონალური ავტოქიმია და მოვლის აქსესუარები — ავტომობილის ყველა დეტალისთვის.';
    const first=hero?.querySelector('.hero-actions .primary');
    if(first)first.textContent='აღმოაჩინე პროდუქცია';
    const second=hero?.querySelector('.hero-actions .secondary');
    if(second){second.textContent='ჩვენ შესახებ';second.href='#about';}

    const oldSidebar=products.querySelector('.ecmx18-sidebar');
    const oldLayout=products.querySelector('.ecmx18-shop-layout');
    const productArea=products.querySelector('.ecmx18-product-area');
    const count=products.querySelector('.ecmx16-count');
    const filters=document.createElement('div');
    filters.className='ecmx19-filters';
    filters.setAttribute('role','group');
    filters.setAttribute('aria-label','პროდუქციის მოძებნა და კატეგორიები');
    filters.appendChild(tools);
    filters.appendChild(nav);
    if(oldLayout)oldLayout.insertAdjacentElement('beforebegin',filters);
    else grid.insertAdjacentElement('beforebegin',filters);
    if(count)filters.insertAdjacentElement('afterend',count);
    if(oldSidebar)oldSidebar.remove();
    if(productArea && productArea.contains(grid)){
      // Keep V18's productArea. It is now full-width through CSS.
    } else if(oldLayout && !oldLayout.contains(grid)) oldLayout.appendChild(grid);

    products.querySelectorAll('.ecmx18-feature-bar').forEach(el=>el.remove());
    document.querySelectorAll('.ecmx18-results').forEach(el=>el.remove());

    const statement=document.createElement('section');
    statement.className='ecmx19-statement';
    statement.innerHTML=[
      '<div><h2>მოვლა, რომელიც ყველა დეტალში იგრძნობა.</h2>',
      '<p>ECOMAX აერთიანებს საწმენდ საშუალებებს, ავტომობილის მოვლის პროდუქტებსა და აქსესუარებს ერთ მარტივ კატალოგში.</p></div>',
      '<a href="#products">პროდუქციის არჩევა →</a>'
    ].join('');
    products.insertAdjacentElement('afterend',statement);

    // Hide legacy effects which polluted previous versions.
    document.querySelectorAll('.site-foam-rails,.section-foam-atmosphere').forEach(el=>el.remove());
    const visual=hero?.querySelector('.neon-hero-stage');
    visual?.querySelectorAll('.hero-photo-motion,.ecmx14-effects,.ecmx15-light-layer,.hero-wheel-control,.neon-car-rig,.neon-car-ground,.neon-product-rack').forEach(el=>el.remove());

    // No product data or shopping event handlers are rebuilt.
    return true;
  }

  function boot(tries=0){
    // V16 and V18 run first. Reflow the existing components once they exist.
    const ready=document.querySelector('#products.ecmx16-unified .ecmx16-categories');
    if(ready && init())return;
    if(tries<90)requestAnimationFrame(()=>boot(tries+1));
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
  else boot();
})();
