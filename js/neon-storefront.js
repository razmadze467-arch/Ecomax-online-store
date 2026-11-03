(function () {
  'use strict';

  function clonePackaging(source, index) {
    const svg = source.cloneNode(true);
    svg.classList.add('neon-hero-package');
    const ids = new Map();
    svg.querySelectorAll('[id]').forEach(node => {
      const oldId = node.id;
      node.id = `${oldId}-hero-${index}`;
      ids.set(oldId, node.id);
    });
    svg.querySelectorAll('*').forEach(node => {
      Array.from(node.attributes).forEach(attribute => {
        let value = attribute.value;
        ids.forEach((replacement, original) => {
          value = value.replaceAll(`url(#${original})`, `url(#${replacement})`);
        });
        if (value !== attribute.value) node.setAttribute(attribute.name, value);
      });
    });
    return svg;
  }

  function init() {
    const hero = document.querySelector('.hero');
    const visual = hero?.querySelector('.hero-visual');
    if (!hero || !visual || visual.querySelector('.neon-hero-stage')) return;

    const stage = document.createElement('div');
    stage.className = 'neon-hero-stage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = `
      <div class="neon-car-ground"></div>
      <div class="neon-car-rig">
      <svg class="neon-car-svg" viewBox="0 0 780 350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neonCarBody" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101a"/><stop offset=".5" stop-color="#16445d"/><stop offset="1" stop-color="#02070d"/></linearGradient>
          <linearGradient id="neonWindow" x1="0" y1="0" x2="1"><stop stop-color="#0d3852"/><stop offset=".55" stop-color="#020913"/><stop offset="1" stop-color="#167fb0"/></linearGradient>
          <filter id="neonBlueGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="neonOrangeGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M88 238 Q106 181 177 161 L259 84 Q292 58 370 55 H482 Q524 58 566 91 L629 157 Q694 171 720 226 L727 251 H63Z" fill="url(#neonCarBody)" stroke="#36caff" stroke-width="3"/>
        <path d="M269 94 Q297 71 372 69 H472 Q505 72 540 98 L580 151 H204Z" fill="url(#neonWindow)" stroke="#72ddff" stroke-width="2"/>
        <path d="M377 72V150M478 72l58 79M250 153h335" fill="none" stroke="#179fd2" stroke-width="2"/>
        <path d="M107 215 Q158 193 212 197M580 195q76-9 121 23" fill="none" stroke="#ff761b" stroke-width="5" filter="url(#neonOrangeGlow)"/>
        <path d="M74 246H726M141 169q215 22 463-4" fill="none" stroke="#1bc6ff" stroke-width="4" opacity=".85" filter="url(#neonBlueGlow)"/>
        <path d="M75 234l63-8 42 13-61 11zM661 220l47 10 11 17-68-9z" fill="#baf5ff" filter="url(#neonBlueGlow)"/>
        <path d="M277 158l-25 88M535 155l30 89" fill="none" stroke="#115a79" stroke-width="2"/>
        <g class="neon-wheel neon-wheel-front"><circle cx="205" cy="248" r="62" fill="#03080e" stroke="#25c9ff" stroke-width="4"/><circle cx="205" cy="248" r="38" fill="#172734" stroke="#ff7218" stroke-width="4"/><circle cx="205" cy="248" r="10" fill="#e4f8ff"/><path d="M205 211v74M168 248h74M179 222l52 52M231 222l-52 52" stroke="#7a9cae" stroke-width="5"/></g>
        <g class="neon-wheel neon-wheel-back"><circle cx="591" cy="248" r="62" fill="#03080e" stroke="#25c9ff" stroke-width="4"/><circle cx="591" cy="248" r="38" fill="#172734" stroke="#ff7218" stroke-width="4"/><circle cx="591" cy="248" r="10" fill="#e4f8ff"/><path d="M591 211v74M554 248h74M565 222l52 52M617 222l-52 52" stroke="#7a9cae" stroke-width="5"/></g>
        <path d="M101 266 Q390 309 708 267" fill="none" stroke="#159ed8" stroke-width="5" opacity=".75" filter="url(#neonBlueGlow)"/>
        <path d="M304 170q12 8 20 0M479 170q12 8 20 0" fill="none" stroke="#9ceaff" stroke-width="4"/>
        <g class="neon-car-foam" filter="url(#neonBlueGlow)">
          <path d="M214 157c31-18 67-23 102-15 27 6 47 21 74 18 24-3 36-18 62-18 25 0 49 9 71 20" fill="none" stroke="#e9fbff" stroke-width="14" stroke-linecap="round" opacity=".92"/>
          <path d="M280 105c29-16 61-19 94-17 24 2 43 11 66 10 20-1 36-9 56-4" fill="none" stroke="#c8f5ff" stroke-width="11" stroke-linecap="round" opacity=".88"/>
          <path d="M254 151q8 28 2 55M334 153q-3 30 7 54M451 151q10 31 3 58M520 158q-2 24 7 43" fill="none" stroke="#efffff" stroke-width="7" stroke-linecap="round"/>
          <circle cx="301" cy="132" r="9" fill="#fff"/><circle cx="352" cy="145" r="7" fill="#dffaff"/><circle cx="423" cy="133" r="10" fill="#fff"/><circle cx="483" cy="145" r="6" fill="#e5fcff"/>
        </g>
        <text x="392" y="214" fill="#dff8ff" opacity=".7" text-anchor="middle" font-family="Arial" font-weight="800" font-size="19" letter-spacing="5">ECOMAX</text>
      </svg>
      <div class="neon-foam-cannon"><span></span></div>
      <div class="neon-foam-stream" aria-hidden="true"></div>
      <div class="neon-foam-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="neon-product-rack"></div>
      <div class="neon-hero-note"><i></i><span>PROFESSIONAL AUTO CHEMISTRY / CAR CARE</span></div>`;
    visual.appendChild(stage);

    const rack = stage.querySelector('.neon-product-rack');
    const featured = Array.from(document.querySelectorAll('#productsGrid .ecomax-package-art')).slice(0, 4);
    featured.forEach((source, index) => rack.appendChild(clonePackaging(source, index)));
    rack.hidden = featured.length === 0;

    const rig = stage.querySelector('.neon-car-rig');
    let frame = 0;
    visual.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const bounds = visual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        rig.style.setProperty('--car-tilt-y', `${x * 4.5}deg`);
        rig.style.setProperty('--car-tilt-x', `${y * -2.5}deg`);
        rig.style.setProperty('--car-shift-x', `${x * 8}px`);
        rig.style.setProperty('--car-shift-y', `${y * 4}px`);
      });
    });
    visual.addEventListener('pointerleave', () => {
      rig.style.removeProperty('--car-tilt-y');
      rig.style.removeProperty('--car-tilt-x');
      rig.style.removeProperty('--car-shift-x');
      rig.style.removeProperty('--car-shift-y');
    });

    const serviceStrip = document.createElement('section');
    serviceStrip.className = 'neon-service-strip';
    serviceStrip.setAttribute('aria-label', 'ECOMAX-ის უპირატესობები');
    serviceStrip.innerHTML = `
      <article class="neon-service"><svg viewBox="0 0 48 48"><path d="M4 11h25v22H4zM29 18h8l7 8v7H29M11 38a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM36 38a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg><div><strong>სწრაფი მიწოდება</strong><span>მთელი საქართველოს მასშტაბით</span></div></article>
      <article class="neon-service"><svg viewBox="0 0 48 48"><path d="M24 4 41 10v12c0 11-7 18-17 22C14 40 7 33 7 22V10zM16 24l5 5 11-12"/></svg><div><strong>ორიგინალური პროდუქცია</strong><span>ხარისხი და სანდო ფორმულა</span></div></article>
      <article class="neon-service"><svg viewBox="0 0 48 48"><path d="M38 16a17 17 0 1 0 2 17M38 7v11H27"/></svg><div><strong>მოცულობის არჩევანი</strong><span>0.5–20 ლიტრი ერთ სისტემაში</span></div></article>
      <article class="neon-service"><svg viewBox="0 0 48 48"><path d="M9 26v-5a15 15 0 0 1 30 0v5M9 25H5v12h9V25zM39 25h4v12h-9V25zM34 40c-3 3-7 4-12 4"/></svg><div><strong>პროფესიონალური კონსულტაცია</strong><span>შერჩევა და სწორი გამოყენება</span></div></article>`;
    hero.insertAdjacentElement('afterend', serviceStrip);

    const categories = document.createElement('section');
    categories.className = 'neon-category-section';
    categories.setAttribute('aria-labelledby', 'neonCategoryTitle');
    categories.innerHTML = `
      <div class="neon-category-head"><div><small>ECOMAX COLLECTIONS</small><h2 id="neonCategoryTitle">აირჩიე მოვლის მიმართულება</h2></div><a href="#products">ყველა პროდუქტი →</a></div>
      <div class="neon-category-grid">
        <a class="neon-category-card" href="#products" style="--edge:#18c9ff"><b>ავტოქიმია და მოვლა</b><span>პროფესიონალური სერია</span><i>→</i><svg viewBox="0 0 80 80"><path d="M13 48h54l-7-20H24zM20 48v12h8m32-12v12h-8M27 28l8-9h18l7 9M29 41h4m18 0h4"/></svg></a>
        <a class="neon-category-card" href="#products" style="--edge:#f05bff"><b>ბორბლები და საბურავები</b><span>წმენდა და ბზინვარება</span><i>→</i><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="29"/><circle cx="40" cy="40" r="13"/><path d="M40 11v16M40 53v16M11 40h16M53 40h16M20 20l11 11M60 20 49 31M20 60l11-11M60 60 49 49"/></svg></a>
        <a class="neon-category-card" href="#products" style="--edge:#ff7a1a"><b>სალონის მოვლა</b><span>ქსოვილი და ტყავი</span><i>→</i><svg viewBox="0 0 80 80"><path d="M24 17v29h35V30c0-7-5-13-12-13zM24 34H13v25h54V46H24M18 59v7m44-7v7"/></svg></a>
        <a class="neon-category-card" href="#home-care" style="--edge:#24c8ff"><b>სახლის ქიმია</b><span>სუფთა სივრცე ყოველდღე</span><i>→</i><svg viewBox="0 0 80 80"><path d="m12 38 28-23 28 23M20 34v31h40V34M32 65V46h16v19"/></svg></a>
        <a class="neon-category-card" href="#sprays" style="--edge:#ff9a1f"><b>სპრეები და აქსესუარები</b><span>დეტეილინგის სრული ნაკრები</span><i>→</i><svg viewBox="0 0 80 80"><path d="M32 20h21l8 8-12 8H32zM32 28H18v8h14M39 36v9l-6 7v15h25V52l-6-7v-9"/></svg></a>
      </div>`;
    serviceStrip.insertAdjacentElement('afterend', categories);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
