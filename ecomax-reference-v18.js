/* ECOMAX V18: functional layout reproducing the approved reference.
   Reuses actual product nodes and their existing shopping controls. */
(() => {
 'use strict';
 function init(){
  const hero=document.querySelector('.hero'),catalogue=document.getElementById('products');
  const grid=document.getElementById('productsGrid'),tools=catalogue?.querySelector('.tools');
  if(!hero||!catalogue||!grid||!tools||catalogue.dataset.ecomaxReferenceV18)return false;
  if(!catalogue.classList.contains('ecmx16-unified'))return false;
  catalogue.dataset.ecomaxReferenceV18='ready';
  const categoryHeading=document.querySelector('.neon-category-head h2');
  if(categoryHeading)categoryHeading.textContent='აირჩიე შენი ავტომობილის მოვლის პროდუქცია';
  const eyebrow=hero.querySelector('.eyebrow');
  if(eyebrow)eyebrow.textContent='PREMIUM AUTO CARE STORE  •  LVL-CHEMICAL';
  const description=hero.querySelector('.hero-description');
  if(description)description.textContent='პროფესიონალური ავტოქიმია, დეტეილინგის პროდუქტები და ავტომობილის მოვლის სრული ასორტიმენტი ერთ მაღაზიაში.';
  const secondary=hero.querySelector('.hero-actions .secondary');
  if(secondary){secondary.href='#products';secondary.textContent='ECOMAX LINE';}
  const categoryNav=catalogue.querySelector('.ecmx16-categories');
  const count=catalogue.querySelector('.ecmx16-count');
  const layout=document.createElement('div');
  layout.className='ecmx18-shop-layout';
  const sidebar=document.createElement('aside');
  sidebar.className='ecmx18-sidebar';
  sidebar.setAttribute('aria-label','პროდუქტების ფილტრები');
  const sidebarTitle=document.createElement('h3');
  sidebarTitle.textContent='კატალოგის ფილტრები';
  sidebar.appendChild(sidebarTitle);
  sidebar.appendChild(tools);
  if(categoryNav)sidebar.appendChild(categoryNav);
  if(count)sidebar.appendChild(count);
  const productArea=document.createElement('div');
  productArea.className='ecmx18-product-area';
  const featured=document.createElement('div');
  featured.className='ecmx18-feature-bar';
  const label=document.createElement('strong');
  label.textContent='პროდუქციის კატალოგი';
  const helper=document.createElement('span');
  helper.textContent='ყველა პროდუქტი';
  featured.append(label,helper);
  productArea.append(featured,grid);
  layout.append(sidebar,productArea);
  catalogue.appendChild(layout);
  function showCount(){
   const visible=Array.from(grid.querySelectorAll('.product-card')).filter(card=>!card.hidden&&getComputedStyle(card).display!=='none').length;
   helper.textContent=visible+' პროდუქტი';
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(showCount));
  observer.observe(grid,{subtree:true,attributes:true,attributeFilter:['hidden','style']});
  showCount();
  const search=document.getElementById('searchInput'),select=document.getElementById('categoryFilter');
  search?.addEventListener('input',()=>requestAnimationFrame(showCount));
  select?.addEventListener('change',()=>requestAnimationFrame(showCount));
  const results=document.createElement('section');
  results.className='ecmx18-results';
  results.setAttribute('aria-label','ECOMAX პროფესიონალური მოვლა');
  results.innerHTML=[
   '<div class="ecmx18-results-text">',
   '<span class="ecmx18-label">ECOMAX • პროფესიონალური მოვლა</span>',
   '<h2>რეალური მოვლა, რასაც ამჩნევ.</h2>',
   '<p>ავტომობილის ზედაპირების წმენდისა და მოვლის პროდუქცია — ექსტერიერიდან სალონამდე.</p>',
   '<a class="ecmx18-results-cta" href="#products">პროდუქციის ნახვა →</a>',
   '</div>',
   '<div class="ecmx18-results-image" role="img" aria-label="ავტომობილის დეტეილინგი და ქაფიანი წმენდა"></div>',
   '<div class="ecmx18-benefits">',
   '<p><b>✦</b><span>პროფესიონალური მოვლის არჩევანი</span></p>',
   '<p><b>◇</b><span>ავტოქიმია და აქსესუარები ერთ სივრცეში</span></p>',
   '<p><b>✓</b><span>პროდუქციის მარტივი შერჩევა</span></p>',
   '</div>'
  ].join('');
  catalogue.insertAdjacentElement('afterend',results);
  return true;
 }
 function boot(attempt=0){if(init()||attempt>=80)return;requestAnimationFrame(()=>boot(attempt+1));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});
 else boot();
})();
