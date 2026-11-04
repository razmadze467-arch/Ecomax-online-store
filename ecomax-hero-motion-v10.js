/* ECOMAX photographic hero V10 — perspective-correct wheel centers.
   Photograph is the source of truth. Only the inner rim spins; fixed tyres,
   bodywork, foam and brake calipers never rotate. */
(() => {
  'use strict';

  const PHOTO = 'assets/ecomax-foam-hero.webp';
  const SIZE = 416;
  const DURATION = 3400;
  const TURNS = 3;

  function start() {
    const stage = document.querySelector('.hero-visual .neon-hero-stage');
    if (!stage || stage.dataset.ecomaxWheelV10) return;

    const front = stage.querySelector('.hero-wheel-front');
    const rear = stage.querySelector('.hero-wheel-rear');
    const motion = stage.querySelector('.hero-photo-motion');
    if (!front || !rear || !motion) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const photo = new Image();
    photo.decoding = 'async';
    photo.src = new URL(PHOTO, document.baseURI).href;
    stage.dataset.ecomaxWheelV10 = 'loading';

    // Centers and radii are measured on the original 2032x774 photograph.
    // These are deliberately INSIDE the metal rim, not around the full tyre.
    const wheels = [
      { el: front, cx: 1167, cy: 474, rx: 54, ry: 120 },
      { el: rear, cx: 765, cy: 418, rx: 24, ry: 75 }
    ];
    let loop = 0, began = 0, playing = false, resizeFrame = 0;

    function centerAndExtract() {
      const sw = stage.clientWidth, sh = stage.clientHeight;
      if (!sw || !sh || !photo.naturalWidth) return;
      const scale = Math.max(sw / photo.naturalWidth, sh / photo.naturalHeight);
      const computed = getComputedStyle(stage);
      const pct = value => {
        if (!value || value === 'center') return .5;
        if (value === 'left' || value === 'top') return 0;
        if (value === 'right' || value === 'bottom') return 1;
        if (value.endsWith('%')) return parseFloat(value) / 100;
        return .5;
      };
      const imageX = (sw - photo.naturalWidth * scale) * pct(computed.backgroundPositionX);
      const imageY = (sh - photo.naturalHeight * scale) * pct(computed.backgroundPositionY);

      for (const wheel of wheels) {
        const { el, cx, cy, rx, ry, ctx, src, stationary } = wheel;
        const left = imageX + (cx - rx) * scale;
        const top = imageY + (cy - ry) * scale;
        el.style.setProperty('left', left + 'px', 'important');
        el.style.setProperty('top', top + 'px', 'important');
        el.style.setProperty('width', 2 * rx * scale + 'px', 'important');
        el.style.setProperty('height', 2 * ry * scale + 'px', 'important');
        el.style.setProperty('aspect-ratio', 'auto', 'important');
        el.style.setProperty('transform', 'none', 'important');

        const g = src.getContext('2d', { willReadFrequently: true });
        g.clearRect(0, 0, SIZE, SIZE);
        // Source crop follows the actual photo pixel coordinates, independent
        // of viewport dimensions and the site's background-image position.
        g.drawImage(photo, cx - rx, cy - ry, 2 * rx, 2 * ry, 0, 0, SIZE, SIZE);

        const data = g.getImageData(0, 0, SIZE, SIZE);
        const pixels = data.data;
        const fixed = new Uint8ClampedArray(pixels.length);
        const h = SIZE / 2;
        const visibleRadius = h * .93;
        for (let y = 0; y < SIZE; y++) {
          for (let x = 0; x < SIZE; x++) {
            const idx = (y * SIZE + x) * 4;
            const dist = Math.hypot(x - h, y - h);
            // Keep brake-caliper reds at the original photo position.
            const red = pixels[idx], green = pixels[idx + 1], blue = pixels[idx + 2];
            const caliper = red > 87 && red > green * 1.48 + 13 &&
                            red > blue * 1.28 + 11 && dist < visibleRadius;
            if (caliper) {
              const fade = Math.max(0, Math.min(1, (visibleRadius - dist) / 12));
              fixed[idx] = red;
              fixed[idx + 1] = green;
              fixed[idx + 2] = blue;
              fixed[idx + 3] = Math.round(pixels[idx + 3] * fade);
            }
          }
        }
        stationary.getContext('2d').putImageData(new ImageData(fixed, SIZE, SIZE), 0, 0);
        ctx.clearRect(0, 0, SIZE, SIZE);
        wheel.ready = true;
      }
    }

    function paint(wheel, angle) {
      if (!wheel.ready) return;
      const { ctx, src, stationary } = wheel;
      const h = SIZE / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.translate(h, h);
      // The square canvas is stretched into the photographed wheel ellipse
      // by CSS. A circular rotation here becomes perspective-elliptical.
      ctx.rotate(angle);
      ctx.drawImage(src, -h, -h);
      ctx.restore();

      // Tight, anti-aliased mask prevents any rotating tyre, arch or foam.
      ctx.globalCompositeOperation = 'destination-in';
      const edge = ctx.createRadialGradient(h, h, h * .80, h, h, h * .94);
      edge.addColorStop(0, '#000');
      edge.addColorStop(.75, '#000');
      edge.addColorStop(1, 'transparent');
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(stationary, 0, 0);
    }

    function tick(time) {
      if (!playing) return;
      const t = Math.min(1, Math.max(0, (time - began) / DURATION));
      // Smooth easing with exactly three rotations, returning to photo.
      const ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const angle = ease * 2 * Math.PI * TURNS;
      for (const wheel of wheels) paint(wheel, angle);

      if (t < 1 && !reduced.matches) {
        loop = requestAnimationFrame(tick);
      } else {
        playing = false;
        stage.classList.remove('hero-wheels-spinning');
        for (const wheel of wheels) wheel.ctx.clearRect(0, 0, SIZE, SIZE);
      }
    }

    function play(event) {
      event.stopImmediatePropagation();
      if (reduced.matches) return;
      if (!wheels.every(w => w.ready)) centerAndExtract();
      if (!wheels.every(w => w.ready)) return;
      cancelAnimationFrame(loop);
      playing = true;
      began = performance.now();
      stage.classList.add('hero-wheels-spinning');
      loop = requestAnimationFrame(tick);
    }

    function insertFloor() {
      if (motion.querySelector('.ecomax-v8-floor')) return;
      motion.insertAdjacentHTML('beforeend', [
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

    photo.onload = () => {
      for (const wheel of wheels) {
        // Neutralize the older photo-crop animation, but retain its button.
        wheel.el.querySelector('.hero-wheel-disc')?.remove();
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-wheel-live';
        canvas.width = canvas.height = SIZE;
        canvas.setAttribute('aria-hidden', 'true');
        wheel.el.prepend(canvas);
        wheel.ctx = canvas.getContext('2d');
        wheel.src = document.createElement('canvas');
        wheel.src.width = wheel.src.height = SIZE;
        wheel.stationary = document.createElement('canvas');
        wheel.stationary.width = wheel.stationary.height = SIZE;
        wheel.el.addEventListener('click', play, { capture: true });
      }
      stage.classList.add('ecomax-hero-v8', 'ecomax-hero-v10');
      stage.dataset.ecomaxWheelV10 = 'ready';
      insertFloor();
      centerAndExtract();
      window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (playing) {
            cancelAnimationFrame(loop);
            playing = false;
            stage.classList.remove('hero-wheels-spinning');
          }
          centerAndExtract();
        });
      }, { passive: true });
      reduced.addEventListener?.('change', e => {
        if (e.matches) {
          cancelAnimationFrame(loop);
          playing = false;
          stage.classList.remove('hero-wheels-spinning');
          wheels.forEach(w => w.ctx.clearRect(0, 0, SIZE, SIZE));
        }
      });
    };
    photo.onerror = () => {
      stage.dataset.ecomaxWheelV10 = 'image-unavailable';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else start();
})();
