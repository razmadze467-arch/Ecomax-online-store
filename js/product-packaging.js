(function () {
  'use strict';
  let nextId = 0;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  // Liquid appearance belongs to the packaging, never the product/price data.
  const liquids = [
    { match: /ძრავ|მატორ|engine/i, color: '#ef334e', shadow: '#860b2a' },
    { match: /რადიატორ|radiator/i, color: '#ffd52e', shadow: '#b66b08' },
    { match: /დისკ|ალუმინ|wheel/i, color: '#f4f8fc', shadow: '#a6bdcd', opaque: true },
    { match: /ნაჭრ|fabric/i, color: '#008dbb', shadow: '#03476d' },
    { match: /ტყავის ქიმ|leather clean/i, color: '#ffd52e', shadow: '#b66b08' },
    { match: /საბურავ|tire|tyre/i, color: '#ef334e', shadow: '#860b2a' },
    { match: /ფოსფორ|phosphor/i, color: '#4ce67c', shadow: '#087449' },
    { match: /ტყავის მკვებ|leather condition/i, color: '#f472b6', shadow: '#a92c76' },
    { match: /ტორპედო|dashboard/i, color: '#f4f8fc', shadow: '#a6bdcd', opaque: true },
    { match: /ქაფი.*წითელ/i, color: '#ef334e', shadow: '#860b2a' },
    { match: /ქაფი.*ლურჯ/i, color: '#63d7f4', shadow: '#147dba' },
    { match: /პლას[ტმ]მას|პლასმას|plastic/i, color: '#465465', shadow: '#172531' }
  ];

  function liquidFor(name) {
    return liquids.find(liquid => liquid.match.test(name)) ||
      { color: '#bcecf4', shadow: '#4c93af' };
  }

  // Wrap the existing product name without substituting a separate product catalog.
  function linesFor(name) {
    const lines = [];
    for (const word of name.split(/\s+/)) {
      const last = lines.length - 1;
      if (last >= 0 && (lines[last] + ' ' + word).length <= 17) lines[last] += ' ' + word;
      else lines.push(word);
    }
    return lines;
  }

  function render(card) {
    const select = card.querySelector('.volume-select');
    const bottle = card.querySelector('.product-bottle');
    const heading = card.querySelector('h3');
    // Leave aerosol cans, accessories and products without a volume selector intact.
    if (!select || !bottle || !heading || bottle.classList.contains('ecomax-spray-can')) return;
    const volume = Number(select.value);
    if (!Number.isFinite(volume) || volume <= 0) return;
    const name = heading.textContent.trim();
    const liquid = liquidFor(name);
    const size = `${volume} ლ`;
    const signature = `${name}|${volume}|${liquid.color}`;
    if (bottle.dataset.packagingSignature === signature) return;
    bottle.dataset.packagingSignature = signature;
    const id = `ecomax-package-${++nextId}`;
    const canister = volume >= 2;
    const small = volume === 0.5;
    const labelY = canister ? 115 : 105;
    const nameLines = linesFor(name);
    const lineHeight = Math.min(14, 46 / nameLines.length);
    const body = canister
      ? 'M35 58 Q35 48 47 48 H132 Q143 48 147 64 L160 92 V220 Q160 232 146 232 H34 Q20 232 20 218 V91 Q20 76 35 58 Z M68 62 Q62 62 62 69 V83 Q62 89 69 89 H123 Q130 89 127 81 L122 66 Q121 62 114 62 Z'
      : small
        ? 'M70 65 H110 V80 Q110 88 122 98 Q132 106 132 123 V218 Q132 231 119 231 H61 Q48 231 48 218 V123 Q48 106 58 98 Q70 88 70 80 Z'
        : 'M68 35 H112 V57 Q112 68 127 78 Q142 89 142 109 V218 Q142 232 128 232 H52 Q38 232 38 218 V109 Q38 89 53 78 Q68 68 68 57 Z';
    const capX = canister ? 33 : small ? 66 : 64;
    const capY = canister ? 35 : small ? 51 : 21;
    const labelX = canister ? 36 : small ? 54 : 47;
    const labelWidth = canister ? 108 : small ? 72 : 86;
    const center = 90;
    const liquidY = canister ? 101 : small ? 107 : 88;
    const svg = `<svg class="ecomax-package-art" viewBox="0 0 180 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-plastic" x1="0" x2="1">
          <stop stop-color="#b2d9ee" stop-opacity=".32"/>
          <stop offset=".12" stop-color="#e1f2ff" stop-opacity=".12"/>
          <stop offset=".28" stop-color="#fff" stop-opacity=".25"/>
          <stop offset=".5" stop-color="#e5f3ff" stop-opacity=".02"/>
          <stop offset=".85" stop-color="#93b7d5" stop-opacity=".08"/>
          <stop offset="1" stop-color="#d3edff" stop-opacity=".3"/>
        </linearGradient>
        <linearGradient id="${id}-liquid" x1="0" x2="1">
          <stop stop-color="${liquid.shadow}" stop-opacity=".95"/>
          <stop offset=".22" stop-color="${liquid.color}" stop-opacity="${liquid.opaque ? '.98' : '.85'}"/>
          <stop offset=".58" stop-color="${liquid.color}" stop-opacity="${liquid.opaque ? '.94' : '.66'}"/>
          <stop offset="1" stop-color="${liquid.shadow}" stop-opacity=".95"/>
        </linearGradient>
        <linearGradient id="${id}-depth" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#020d19" stop-opacity="0"/>
          <stop offset="1" stop-color="#020d19" stop-opacity=".24"/>
        </linearGradient>
        <linearGradient id="${id}-cap" x1="0" x2="1">
          <stop stop-color="#102530"/><stop offset=".4" stop-color="#395362"/><stop offset="1" stop-color="#09151d"/>
        </linearGradient>
        <linearGradient id="${id}-label" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#173545"/><stop offset=".5" stop-color="#071923"/><stop offset="1" stop-color="#15223e"/>
        </linearGradient>
        <clipPath id="${id}-body"><path d="${body}" clip-rule="evenodd"/></clipPath>
      </defs>
      <ellipse cx="90" cy="237" rx="64" ry="6" fill="#00eaff" opacity=".1"/>
      <g clip-path="url(#${id}-body)">
        <rect class="package-liquid" x="20" y="${liquidY}" width="140" height="145" fill="url(#${id}-liquid)"/>
        <ellipse cx="90" cy="${liquidY}" rx="72" ry="4" fill="${liquid.color}" opacity=".65"/>
        <rect x="20" y="${liquidY}" width="140" height="145" fill="url(#${id}-depth)"/>
      </g>
      <path d="${body}" fill="url(#${id}-plastic)" fill-rule="evenodd" stroke="#d3edff" stroke-opacity=".65" stroke-width="1.2"/>
      <path d="M${canister ? 29 : small ? 54 : 44} 128 V213 Q${canister ? 29 : small ? 54 : 44} 223 ${canister ? 40 : small ? 65 : 55} 223" fill="none" stroke="#fff" stroke-width="3" opacity=".42"/>
      <path d="${canister ? 'M43 56 H127 M26 217 H154' : small ? 'M75 73 H105 M54 218 H126' : 'M73 45 H107 M44 218 H136'}" fill="none" stroke="#d9f3ff" stroke-width="1.5" opacity=".4"/>
      <rect x="${capX}" y="${capY}" width="52" height="19" rx="4" fill="url(#${id}-cap)" stroke="#78939e"/>
      <path d="M${capX + 5} ${capY + 3}v12 m6 -12v12 m6 -12v12 m6 -12v12 m6 -12v12 m6 -12v12 m6 -12v12" stroke="#a8bdc7" opacity=".3"/>
      <rect x="${labelX}" y="${labelY}" width="${labelWidth}" height="96" rx="5" fill="url(#${id}-label)" stroke="#00d4e5" stroke-opacity=".65"/>
      <path d="M${labelX + 6} ${labelY + 5}h${labelWidth - 12}" stroke="#fff" opacity=".16"/>
      <text x="${center}" y="${labelY + 22}" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="${small ? 13 : 16}" font-weight="900" letter-spacing="1">ECOMAX</text>
      <path d="M${labelX + 10} ${labelY + 30}h${labelWidth - 20}" stroke="${liquid.color}" opacity=".85"/>
      ${nameLines.map((line, index) => `<text class="package-label-text" x="${center}" y="${labelY + 44 + index * lineHeight}" ${line.length > (small ? 11 : 14) ? `textLength="${labelWidth - 12}" lengthAdjust="spacingAndGlyphs"` : ''}>${escape(line)}</text>`).join('')}
      <text x="${center}" y="${labelY + 87}" text-anchor="middle" fill="#86efff" font-family="Arial,sans-serif" font-size="14" font-weight="700">${escape(size)}</text>
    </svg>`;
    bottle.classList.add('ecomax-packaging');
    bottle.dataset.packageShape = canister ? 'canister' : small ? 'bottle-500' : 'bottle-1000';
    bottle.dataset.liquidColor = liquid.color;
    bottle.setAttribute('role', 'img');
    bottle.setAttribute('aria-label', `ECOMAX — ${name}, ${size}`);
    bottle.title = `ECOMAX — ${name}, ${size}`;
    bottle.querySelector('.ecomax-package-art')?.remove();
    bottle.insertAdjacentHTML('beforeend', svg);
  }

  function init() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.querySelectorAll('.product-card').forEach(render);
    grid.addEventListener('change', event => {
      if (event.target.matches('.volume-select')) render(event.target.closest('.product-card'));
    });
    new MutationObserver(records => {
      const cards = new Set();
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches('.product-card')) cards.add(node);
        node.querySelectorAll('.product-card').forEach(card => cards.add(card));
      }));
      cards.forEach(render);
    }).observe(grid, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
