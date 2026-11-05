/* ECOMAX V14 cinematic hero
   Image-coordinate-registered lighting and water glints.
   No replacement car, no moving wheel, no free-floating white foam lines. */
(() => {
  'use strict';
  const SOURCE = 'assets/ecomax-foam-hero.webp';
  function init() {
    const hero = document.querySelector('.hero');
    const stage = hero?.querySelector('.neon-hero-stage');
    if (!hero || !stage || stage.dataset.ecmx14 === 'ready') return;

    // Previously appended elements did not correspond to the actual picture.
    stage.querySelectorAll(
      '.hero-photo-motion,.neon-car-ground,.neon-car-rig,.neon-product-rack,' +
      '.neon-hero-note,.hero-wheel-control,.ecomax-v11-wheel-assembly'
    ).forEach(node => node.remove());
    stage.classList.remove('hero-wheels-spinning','ecomax-v11-spinning','ecomax-wheel-v11');
    stage.classList.add('ecmx14-ready');
    stage.dataset.ecmx14 = 'ready';

    const layer = document.createElement('div');
    layer.className = 'ecmx14-effects';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = [
      '<span class="ecmx14-lamp main" data-area="lampMain"></span>',
      '<span class="ecmx14-lamp far" data-area="lampFar"></span>',
      '<span class="ecmx14-headlight-haze" data-area="hazeMain"></span>',
      '<span class="ecmx14-headlight-haze" data-area="hazeFar"></span>',
      '<span class="ecmx14-foam-light" data-area="foam"></span>',
      '<span class="ecmx14-floor-light" data-area="floor"></span>',
      '<span class="ecmx14-ripple" data-area="ripple1"></span>',
      '<span class="ecmx14-ripple" data-area="ripple2"></span>'
    ].join('');
    stage.appendChild(layer);

    // Exact coordinates of the original 2032x774 hero photo.
    // Areas are deliberately soft and translucent, NOT replaced shapes.
    const regions = {
      lampMain: [1240, 278, 315, 88],
      lampFar: [1837, 274, 61, 85],
      hazeMain: [1300, 273, 210, 100],
      hazeFar: [1805, 270, 120, 110],
      foam: [940, 165, 895, 270],
      floor: [755, 618, 1120, 125],
      ripple1: [1068, 648, 160, 22],
      ripple2: [1410, 691, 180, 25]
    };
    const art = new Image();
    art.decoding = 'async';
    art.src = new URL(SOURCE, document.baseURI).href;
    let resizeFrame = 0;

    const asPercent = val => {
      if (val === 'left' || val === 'top') return 0;
      if (val === 'right' || val === 'bottom') return 1;
      if (typeof val === 'string' && val.endsWith('%')) {
        const n = parseFloat(val);
        return Number.isFinite(n) ? n / 100 : .5;
      }
      return .5;
    };

    function registerEffects() {
      const width = stage.clientWidth, height = stage.clientHeight;
      if (!width || !height || !art.naturalWidth || !art.naturalHeight) return;
      const cs = getComputedStyle(stage);
      const bgSize = cs.backgroundSize.trim();
      const iw = art.naturalWidth, ih = art.naturalHeight;
      let scale;
      // Desktop: cover, mobile: auto 65%.
      if (bgSize === 'cover') {
        scale = Math.max(width / iw, height / ih);
      } else if (/auto\s+[\d.]+%/.test(bgSize)) {
        scale = height * parseFloat(bgSize.match(/[\d.]+%/)[0]) / (100 * ih);
      } else if (/^[\d.]+%\s+auto/.test(bgSize)) {
        scale = width * parseFloat(bgSize) / (100 * iw);
      } else {
        scale = Math.max(width / iw, height / ih);
      }
      const artLeft = (width - iw * scale) * asPercent(cs.backgroundPositionX);
      const artTop = (height - ih * scale) * asPercent(cs.backgroundPositionY);
      for (const node of layer.children) {
        const r = regions[node.dataset.area];
        if (!r) continue;
        const [x,y,w,h] = r;
        node.style.left = (artLeft + x * scale) + 'px';
        node.style.top = (artTop + y * scale) + 'px';
        node.style.width = (w * scale) + 'px';
        node.style.height = (h * scale) + 'px';
      }
    }

    art.onload = () => requestAnimationFrame(registerEffects);
    if (art.complete && art.naturalWidth) requestAnimationFrame(registerEffects);
    art.onerror = () => { layer.remove(); };
    const refresh = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(registerEffects);
    };
    window.addEventListener('resize', refresh, { passive:true });
    window.addEventListener('orientationchange', refresh, { passive:true });
    if (window.ResizeObserver) new ResizeObserver(refresh).observe(stage);
  }

  function boot(tries=0) {
    if (document.querySelector('.hero .neon-hero-stage')) return init();
    if (tries < 30) requestAnimationFrame(() => boot(tries+1));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot(), {once:true});
  } else boot();
})();
