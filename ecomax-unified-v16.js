/* ECOMAX V16 — One continuous catalog instead of fragmented collections.
   Moves existing DOM cards; never clones or changes product prices, names or cart actions.
   Preserve anchor navigation and existing text-search / category-filter behavior. */
(() => {
  'use strict';
  const SOURCES = ['home-care', 'sprays', 'accessories', 'fragrances'];
  const LABELS = [
    ['all', 'ყველა პროდუქტი'],
    ['auto', 'ავტოქიმია'],
    ['home', 'სახლის ქიმია'],
    ['spray', 'სპრეები'],
    ['accessories', 'აქსესუარები'],
    ['fragrance', 'არომატიზატორები']
  ];
  const SPECIAL = new Set(['home','spray','accessories','fragrance']);

  function init() {
    const section=document.getElementById('products');
    const grid=document.getElementById('productsGrid');
    const search=document.getElementById('searchInput');
    const select=document.getElementById('categoryFilter');
    if(!section || !grid || !search || !select || section.dataset.ecmxUnifiedV16)return;
    section.dataset.ecmxUnifiedV16='true';
    section.classList.add('ecmx16-unified');

    // Keep all existing product-card nodes and listeners intact.
    for (const id of SOURCES) {
      const source=document.getElementById(id);
      if (!source || source===section)continue;
      const cards=Array.from(source.querySelectorAll('.product-card'));
      if (!cards.length)continue;
      const anchor=document.createElement('span');
      anchor.id=id;
      anchor.className='ecmx16-anchor';
      anchor.style.position='absolute';
      anchor.style.top='0';
      anchor.style.pointerEvents='none';
      anchor.setAttribute('aria-hidden','true');
      source.id='ecmx16-original-'+id;
      grid.appendChild(anchor);
      for (const card of cards) {
        if (id==='fragrances')card.dataset.category='fragrance';
        grid.appendChild(card);
      }
      source.classList.add('ecmx16-merged-source');
      source.hidden=true;
    }

    if (!select.querySelector('option[value="fragrance"]')) {
      const option=document.createElement('option');
      option.value='fragrance';option.textContent='არომატიზატორები';
      select.appendChild(option);
    }

    const cards=Array.from(grid.querySelectorAll('.product-card'));
    // Filter buttons sit above a single responsive grid, not above separate sections.
    const categoryBar=document.createElement('nav');
    categoryBar.className='ecmx16-categories';
    categoryBar.setAttribute('aria-label','პროდუქციის კატეგორიები');
    let activeGroup='all';
    const controls=new Map();
    for (const [key,label] of LABELS) {
      const button=document.createElement('button');
      button.type='button';
      button.dataset.group=key;
      button.textContent=label;
      button.setAttribute('aria-pressed',key==='all'?'true':'false');
      categoryBar.appendChild(button);
      controls.set(key,button);
    }
    const tools=section.querySelector('.tools');
    if (tools)tools.insertAdjacentElement('afterend',categoryBar);
    else grid.insertAdjacentElement('beforebegin',categoryBar);

    const counter=document.createElement('p');
    counter.className='ecmx16-count';
    counter.setAttribute('aria-live','polite');
    categoryBar.insertAdjacentElement('afterend',counter);

    function refresh() {
      const query=search.value.trim().toLocaleLowerCase();
      const selected=select.value;
      let count=0;
      for(const card of cards) {
        const category=card.dataset.category || '';
        const body=(card.dataset.search || '')+' '+(card.querySelector('h3')?.textContent||'');
        const matchText=!query||body.toLocaleLowerCase().includes(query);
        const matchDropdown=!selected||selected===category;
        const matchGroup=activeGroup==='all'||
          (activeGroup==='auto' ? !SPECIAL.has(category) : category===activeGroup);
        const visible=matchText&&matchDropdown&&matchGroup;
        card.hidden=!visible;
        // Existing handlers toggle display: use a final explicit state without
        // overwriting the native search/filter inputs.
        card.style.setProperty('display',visible?'flex':'none','important');
        if(visible)count++;
      }
      counter.textContent=count+' პროდუქტი';
      for(const [key,button] of controls)
        button.setAttribute('aria-pressed',String(activeGroup===key));
    }

    categoryBar.addEventListener('click',event=>{
      const btn=event.target.closest('button[data-group]');
      if(!btn)return;
      activeGroup=btn.dataset.group;
      // Buttons and dropdown are alternative ways to filter, not cumulative.
      select.value='';
      refresh();
    });
    // Existing page listeners may also update inline display; our event handlers
    // are registered afterward and restore a single consistent final state.
    search.addEventListener('input',refresh);
    select.addEventListener('change',()=>{
      activeGroup='all';
      refresh();
    });
    refresh();

    // Subtle foam bubbles are backdrop decoration only; no fake bubbles on
    // product packs, controls or photographs.
    const bubbles=document.createElement('div');
    bubbles.className='ecmx16-bubble-field';
    bubbles.setAttribute('aria-hidden','true');
    const total=22;
    for(let i=0;i<total;i++){
      const bubble=document.createElement('i');
      bubble.className='ecmx16-bubble';
      const x=(9+i*37)%99;
      const y=(4+i*19)%91;
      const size=9+(i*11)%27;
      bubble.style.setProperty('--bubble-x',x+'%');
      bubble.style.setProperty('--bubble-y',y+'%');
      bubble.style.setProperty('--bubble-size',size+'px');
      bubble.style.setProperty('--bubble-speed',(6.5+(i%6)*.7)+'s');
      bubble.style.setProperty('--bubble-delay',(-i*.61)+'s');
      bubble.style.setProperty('--bubble-opacity',(.14+(i%5)*.035).toFixed(3));
      bubbles.appendChild(bubble);
    }
    section.prepend(bubbles);
  }

  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
