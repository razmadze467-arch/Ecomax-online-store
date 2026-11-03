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

  const englishNames = new Map([
    ['ძრავის სარეცხი', 'ENGINE CLEANER'],
    ['დისკების და ალუმინის სარეცხი', 'WHEEL & ALUMINIUM CLEANER'],
    ['რადიატორის და წყლის სისტემის გამწმენდი', 'COOLING SYSTEM CLEANER'],
    ['ნაჭრის ქიმწმენდა', 'FABRIC CLEANER'],
    ['ტყავის ქიმწმენდა', 'LEATHER CLEANER'],
    ['საბურავის საპრიალებელი', 'TIRE SHINE'],
    ['ტორპედოს საპრიალებელი', 'DASHBOARD POLISH'],
    ['ტყავის მკვებავი', 'LEATHER CONDITIONER'],
    ['პლასმასების საშავებელი', 'PLASTIC BLACKENER'],
    ['ქაფი — წითელი', 'RED CAR WASH FOAM'],
    ['ქაფი — ღია ლურჯი', 'LIGHT BLUE CAR WASH FOAM'],
    ['ფოსფორი მანქანის', 'CAR PHOSPHOR']
  ]);

  // Wrap the existing product name without substituting a separate product catalog.
  function linesFor(name, limit) {
    const lines = [];
    for (const word of name.split(/\s+/)) {
      const last = lines.length - 1;
      if (last >= 0 && (lines[last] + ' ' + word).length <= limit) lines[last] += ' ' + word;
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
    const english = englishNames.get(name) || 'CAR CARE';
    const size = `${volume} ლ`;
    const signature = `${name}|${english}|${volume}|${liquid.color}`;
    if (bottle.dataset.packagingSignature === signature) return;
    bottle.dataset.packagingSignature = signature;
    const id = `ecomax-package-${++nextId}`;
    const canister = volume >= 2;
    const small = volume === 0.5;
    const labelY = canister ? 110 : small ? 116 : 106;
    const labelHeight = canister ? 107 : small ? 106 : 110;
    const nameLines = linesFor(name, canister ? 23 : small ? 16 : 18);
    const englishLines = linesFor(english, canister ? 29 : small ? 20 : 23);
    const footerY = labelHeight - 22;
    // Separate text regions keep long bilingual names clear of the volume footer.
    const lineHeight = Math.min(10.5,
      (footerY - 4 - 42 - 10.5 - (englishLines.length - 1) * 7.5) / Math.max(1, nameLines.length - 1));
    const nameFontSize = Math.min(8.8, lineHeight - 1);
    const lastBaseline = 42 + (nameLines.length - 1) * lineHeight + 10.5 + (englishLines.length - 1) * 7.5;
    const nameY = labelY + 42 + Math.max(0, (footerY - 4 - lastBaseline) / 2);
    const englishY = nameY + (nameLines.length - 1) * lineHeight + 10.5;
    const body = canister
      ? 'M35 58 V45 Q35 41 39 41 H67 Q71 41 71 45 V48 H132 Q143 48 147 64 L160 92 V220 Q160 232 146 232 H34 Q20 232 20 218 V91 Q20 76 35 58 Z M68 62 Q62 62 62 69 V83 Q62 89 69 89 H123 Q130 89 127 81 L122 66 Q121 62 114 62 Z'
      : small
        ? 'M70 65 H110 V80 Q110 88 122 98 Q132 106 132 123 V218 Q132 231 119 231 H61 Q48 231 48 218 V123 Q48 106 58 98 Q70 88 70 80 Z'
        : 'M68 35 H112 V57 Q112 68 127 78 Q142 89 142 109 V218 Q142 232 128 232 H52 Q38 232 38 218 V109 Q38 89 53 78 Q68 68 68 57 Z';
    // A small overhang seats each screw cap on its own neck, including the jug spout.
    const cap = canister ? { x: 32, y: 27, width: 42, height: 18 }
      : small ? { x: 68, y: 50, width: 44, height: 17 }
        : { x: 66, y: 18, width: 48, height: 19 };
    const capRibs = Array.from({ length: Math.floor((cap.width - 8) / 3) }, (_, index) => {
      const x = cap.x + 4 + index * 3;
      return `<path d="M${x} ${cap.y + 5}v${cap.height - 8}" stroke="#020a10" stroke-opacity=".65"/>
        <path d="M${x + .8} ${cap.y + 5}v${cap.height - 8}" stroke="#b5cbd3" stroke-opacity=".28" stroke-width=".65"/>`;
    }).join('');
    const labelX = canister ? 32 : small ? 52 : 45;
    const labelWidth = canister ? 116 : small ? 76 : 90;
    const center = 90;
    const labelRight = labelX + labelWidth;
    const labelBottom = labelY + labelHeight;
    const labelPath = `M${labelX} ${labelY + 2} Q90 ${labelY - 3} ${labelRight} ${labelY + 2} V${labelBottom - 3} Q90 ${labelBottom + 3} ${labelX} ${labelBottom - 3} Z`;
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
          <stop stop-color="#0c1820"/><stop offset=".25" stop-color="#4b606b"/>
          <stop offset=".5" stop-color="#293d48"/><stop offset="1" stop-color="#09131a"/>
        </linearGradient>
        <linearGradient id="${id}-cap-top" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#526874"/><stop offset="1" stop-color="#243742"/>
        </linearGradient>
        <linearGradient id="${id}-label" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#18313e"/><stop offset=".5" stop-color="#081820"/><stop offset="1" stop-color="#172d3e"/>
        </linearGradient>
        <linearGradient id="${id}-paper" x1="0" x2="1">
          <stop stop-color="#b0bec1"/><stop offset=".12" stop-color="#e9efed"/>
          <stop offset=".48" stop-color="#fffffa"/><stop offset=".86" stop-color="#edf2ef"/>
          <stop offset="1" stop-color="#bac9cb"/>
        </linearGradient>
        <linearGradient id="${id}-laminate" x1="0" x2="1">
          <stop stop-color="#00111b" stop-opacity=".18"/><stop offset=".1" stop-color="#fff" stop-opacity=".12"/>
          <stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".84" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#00111b" stop-opacity=".14"/>
        </linearGradient>
        <clipPath id="${id}-body"><path d="${body}" clip-rule="evenodd"/></clipPath>
        <clipPath id="${id}-sticker"><path d="${labelPath}"/></clipPath>
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
      <g class="package-cap">
        <rect class="package-cap-ring" x="${cap.x + 1}" y="${cap.y + cap.height - 1.5}" width="${cap.width - 2}" height="4" rx="1.2" fill="url(#${id}-cap)" stroke="#9aafb8" stroke-opacity=".35" stroke-width=".6"/>
        <rect class="package-cap-grip" x="${cap.x}" y="${cap.y + 3}" width="${cap.width}" height="${cap.height - 3}" rx="2" fill="url(#${id}-cap)" stroke="#90a5af" stroke-opacity=".6" stroke-width=".7"/>
        ${capRibs}
        <ellipse cx="${cap.x + cap.width / 2}" cy="${cap.y + 3}" rx="${cap.width / 2}" ry="3" fill="url(#${id}-cap-top)" stroke="#abc0ca" stroke-opacity=".55" stroke-width=".7"/>
        <ellipse cx="${cap.x + cap.width / 2}" cy="${cap.y + 3}" rx="${cap.width / 2 - 3}" ry="1.6" fill="none" stroke="#a8bec9" stroke-opacity=".22" stroke-width=".6"/>
        <path d="M${cap.x + 2} ${cap.y + cap.height - 1}h${cap.width - 4}" stroke="#020a10" stroke-opacity=".8" stroke-width=".8"/>
      </g>
      <g class="package-label" clip-path="url(#${id}-body)">
        <path class="package-label-stock" d="${labelPath}" fill="url(#${id}-paper)" stroke="#091923" stroke-opacity=".65" stroke-width=".8"/>
        <g clip-path="url(#${id}-sticker)">
          <rect x="${labelX}" y="${labelY - 2}" width="${labelWidth}" height="32" fill="url(#${id}-label)"/>
          <rect x="${labelX}" y="${labelY + 28}" width="${labelWidth}" height="2.5" fill="${liquid.color}"/>
          <rect x="${labelX + 2}" y="${labelY + 35}" width="1.6" height="${footerY - 39}" fill="${liquid.shadow}" opacity=".65"/>
          <text class="package-label-brand" x="90" y="${labelY + 16}" font-size="${small ? 13.5 : 16}" letter-spacing="1.1">ECOMAX</text>
          <text class="package-label-series" x="90" y="${labelY + 24}" data-label-width="${labelWidth - 12}">ავტოქიმია / CAR CARE</text>
          ${nameLines.map((line, index) => `<text class="package-label-name" lang="ka" x="${center}" y="${nameY + index * lineHeight}" style="font-size:${nameFontSize}px" data-label-width="${labelWidth - 14}">${escape(line)}</text>`).join('')}
          ${englishLines.map((line, index) => `<text class="package-label-english" lang="en" x="${center}" y="${englishY + index * 7.5}" data-label-width="${labelWidth - 14}">${escape(line)}</text>`).join('')}
          <path d="M${labelX + 7} ${labelY + footerY}h${labelWidth - 14}" stroke="#647b83" stroke-opacity=".35" stroke-width=".6"/>
          <text class="package-label-caption" x="90" y="${labelBottom - 15}" data-label-width="${labelWidth - 14}">მოცულობა / NET VOL.</text>
          <text class="package-label-volume" x="90" y="${labelBottom - 4}">${escape(size)} / L</text>
          <path d="${labelPath}" fill="url(#${id}-laminate)" pointer-events="none"/>
        </g>
      </g>
    </svg>`;
    bottle.classList.add('ecomax-packaging');
    bottle.dataset.packageShape = canister ? 'canister' : small ? 'bottle-500' : 'bottle-1000';
    bottle.dataset.liquidColor = liquid.color;
    bottle.setAttribute('role', 'img');
    bottle.setAttribute('aria-label', `ECOMAX — ${name} / ${english}, ${size}`);
    bottle.title = `ECOMAX — ${name} / ${english}, ${size}`;
    bottle.querySelector('.ecomax-package-art')?.remove();
    bottle.insertAdjacentHTML('beforeend', svg);
    // Measure the actual font instead of stretching every line to a fixed width.
    bottle.querySelectorAll('[data-label-width]').forEach(text => {
      const width = Number(text.dataset.labelWidth);
      if (typeof text.getComputedTextLength === 'function' && text.getComputedTextLength() > width) {
        text.setAttribute('textLength', String(width));
        text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
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
