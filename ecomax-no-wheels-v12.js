/* ECOMAX V12: no wheel movement, no clickable rims.
   Safe isolated change: only the home-page hero is modified. */
(() => {
  'use strict';
  function restoreStaticPhoto() {
    const stage = document.querySelector('.hero-visual .neon-hero-stage');
    if (!stage) return false;
    if (stage.dataset.ecomaxNoWheelsV12 === 'ready') return true;

    stage.classList.remove('hero-wheels-spinning', 'ecomax-v11-spinning', 'ecomax-wheel-v11');
    stage.classList.add('ecomax-hero-v8', 'ecomax-no-wheels-v12');

    // Remove actual controls, not just the spin animation or SVG.
    // Prevents previous click handlers from ever being triggered.
    stage.querySelectorAll('.hero-wheel-control, .ecomax-v11-wheel-assembly, .hero-wheel-live')
      .forEach(el => el.remove());

    // Preserve the moving ground water independently of the wheel script.
    const motion = stage.querySelector('.hero-photo-motion');
    if (motion && !motion.querySelector('.ecomax-v8-floor')) {
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
    stage.dataset.ecomaxNoWheelsV12 = 'ready';
    return true;
  }

  function boot() {
    if (restoreStaticPhoto()) return;
    // The stage is inserted by the storefront's inline script at DOM ready.
    // Retry after it renders rather than depending on script/listener order.
    let frames = 0;
    const probe = () => {
      if (restoreStaticPhoto() || ++frames > 120) return;
      requestAnimationFrame(probe);
    };
    requestAnimationFrame(probe);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
