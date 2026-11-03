(function () {
  'use strict';

  function init() {
    const catalog = document.querySelector('main');
    if (!catalog || document.getElementById('catalogProductDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'catalogProductDialog';
    dialog.className = 'catalog-product-dialog';
    dialog.setAttribute('aria-labelledby', 'catalogDialogTitle');
    dialog.innerHTML = `
      <div class="catalog-dialog-header"><span>ECOMAX / პროდუქტი ახლოდან</span><button type="button" class="catalog-dialog-close" aria-label="პროდუქტის ფანჯრის დახურვა" autofocus>×</button></div>
      <div class="catalog-dialog-content">
        <div class="catalog-dialog-preview" role="img">
          <div class="catalog-dialog-stage"></div>
          <div class="catalog-zoom-controls" aria-label="პროდუქტის გამოსახულების მასშტაბი">
            <button type="button" class="catalog-zoom-out" aria-label="დაპატარავება">−</button>
            <input type="range" min="80" max="170" value="100" step="5" aria-label="მასშტაბი">
            <output>100%</output>
            <button type="button" class="catalog-zoom-in" aria-label="გადიდება">+</button>
          </div>
        </div>
        <div class="catalog-dialog-info">
          <h2 id="catalogDialogTitle"></h2><p class="catalog-dialog-english" lang="en"></p>
          <p class="catalog-dialog-description"></p>
          <div class="catalog-dialog-fact"><span></span><strong></strong></div>
          <label for="catalogDialogVolume">აირჩიე მოცულობა</label>
          <select id="catalogDialogVolume" class="catalog-dialog-volume"></select>
          <div class="catalog-dialog-price-row"><strong class="catalog-dialog-price"></strong><span class="catalog-dialog-unit"></span></div>
          <button type="button" class="catalog-dialog-add">კალათაში დამატება →</button>
          <p class="catalog-dialog-hint">მოცულობის შეცვლისას შეფუთვა და ფასი ავტომატურად განახლდება.</p>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    let activeCard = null, opener = null, previousOverflow = '';
    const volume = dialog.querySelector('select');
    const preview = dialog.querySelector('.catalog-dialog-preview');
    const stage = dialog.querySelector('.catalog-dialog-stage');
    const zoom = dialog.querySelector('.catalog-zoom-controls input');
    const zoomOutput = dialog.querySelector('.catalog-zoom-controls output');

    function close() {
      if (!dialog.open) return;
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    }

    function applyZoom(value) {
      const normalized = Math.max(80, Math.min(170, Number(value) || 100));
      zoom.value = String(normalized);
      zoomOutput.value = `${normalized}%`;
      stage.style.setProperty('--catalog-zoom', String(normalized / 100));
    }

    function refresh() {
      if (!activeCard) return;
      const source = activeCard.querySelector('.ecomax-package-art') || activeCard.querySelector('.product-bottle, .ecomax-chamois-pack, .winso-perfume-bottle, .airbag-pack');
      if (!source) return;
      const art = source.cloneNode(true);
      const ids = new Map();
      art.querySelectorAll('[id]').forEach(node => {
        const oldId = node.id;
        node.id = `${oldId}-detail`;
        ids.set(oldId, node.id);
      });
      art.querySelectorAll('*').forEach(node => {
        Array.from(node.attributes).forEach(attribute => {
          if (!attribute.value.includes('url(#')) return;
          let value = attribute.value;
          ids.forEach((replacement, original) => { value = value.replaceAll(`url(#${original})`, `url(#${replacement})`); });
          node.setAttribute(attribute.name, value);
        });
      });
      art.classList.add('catalog-dialog-preview-art');
      stage.replaceChildren(art);
      preview.setAttribute('aria-label', activeCard.querySelector('.product-bottle')?.getAttribute('aria-label') || activeCard.querySelector('h3').textContent.trim());
      dialog.querySelector('.catalog-dialog-price').textContent = activeCard.querySelector('.selected-price').textContent;
      dialog.querySelector('.catalog-dialog-unit').textContent = activeCard.querySelector('.selected-volume').textContent;
      dialog.querySelector('.catalog-dialog-add').disabled = activeCard.querySelector('.add-cart').disabled;
    }

    function open(card, button) {
      activeCard = card;
      opener = button;
      dialog.querySelector('h2').textContent = card.querySelector('h3').textContent.trim();
      dialog.querySelector('.catalog-dialog-english').textContent = Array.from(card.querySelectorAll('.package-label-english')).map(node => node.textContent).join(' ') || card.querySelector('.product-top > span:first-child')?.textContent.trim() || 'PROFESSIONAL SERIES';
      dialog.querySelector('.catalog-dialog-description').textContent = card.querySelector('.product-description')?.textContent.trim() || '';
      dialog.querySelector('.catalog-dialog-fact span').textContent = card.querySelector('.product-info span')?.textContent || '';
      dialog.querySelector('.catalog-dialog-fact strong').textContent = card.querySelector('.product-info b')?.textContent || '';
      const original = card.querySelector('.volume-select');
      const volumeLabel = dialog.querySelector('label[for="catalogDialogVolume"]');
      if (original) {
        volume.replaceChildren(...Array.from(original.options, option => option.cloneNode(true)));
        volume.value = original.value;
        volume.hidden = false; volumeLabel.hidden = false;
      } else {
        volume.replaceChildren(); volume.hidden = true; volumeLabel.hidden = true;
      }
      applyZoom(100);
      refresh();
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }

    volume.addEventListener('change', () => {
      const original = activeCard?.querySelector('.volume-select');
      if (!original) return;
      original.value = volume.value;
      original.dispatchEvent(new Event('change', { bubbles: true }));
      refresh();
    });
    zoom.addEventListener('input', () => applyZoom(zoom.value));
    dialog.querySelector('.catalog-zoom-out').addEventListener('click', () => applyZoom(Number(zoom.value) - 10));
    dialog.querySelector('.catalog-zoom-in').addEventListener('click', () => applyZoom(Number(zoom.value) + 10));
    dialog.querySelector('.catalog-dialog-close').addEventListener('click', close);
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(dialog.querySelectorAll('button:not(:disabled), select:not(:disabled):not([hidden]), input:not(:disabled):not([hidden])'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    });
    dialog.querySelector('.catalog-dialog-add').addEventListener('click', () => {
      const originalButton = activeCard?.querySelector('.add-cart');
      close();
      // Reuse the store's existing capture handlers and cart behavior unchanged.
      originalButton?.click();
    });

    function enhance(card) {
      const visual = card.querySelector('.product-visual');
      if (!visual || visual.querySelector('.catalog-view-button')) return;
      card.classList.add('ecomax-premium-card');
      if (card.querySelector('.ecomax-packaging') && !visual.querySelector('.catalog-ambient-foam')) {
        const foam = document.createElement('span');
        foam.className = 'catalog-ambient-foam';
        foam.setAttribute('aria-hidden', 'true');
        foam.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
        visual.prepend(foam);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'catalog-view-button';
      button.innerHTML = '<span>ახლოდან ნახვა</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg>';
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', dialog.id);
      button.setAttribute('aria-label', `${card.querySelector('h3').textContent.trim()} — ახლოდან ნახვა`);
      visual.appendChild(button);
    }
    catalog.addEventListener('click', event => {
      const button = event.target.closest('.catalog-view-button');
      if (button) open(button.closest('.product-card'), button);
    });
    catalog.querySelectorAll('.product-card').forEach(enhance);
    new MutationObserver(records => {
      const cards = new Set();
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const card = node.closest('.product-card');
        if (card) cards.add(card);
        node.querySelectorAll('.product-card').forEach(child => cards.add(child));
      }));
      cards.forEach(enhance);
    }).observe(catalog, { childList: true, subtree: true });

    const tools = document.querySelector('#products .tools');
    const search = document.getElementById('searchInput');
    const category = document.getElementById('categoryFilter');
    if (!tools || !search || !category) return;
    search.setAttribute('aria-label', 'პროდუქტის ძებნა');
    category.setAttribute('aria-label', 'პროდუქტის კატეგორია');
    const reset = document.createElement('button');
    reset.className = 'catalog-reset'; reset.type = 'button'; reset.textContent = 'გასუფთავება';
    tools.appendChild(reset);
    const results = document.createElement('div');
    results.className = 'catalog-results';
    results.innerHTML = '<p role="status" aria-live="polite"></p><span>შეფუთვისა და ეტიკეტის სანახავად გამოიყენე „ახლოდან ნახვა“</span>';
    tools.after(results);
    const empty = document.createElement('div');
    empty.className = 'catalog-empty'; empty.hidden = true;
    empty.innerHTML = '<h3>პროდუქტი ვერ მოიძებნა</h3><p>სცადე სხვა სიტყვა ან გაასუფთავე ფილტრები.</p>';
    results.after(empty);
    function updateResults() {
      const cards = Array.from(document.querySelectorAll('.product-card'));
      const count = cards.filter(card => getComputedStyle(card).display !== 'none' && !card.hidden).length;
      results.querySelector('p').textContent = `ნაჩვენებია ${count} პროდუქტი`;
      empty.hidden = count !== 0;
      reset.disabled = !search.value && !category.value;
    }
    search.addEventListener('input', updateResults);
    category.addEventListener('change', updateResults);
    reset.addEventListener('click', () => {
      search.value = ''; category.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      category.dispatchEvent(new Event('change', { bubbles: true }));
      search.focus();
    });
    updateResults();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
