/* ECOMAX photographic hero V8 — image-registered wheel rotation and floor runoff.
   Only enhances the existing hero. Does not touch catalog, orders or auth. */
(function () {
  'use strict';

  function init() {
    const stage = document.querySelector('.hero-visual .neon-hero-stage');
    if (!stage || stage.dataset.ecomaxPhotoMotionV8) return;

    const originalWheels = Array.from(stage.querySelectorAll('.hero-wheel-control'));
    const layer = stage.querySelector('.hero-photo-motion');
    if (!originalWheels.length || !layer) return;
    stage.dataset.ecomaxPhotoMotionV8 = 'loading';

    const photo = new Image();
    photo.decoding = 'async';
    photo.src = new URL('assets/ecomax-foam-hero.webp', document.baseURI).href;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wheelSize = 384;
    const wheelData = [];
    let running = false;
    let lastTime = 0;
    let stopAt = 0;
    let resizeFrame = 0;
    let motionFrame = 0;
    let spinAngle = 0;

    function makeWater() {
      if (layer.querySelector('.ecomax-v8-floor')) return;
      layer.insertAdjacentHTML('beforeend', [
        '<svg class="ecomax-v8-floor" viewBox="0 0 1000 470" preserveAspectRatio="none" aria-hidden="true">',
        '<path class="ecomax-v8-runoff" d="M310 418 C430 407 497 442 583 426 S766 399 985 421"/>',
        '<path class="ecomax-v8-runoff" d="M360 442 C478 420 541 466 659 443 S813 429 1035 454"/>',
        '<path class="ecomax-v8-runoff" d="M300 461 C452 447 528 481 657 460 S820 454 1015 472"/>',
        '<path class="ecomax-v8-runoff" d="M476 404 C540 429 598 417 656 431 S807 436 906 427"/>',
        '<ellipse class="ecomax-v8-ripple" cx="575" cy="445" rx="52" ry="11"/>',
        '<ellipse class="ecomax-v8-ripple delay-1" cx="692" cy="457" rx="65" ry="10"/>',
        '<ellipse class="ecomax-v8-ripple delay-2" cx="839" cy="449" rx="73" ry="11"/>',
        '</svg>'
      ].join(''));
    }

    function createWheels() {
      originalWheels.forEach(control => {
        const oldDisc = control.querySelector('.hero-wheel-disc');
        if (oldDisc) oldDisc.remove();
        const visible = document.createElement('canvas');
        visible.className = 'hero-wheel-live';
        visible.width = wheelSize;
        visible.height = wheelSize;
        visible.setAttribute('aria-hidden', 'true');
        control.prepend(visible);
        const source = document.createElement('canvas');
        source.width = wheelSize;
        source.height = wheelSize;
        wheelData.push({
          control, source,
          visible, ctx: visible.getContext('2d', { alpha: true }),
          sourceCtx: source.getContext('2d', { alpha: true })
        });
        // Capture phase takes priority over the older click listener.
        control.addEventListener('click', event => {
          event.stopImmediatePropagation();
          if (isReduced.matches) return;
          if (!wheelData.every(item => item.ready)) rebuildSprites();
          stopAt = performance.now() + 3300;
          if (!running) {
            running = true;
            lastTime = 0;
            spinAngle = 0;
            stage.classList.add('hero-wheels-spinning');
            motionFrame = requestAnimationFrame(render);
          }
        }, { capture: true });
      });
    }

    function rebuildSprites() {
      if (!photo.naturalWidth || !stage.clientWidth || !stage.clientHeight) return;
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const photoScale = Math.max(stageWidth / photo.naturalWidth, stageHeight / photo.naturalHeight);
      const renderWidth = photo.naturalWidth * photoScale;
      const renderHeight = photo.naturalHeight * photoScale;
      const style = getComputedStyle(stage);
      // Honor background-position: center center on desktop, 68% center on mobile.
      const posX = parseFloat(style.backgroundPositionX);
      const posY = parseFloat(style.backgroundPositionY);
      const fracX = Number.isFinite(posX) ? posX / 100 : .5;
      const fracY = Number.isFinite(posY) ? posY / 100 : .5;
      const photoLeft = (stageWidth - renderWidth) * fracX;
      const photoTop = (stageHeight - renderHeight) * fracY;
      wheelData.forEach(item => {
        const { control, source, sourceCtx } = item;
        const left = control.offsetLeft;
        const top = control.offsetTop;
        const width = control.offsetWidth;
        const height = control.offsetHeight;
        item.ready = false;
        if (width <= 0 || height <= 0) return;
        // Extract exactly what is under the wheel; do not rotate the vehicle photo.
        const srcX = (left - photoLeft) / photoScale;
        const srcY = (top - photoTop) / photoScale;
        const srcW = width / photoScale;
        const srcH = height / photoScale;
        sourceCtx.clearRect(0, 0, wheelSize, wheelSize);
        sourceCtx.drawImage(photo, srcX, srcY, srcW, srcH, 0, 0, wheelSize, wheelSize);
        item.ready = true;
      });
    }

    function render(now) {
      if (!running) return;
      const delta = Math.min(50, Math.max(0, now - (lastTime || now)));
      lastTime = now;
      spinAngle += (delta / 1000) * Math.PI * 3.4;
      wheelData.forEach(item => {
        if (!item.ready) return;
        const ctx = item.ctx;
        ctx.clearRect(0, 0, wheelSize, wheelSize);
        ctx.save();
        ctx.translate(wheelSize / 2, wheelSize / 2);
        ctx.rotate(spinAngle);
        ctx.drawImage(item.source, -wheelSize / 2, -wheelSize / 2, wheelSize, wheelSize);
        ctx.restore();
      });
      if (now < stopAt && !isReduced.matches) {
        motionFrame = requestAnimationFrame(render);
      } else {
        running = false;
        lastTime = 0;
        stage.classList.remove('hero-wheels-spinning');
        wheelData.forEach(item => item.ctx.clearRect(0, 0, wheelSize, wheelSize));
      }
    }

    photo.onload = function () {
      stage.classList.add('ecomax-hero-v8');
      stage.dataset.ecomaxPhotoMotionV8 = 'ready';
      createWheels();
      makeWater();
      requestAnimationFrame(rebuildSprites);
      window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(rebuildSprites);
      }, { passive: true });
      isReduced.addEventListener?.('change', event => {
        if (event.matches) {
          cancelAnimationFrame(motionFrame);
          running = false;
          stage.classList.remove('hero-wheels-spinning');
          wheelData.forEach(item => item.ctx.clearRect(0, 0, wheelSize, wheelSize));
        }
      });
    };
    photo.onerror = function () {
      // Keep the original static photograph and existing wheel controls unchanged.
      stage.dataset.ecomaxPhotoMotionV8 = 'unavailable';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
